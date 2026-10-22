---
title: Plugins & bots
description: How to find a music source plugin, and the bots built with DisTube.
---

## Where the plugins come from

DisTube ships no music source. Every service is a plugin, and the plugins live outside the
library.

:::caution
This fork does not maintain the plugins of the upstream repository. They may not work with it, and
they are not covered by the tests of this fork. Write your own extractor, or use a plugin that you
trust and that you can keep up to date.
:::

## The three kinds of plugin

| Kind | Extract the info | Search | Play |
| --- | --- | --- | --- |
| `ExtractorPlugin` | ✅ | ✅ | ✅ |
| `InfoExtractorPlugin` | ✅ | ✅ | ❌ |
| `PlayableExtractorPlugin` | ✅ | ❌ | ✅ |

A plugin that only knows the metadata declares `playable: false`, and DisTube looks for a
playable version of the song with the other plugins. The [plugin system guide](/guide/plugins/)
explains how to write one.

:::caution
The order of the plugins matters: the first plugin whose `validate()` returns `true` for a URL is
the one used to resolve it. A plugin that accepts almost every URL has to be the last one, or it
shadows the others.
:::

## Finding a plugin

A plugin publishes the identifiers of its source, so you can find it back in the registry of the
plugins:

```js
distube.getPlugin("my-source");
```

Look for a plugin in the place where you publish your own work: the registry of your package
manager, and the topics of the community. The [DisTube Discord server](https://discord.gg/jKkWadnQhT)
is the other place to ask.

## The bots

| Bot | Description |
| --- | --- |
| [DisTube Bot](https://github.com/distubejs/example) | An example bot with a simple command handler. |

## Adding yours

Open a pull request on [the website repository](https://github.com/carlylekatto/distube-website) and
add your bot to the table above.
