---
title: Audio crossfade
description: How to configure and use seamless song-to-song crossfading in DisTube.
---

DisTube supports audio crossfade between consecutive songs. Instead of a hard cut where one
stream stops, DisTube resolves the next song, and a new stream starts, crossfade creates a single
merged transition stream using FFmpeg's `acrossfade` filter.

The ending track fades out while the beginning of the next track fades in simultaneously, at 48kHz
stereo 16-bit PCM throughout.

## Enabling crossfade

Crossfade is disabled by default (`0` seconds). You can configure a global default for new queues
when instantiating DisTube:

```js
import { DisTube } from "@kattowo/distube";

const distube = new DisTube(client, {
  crossfade: {
    duration: 6, // Default crossfade duration in seconds (0 to 12)
    curve: "qsin", // Fade curve: "qsin" (equal-power), "tri", "esin", etc.
    warmup: 5, // Spawn the transition stream 5s early to warm up buffers
  },
});
```

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `duration` | `number` | `0` | The default crossfade duration in seconds for new queues (`0` disables). Clamped between `0` and `12`. |
| `curve` | `string` | `"qsin"` | The FFmpeg `acrossfade` fade curve applied to both tracks. `"qsin"` is an equal-power quarter-sine curve that avoids the -3dB center dip of linear fading. |
| `warmup` | `number` | `5` | How many seconds before the fade window begins the transition stream is spawned. This allows both input streams to buffer into memory before the boundary. |
| `preparePrimaryInput` | `function` | `undefined` | An optional adapter rewriting the fading-out song's input right before the transition stream is spawned. See [seek-hostile sources](#seek-hostile-streaming-sources). |

## Runtime queue control

Each `Queue` can read and adjust its crossfade duration independently, which makes it easy to bind
crossfade to a per-guild database setting:

```js
const queue = distube.getQueue(guildId);

// Read the current crossfade duration in seconds (0 = disabled)
console.log(queue.crossfade);

// Change crossfade for this queue (0 to 12 seconds)
queue.crossfade = 8;

// Optionally re-arm the crossfade immediately for the current song
// (useful if the duration was changed mid-playback)
queue.scheduleCrossfade();
```

## Seek-hostile streaming sources

The fade-out input of the transition FFmpeg is seeked near the end of the fading-out song, a few
seconds before the fade window. Streaming inputs that cannot fast-seek — HLS playlists, for
example — force FFmpeg to re-download the whole stream and throw away everything before the seek
position. On a slow source that download can outlast the warm-up window, and the fade never has a
chance to open.

The optional `crossfade.preparePrimaryInput` adapter is invoked right before the transition stream
is spawned, and can replace the fading-out song's input with one that starts at the boundary:

```js
const distube = new DisTube(client, {
  crossfade: {
    duration: 6,
    // Rewrite an HLS url into a local playlist that holds only the tail of
    // the song. The example shapes of the return value:
    //
    // - `url` — the replacement input url or path
    // - `seek` — the initial seek inside the replacement input, in seconds
    //   relative to it; omit it when the input starts exactly at the boundary
    // - `inputArgs` — FFmpeg input options replacing the default ones, which
    //   are tuned for http(s) streaming urls
    preparePrimaryInput: async (url, { seek, song }) => {
      if (!isPlaylistUrl(url)) return null; // fall back to the url as-is
      const local = await trimToTail(url, seek, song.duration);
      return {
        url: local.playlistPath,
        // FFmpeg input options of the replacement input. They replace the
        // defaults of the streaming urls.
        inputArgs: { analyzeduration: 0, f: "mpegts" },
      };
    },
  },
});
```

:::note
Returning `null` or `undefined` uses the original url as-is. A failure inside the adapter falls
back to the original url too: a hostile source degrades to no crossfade, never to a broken
playback.
:::

## How it works

1. **Warmup pre-spawn**: A few seconds before the fade window starts (controlled by `crossfade.warmup`),
   DisTube pre-spawns an FFmpeg process with two inputs:
   - Input 0: the current song seeked to its tail (`duration - crossfade`).
   - Input 1: the next song from its start.
2. **Boundary swap**: Exactly when the fade window begins, DisTube checks the playback drift. If
   playback is on schedule (within 0.75s tolerance), it swaps the audio resource into the Discord
   player without restarting or respawning the process.
3. **Queue progression**: At the swap boundary, the queue emits `finishSong` for the outgoing track
   and `playSong` for the incoming track, shifting the queue state as if the song had naturally
   ended.
4. **Safety & Fallback**: If the playback drifts excessively, or if a user pauses, seeks, skips,
   stops, shuffles, or jumps tracks during the fade window, the pending transition is automatically
   canceled and DisTube falls back to a standard track switch.

The crossfade is opportunistic: every failure degrades gracefully to the regular transition, never
to a broken playback or a stalled queue.

### When a transition never becomes audio

A transition stream that has not produced any audio when the fade window opens (one of its FFmpeg
inputs buffering forever, for example) does not take over the playback. Such a stream is aborted,
the crossfade state is cleared, and the song keeps its standard transition — the queue never sits
in a buffering state waiting for the fade.

### A dying transition process

A transition FFmpeg that dies mid-warmup is reported, not fatal anymore: the queue clears its
crossfade state and falls back to the regular transition. The `FFMPEG_EXITED` error of such a
failure carries the tail of the FFmpeg stderr output, so the exact reason (a hostile input, an
unsupported codec of the replacement input...) shows up in the message instead of an exit code
alone.

### The volume of the merged stream

The queue volume is applied to a stream at the moment it is created, not only when it is played.
A warm-up stream buffers PCM long before the boundary, and audio that sits in that buffer would
otherwise play at full volume, bursting at the fade boundary before the correct gain takes over.

A related hand-over detail: when the player switches resources, `@discordjs/voice` tears down the
pipeline of the outgoing stream, which surfaces as `ERR_STREAM_PREMATURE_CLOSE` on it. That is the
normal hand-over, not a crossfade failure.

### The mixing quality

Both inputs are normalized to 32-bit float before the `acrossfade` filter, so equal-power curves
sum without the 16-bit integer wrap-around, and a limiter keeps the mixed peaks below 0 dBFS. The
same fade is safe on loud dynamics-heavy tracks (EDM, dariacore, hyperflip) as it is on acoustic
ones.
