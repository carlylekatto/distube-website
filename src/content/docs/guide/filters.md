---
title: Audio filters
description: The built-in FFmpeg audio filters of DisTube, and how to add your own.
---

DisTube ships with fifteen audio filters. They are managed per queue, through the `FilterManager` of
the queue.

```js
const queue = distube.getQueue(guildId);

queue.filters.add("nightcore");
queue.filters.remove("nightcore");
```

:::note
The FFmpeg filters are applied when the stream is created. Changing them restarts the stream at the
same playback position, so there is a short interruption.
:::

## The built-in filters

| Name | Description |
| --- | --- |
| `3d` | Spacial effect, for headphones. |
| `bassboost` | Boosts the bass. |
| `echo` | Adds an echo. |
| `flanger` | Flanger effect. |
| `gate` | Removes the silence between the tracks. |
| `haas` | Stereo widening. |
| `karaoke` | Removes the vocals. |
| `nightcore` | Faster and deeper. |
| `reverse` | Plays the track backwards. |
| `vaporwave` | Slowed down and deeper. |
| `mcompand` | Multi band compressor. |
| `phaser` | Phaser effect. |
| `tremolo` | Varying the volume. |
| `surround` | Surround effect. |
| `earwax` | Enhances the vocals, like earphones. |

## Using the filters

```js
const queue = distube.getQueue(guildId);

// Enable one filter
queue.filters.add("bassboost");

// Enable several at once
queue.filters.add(["nightcore", "vaporwave"]);

// Disable one, or several
queue.filters.remove("bassboost");
queue.filters.remove(["nightcore", "vaporwave"]);

// Replace every enabled filter
queue.filters.set(["karaoke"]);

// Remove every filter
queue.filters.clear();

// Check whether a filter is enabled
queue.filters.has("bassboost"); // true

// The enabled filters
queue.filters.names; // ["bassboost", "karaoke"]
queue.filters.values; // [{ name: "bassboost", value: "bass=g=10" }, ...]
```

## A custom filter

A filter is a name and the FFmpeg argument it applies.

```js
queue.filters.add({
  name: "my-filter",
  value: "equalizer=f=1000:width_type=w:width=50:g=-6",
});
```

## Overriding the built-in filters

The `customFilters` option replaces the built-in filters, and adds the new ones.

```js
const distube = new DisTube(client, {
  customFilters: {
    // Replace a built-in filter
    nightcore: "asetrate=48000*1.5,aresample=48000,bass=g=8",
    // Add a new one
    "my-filter": "equalizer=f=1000:width_type=w:width=50:g=-6",
  },
});
```

## The argument that is applied

`queue.filters.ffmpegArgs` returns the FFmpeg argument that is really sent to the process. It is the
first thing to look at when a filter does not behave the way you expect.

```js
console.log(queue.filters.ffmpegArgs); // { af: "bass=g=10,equalizer=..." }
```
