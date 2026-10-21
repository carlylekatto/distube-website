---
title: Plugin system
description: The music sources of DisTube, and how to write your own.
---

DisTube ships **no** music source. Every source is a plugin, so you install and load only the ones
you actually need.

## Using a plugin

```js
import { DisTube } from "distube";
import { YouTubePlugin } from "@distube/youtube";
import { SpotifyPlugin } from "@distube/spotify";

const distube = new DisTube(client, {
  plugins: [new YouTubePlugin(), new SpotifyPlugin()],
});
```

:::caution
The order of the plugins matters: the first plugin whose `validate()` returns `true` for a URL is
the one used to resolve it.
:::

## Finding a plugin

A plugin declares the identifiers of its source. The class name is used by default, and it can be
overridden.

```js
import { YouTubePlugin } from "@distube/youtube";

const plugin = new YouTubePlugin();

plugin.identifiers; // ["youtube", "yt"]
```

```js
class MyPlugin extends ExtractorPlugin {
  readonly source = "my-source";
  readonly aliases = ["ms"];
}
```

```js
distube.getPlugin("yt"); // the YouTube plugin
distube.getPlugin("youtube"); // the same plugin
```

## The three roles

| Base class | Extract the info | Search | Play |
| --- | --- | --- | --- |
| `ExtractorPlugin` | ✅ | ✅ | ✅ |
| `InfoExtractorPlugin` | ✅ | ✅ | ❌ |
| `PlayableExtractorPlugin` | ✅ | ❌ | ✅ |

In v6 the three classes are merged: `InfoExtractorPlugin` and `PlayableExtractorPlugin` extend
`ExtractorPlugin` and only change their `type`.

### A plugin that cannot play its own songs

Some sources only give the metadata: Spotify knows the track, but the audio is somewhere else. Such
a plugin declares `playable: false`, and DisTube looks for a playable version of the song with the
other plugins.

```js
class MyInfoPlugin extends InfoExtractorPlugin {
  readonly playable = false;

  async validate(url) {
    return url.startsWith("https://example.com/track/");
  }

  async resolve(url, options) {
    // Return a Song
  }

  async createSearchQuery(song) {
    return `${song.name} ${song.uploader.name}`;
  }
}
```

Every searchable plugin is tried, in the order they were registered, until one of them has a
result. The metadata of the original song is kept, so the cover and the artist stay the ones of the
source the user asked for.

## Writing a plugin

A plugin extends one of the base classes and implements its methods.

```js
import { ExtractorPlugin } from "distube";

class MyPlugin extends ExtractorPlugin {
  async validate(url) {
    return url.startsWith("https://example.com/");
  }

  async resolve(url, options) {
    // Return a Song or a Playlist
  }

  async searchSong(query, options) {
    // Return a Song, or null
  }

  async getStreamURL(song) {
    return song.url;
  }
}
```

### `search()`, with many results

`searchSong()` returns a single song. Override `search()` to return more of them:

```js
class MyPlugin extends ExtractorPlugin {
  async search(query, options) {
    const limit = options.limit ?? 10;
    const results = await this.client.search(query, { limit });

    return new SearchResult(query, {
      songs: results.map((item) => new MySong(this, item, options)),
      queryType: options.type,
      sources: [this.source],
    });
  }
}
```

The same result type is used at every level, so a result can be played without resolving it a
second time.

### The `SearchOptions`

| Option | Default | Description |
| --- | --- | --- |
| `limit` | `10` | Maximum number of results. |
| `type` | — | The kind of result: `track`, `video`, `playlist`, `album`, `artist`. |
| `safeSearch` | `false` | Filter the explicit content. |
| `source` | — | The source to search in. |
| `member` | — | The user who asked for it. |
| `metadata` | — | Your own data, attached to the results. |

## The lifecycle of a plugin

```js
class MyPlugin extends ExtractorPlugin {
  async init(distube) {
    super.init(distube);
    // The network calls, the sessions, the timers...
  }

  async destroy() {
    // Release everything: the timers, the HTTP servers, the sessions.
  }
}
```

`destroy()` is called when the DisTube instance is destroyed, and when a plugin is replaced at
runtime. A plugin that does not hold anything does not have to implement it.

:::tip
Use `DisTube.create()` when the initialization of your plugins is asynchronous: it waits for them.

```js
const distube = await DisTube.create(client, { plugins: [new MyPlugin()] });
```
:::

## The errors of a plugin

A plugin raises a `PluginError`, with a code from `PluginErrorCode`:

```js
import { PluginError, PluginErrorCode } from "distube";

throw new PluginError(PluginErrorCode.UNSUPPORTED_URL, "This link is not a track.");
```

| Code | When it is raised |
| --- | --- |
| `UNSUPPORTED_URL` | The URL is not supported by the plugin. |
| `NOT_FOUND` | The song, the playlist or the album does not exist. |
| `NO_STREAM` | The plugin cannot get a playable stream. |
| `SOURCE_UNAVAILABLE` | The source is down, or it rate limits the bot. |
| `AGE_RESTRICTED` | The content is age-restricted. |

Use `withMessage()` when you want to keep the original error:

```js
throw PluginError.withMessage(PluginErrorCode.SOURCE_UNAVAILABLE, "The site is down.", {
  cause: originalError,
});
```

## Streaming the audio

A plugin that cannot hand out a static URL to FFmpeg registers a handler on the shared stream
server of DisTube, instead of running its own HTTP server.

```js
class MyPlugin extends ExtractorPlugin {
  init(distube) {
    super.init(distube);

    this.route = distube.streams.register("my-source", async ({ query, signal }) => {
      const bytes = await this.decode(query.get("id"), { signal });
      return { body: bytes, contentType: "audio/flac" };
    });
  }

  async destroy() {
    this.route?.dispose();
  }

  async getStreamURL(song) {
    return this.streams.url("my-source", null, { id: song.id });
  }
}
```

There is **one** server for the whole bot, on a port the operating system picks, and the URLs carry
a random token so the other local processes cannot guess them.
