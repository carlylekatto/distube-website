---
title: Handling events
description: Every event of DisTube, and what it is for.
---

DisTube is event driven. The client emits an event for everything that happens to a queue, so you
never have to poll.

```js
import { Events } from "@kattowo/distube";

distube.on(Events.PLAY_SONG, (queue, song) => {
  // ...
});
```

## The events of a queue

| Event | Payload | When it is emitted |
| --- | --- | --- |
| `Events.INIT_QUEUE` | `queue` | A queue is created for a guild. |
| `Events.ADD_SONG` | `queue, song` | A song is added to the queue. |
| `Events.ADD_LIST` | `queue, playlist` | A playlist is added to the queue. |
| `Events.PLAY_SONG` | `queue, song` | A song starts playing. |
| `Events.FINISH_SONG` | `queue, song` | A song ends. |
| `Events.EMPTY` | `queue` | The queue runs out of songs. |
| `Events.FINISH` | `queue` | The playback session ends. |
| `Events.DISCONNECT` | `queue` | The bot leaves a voice channel. |
| `Events.DELETE_QUEUE` | `queue` | The queue is removed. |
| `Events.NO_RELATED` | `queue, error` | The autoplay cannot find a related song. |
| `Events.ERROR` | `error, queue, song` | Something went wrong. |
| `Events.DEBUG` | `message` | A debug message of the library. |
| `Events.FFMPEG_DEBUG` | `message` | A debug message of FFmpeg. |

### The order of the events

```text
INIT_QUEUE
  └─ ADD_SONG / ADD_LIST
       └─ PLAY_SONG
            └─ FINISH_SONG
                 ├─ PLAY_SONG        (next song)
                 └─ EMPTY → FINISH   (nothing left)
```

## Errors never crash the bot

The `error` event is the special `"error"` event of Node.js. Emitting it without a listener would
throw an `ERR_UNHANDLED_ERROR` and take the whole process down. DisTube does not let that happen:

```js
// Nothing listens: the error is logged as a warning, the bot keeps running.
const distube = new DisTube(client);
```

```js
// A listener: the error is yours to handle.
distube.on(Events.ERROR, (error, queue, song) => {
  console.error(error);
});
```

You can also choose what happens with the `unhandledError` option:

```js
const distube = new DisTube(client, {
  unhandledError: "log", // "log" (default) | "throw" | "ignore"
});
```

| Value | Behavior |
| --- | --- |
| `"log"` | A warning is logged. The bot keeps running. |
| `"throw"` | The error is thrown, like Node.js does. |
| `"ignore"` | The error is discarded. |

## The debug events

Both debug events are opt-in listeners, they cost nothing when nothing listens to them.

```js
distube.on(Events.DEBUG, (message) => {
  console.log(`[DisTube] ${message}`);
});

distube.on(Events.FFMPEG_DEBUG, (message) => {
  console.log(`[FFmpeg] ${message}`);
});
```

The FFmpeg one is the one to reach for when a track does not play: it shows the exact command line
and the log of the process.

## Per-guild state

A queue belongs to a guild. Get it with the id of the guild:

```js
const queue = distube.getQueue(message.guildId);

if (!queue) {
  await message.reply("Nothing is playing.");
  return;
}
```

`GuildIdResolvable` accepts a lot of shapes, so you can pass what you already have:

```js
distube.getQueue(message); // a Message
distube.getQueue(message.guild); // a Guild
distube.getQueue(message.member.voice.channel); // a voice channel
distube.getQueue(queue); // a Queue
```

## The debug log of a queue

```js
queue.on(Events.DEBUG, (message) => {
  console.log(`[${queue.id}] ${message}`);
});
```
