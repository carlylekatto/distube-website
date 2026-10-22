---
title: FAQ
description: The questions that come up the most when a DisTube bot does not work.
---

## The library

### `FFMPEG_NOT_INSTALLED`

FFmpeg is not installed, or it is not in your `PATH`.

```bash
# Linux
sudo apt-get install ffmpeg
# macOS
brew install ffmpeg
# Windows
winget install Gyan.FFmpeg
```

If it is installed but somewhere else, point the library at it:

```js
const distube = new DisTube(client, {
  ffmpeg: { path: "/usr/local/bin/ffmpeg" },
});
```

### The track ends instantly, or `write EPIPE`

This is an FFmpeg error. The `ffmpegDebug` event shows the exact command line and the log of the
process.

```js
distube.on(Events.FFMPEG_DEBUG, console.log);
```

### `Cannot find module '@discordjs/opus'`

The Opus encoder is missing.

```bash
bun add @discordjs/opus
```

### `RangeError: Source is too large`

`node-opus` and `opusscript` are unstable. Remove them, and install `@discordjs/opus` instead.

```bash
bun remove opusscript node-opus
bun add @discordjs/opus
```

### `VOICE_CONNECTION_TIMEOUT`

The bot cannot reach the voice servers. It is usually the network of the host, not the code.

Try to join the channel before the first track:

```js
await distube.voices.join(voiceChannel);
```

### The bot plays a random track when the queue is empty

The autoplay is on. Turn it off for a guild:

```js
distube.on(Events.INIT_QUEUE, (queue) => {
  queue.autoplay = false;
});
```

### The bot is stuck in a silence

A track that does not produce any audio is detected and skipped after ten seconds. Raise the limit
with the `stuckThreshold` option:

```js
const distube = new DisTube(client, {
  stuckThreshold: 20_000,
});
```

Set it to `0` to turn the detection off.

## The plugins

### The source asks for a signed-in session

Some services answer a request that comes from a bot with a challenge, a rate limit, or a refusal.
A plugin that talks to such a service usually takes a session cookie or a token. The plugin
documents what it expects, and the symptom is a request that fails with a challenge or with a rate
limit. See [source sessions](/guide/source-sessions/).

### The session expired

A session expires, and the plugin cannot authenticate any more. Export a new one and give it to the
plugin.

### The plugin does not find the track

Check the order of the plugins: the first one whose `validate()` returns `true` for a URL is the one
used to resolve it. Give a URL to the plugin you want, or use the `source` option:

```js
await distube.search("faded", { source: "my-source" });
```

## The commands

### How do I use slash commands?

DisTube works with any command handler. A chat input command is in
[Discord.js events](/guide/discord-events/#slash-commands).

### Why are the shortcut methods gone?

They were deprecated in v5.2 and removed in v6. They hid the queue, which made the code harder to
read and to type. Use `distube.getQueue(guildId).method()` instead. See
[upgrading](/guide/upgrade/#the-shortcut-methods-are-gone).

## The library itself

### How do I report a bug?

Open an issue on [GitHub](https://github.com/carlylekatto/DisTube/issues), with:

- the version of DisTube, of discord.js and of Node.js
- the plugin you use, and its version
- the `ffmpegDebug` output of a failing track
- the code that reproduces the problem

### Where do I ask a question?

On the [Discord server](https://discord.gg/jKkWadnQhT).
