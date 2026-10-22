---
title: Upgrading
description: What changed between the major versions of DisTube, and how to migrate.
---

## To v6

### The shortcut methods are gone

They were deprecated in v5.2. Use the queue of the guild instead.

```js
// ❌ Removed in v6
distube.pause(guildId);
distube.resume(guildId);
distube.stop(guildId);
distube.setVolume(guildId, 50);
distube.skip(guildId);
distube.previous(guildId);
distube.shuffle(guildId);
distube.jump(guildId, 2);
distube.setRepeatMode(guildId, 1);
distube.toggleAutoplay(guildId);
distube.addRelatedSong(guildId);
distube.seek(guildId, 30);

// ✅ The queue
const queue = distube.getQueue(guildId);
await queue.pause();
await queue.resume();
await queue.stop();
queue.setVolume(50);
await queue.skip();
await queue.previous();
await queue.shuffle();
await queue.jump(2);
queue.setRepeatMode(1);
queue.toggleAutoplay();
await queue.addRelatedSong();
await queue.seek(30);
```

### The getters of the queue are gone

```js
// ❌ Removed in v6
queue.isPlaying();
queue.isPaused();
queue.playing;

// ✅ The properties
queue.paused;
queue.isActive; // false once the queue is stopped
```

:::note
`queue.paused` stays `true` once the queue is stopped, so that `!queue.paused` keeps meaning "the
audio is playing".
:::

### The plugin types are merged

`InfoExtractorPlugin` and `PlayableExtractorPlugin` now extend `ExtractorPlugin` and only change
their `type`. A plugin that cannot play its own songs declares it:

```js
// ❌ Before
class MyPlugin extends InfoExtractorPlugin {
  async createSearchQuery(song) {
    return `${song.name} ${song.uploader.name}`;
  }
}

// ✅ Now
class MyPlugin extends ExtractorPlugin {
  readonly playable = false;

  async createSearchQuery(song) {
    return `${song.name} ${song.uploader.name}`;
  }
}
```

### The proxy of a song tries every plugin

DisTube used to look for a playable version of a song in a single plugin. It now tries every
searchable plugin, in the order they were registered, until one of them has a result. The metadata
of the original song is kept.

### The plugins can find each other

```js
// ❌ Before
const ytPlugin = distube.plugins.find((p) => p.constructor.name === "YoutubePlugin");

// ✅ Now
const ytPlugin = distube.getPlugin("youtube");
```

### The plugins have a lifecycle

```js
class MyPlugin extends ExtractorPlugin {
  async init(distube) {
    super.init(distube);
    // The network calls, the sessions, the timers...
  }

  async destroy() {
    // Release everything.
  }
}
```

`destroy()` is called when the DisTube instance is destroyed, and when a plugin is replaced at
runtime.

### The search returns a result

```js
// ❌ Before: the search of the client had to be patched by hand
const results = await distube.search(query, { limit: 25 });

// ✅ Now
const result = await distube.search(query, { limit: 25 });
result.songs; // the songs
result.sources; // the plugins that contributed
```

The result of a plugin is a `SearchResult` too, so a result can be played without resolving it a
second time.

### The errors have their own codes

```js
import { PluginError, PluginErrorCode } from "@kattowo/distube";

throw new PluginError(PluginErrorCode.NOT_FOUND, "This track does not exist.");
```

### The client can wait for the plugins

```js
// ✅ Now
const distube = await DisTube.create(client, { plugins: [new MyPlugin()] });
```

## To v5

DisTube does not include any music source any more: they are plugins.

```js
// ❌ Before
const distube = new DisTube(client, { youtubeDL: true });

// ✅ Now
const distube = new DisTube(client, { plugins: [new YtDlpPlugin()] });
```

The `play()` method takes a voice channel and an options object, and it **throws** instead of
emitting an error.

```js
// ❌ Before
distube.play(message, "query");

// ✅ Now
await distube.play(message.member.voice.channel, "query", {
  message,
  member: message.member,
});
```

The `error` event changed its arguments.

```js
// ❌ Before
distube.on("error", (channel, error) => {});

// ✅ Now
distube.on(Events.ERROR, (error, queue, song) => {});
```

The filters moved to the queue.

```js
// ❌ Before
distube.filters.set(["nightcore"]);

// ✅ Now
queue.filters.set(["nightcore"]);
```
