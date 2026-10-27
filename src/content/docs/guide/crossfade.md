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
