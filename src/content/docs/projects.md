---
title: Plugins & bots
description: The official plugins, the community ones, and the bots built with DisTube.
---

## The official plugins

### Extractor plugins

They extract the info, search, and play the tracks of their source.

| Plugin | Source |
| --- | --- |
| [`@distube/youtube`](https://www.npmjs.com/package/@distube/youtube) | YouTube |
| [`@distube/soundcloud`](https://www.npmjs.com/package/@distube/soundcloud) | SoundCloud |

### Info extractor plugins

They only extract the info: the audio is played by another plugin.

| Plugin | Source |
| --- | --- |
| [`@distube/spotify`](https://www.npmjs.com/package/@distube/spotify) | Spotify |
| [`@distube/deezer`](https://www.npmjs.com/package/@distube/deezer) | Deezer |

### Playable extractor plugins

They extract and play the tracks, but they cannot search their source.

| Plugin | Source |
| --- | --- |
| [`@distube/yt-dlp`](https://www.npmjs.com/package/@distube/yt-dlp) | 700+ sites |
| [`@distube/direct-link`](https://www.npmjs.com/package/@distube/direct-link) | Direct audio links |
| [`@distube/file`](https://www.npmjs.com/package/@distube/file) | Local files |
| [`@distube/bandlab`](https://www.npmjs.com/package/@distube/bandlab) | BandLab |

:::caution
`@distube/yt-dlp` has to be the **last** plugin of the list: it accepts almost every URL, so it
would shadow the others.
:::

## The community plugins

| Plugin | Source | Type |
| --- | --- | --- |
| `distube-apple-music` | Apple Music | Info extractor |
| `distube-tidal` | Tidal | Info extractor |
| `distube-yandex-music-plugin` | Yandex Music | Info extractor |
| `distube-vk-music-plugin` | VK Music | Playable extractor |

## The bots

| Bot | Description |
| --- | --- |
| [DisTube Bot](https://github.com/distubejs/example) | An example bot with a simple command handler. |
| [AICoTest](https://github.com/AlexInCube/AlCoTest) | An advanced audio bot. |

## Adding yours

Open a pull request on [the website repository](https://github.com/carlylekatto/distube-website) and
add your plugin to the tables above.
