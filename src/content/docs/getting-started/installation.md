---
title: Installation
description: The requirements and the steps to install DisTube in your Discord bot.
---

DisTube depends on a few system tools and a few packages. This page lists everything, and the
order to install them in.

## Requirements

| Requirement | Version |
| --- | --- |
| [Node.js](https://nodejs.org/) | `22.12.0` or higher |
| [discord.js](https://discord.js.org/) | `v14` |
| [@discordjs/voice](https://npmjs.com/package/@discordjs/voice) | `^0.19.0` |
| [@discordjs/opus](https://npmjs.com/package/@discordjs/opus) | `^0.10.0` |
| [FFmpeg](https://ffmpeg.org/) | any recent version |

## 1. Install the packages

```bash
# Bun (recommended)
bun add distube @discordjs/voice @discordjs/opus

# npm
npm install distube @discordjs/voice @discordjs/opus

# pnpm
pnpm add distube @discordjs/voice @discordjs/opus

# Yarn
yarn add distube @discordjs/voice @discordjs/opus
```

:::tip
[Bun](https://bun.sh/) is faster to install and to run. The library itself works the same with any
package manager.
:::

## 2. Install FFmpeg

DisTube uses FFmpeg to process the audio. It has to be installed on your system and available in
your `PATH`.

```bash
# Linux (Debian / Ubuntu)
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
winget install Gyan.FFmpeg
```

If the links above are not available, you can download a static build from
[FFmpeg-Builds](https://github.com/BtbN/FFmpeg-Builds/releases).

:::caution
Do **not** install the `ffmpeg` or `ffmpeg-static` npm packages: they cause stability and
performance issues.
:::

## 3. Install an encryption library

Discord.js needs an encryption library to talk to the voice servers. DisTube works with any library
supported by `@discordjs/voice`.

Check whether your runtime supports `aes-256-gcm` natively:

```js
require("node:crypto").getCiphers().includes("aes-256-gcm");
```

If it returns `false`, install one of these:

```bash
bun add @noble/ciphers
# or
bun add sodium-native
```

## 4. Create the client

DisTube needs the `GuildVoiceStates` intent. The `Guilds` intent is required by discord.js itself.

```js
import { Client, GatewayIntentBits } from "discord.js";
import { DisTube } from "distube";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const distube = new DisTube(client);
```

:::tip
The `GuildVoiceStates` intent is what lets the bot know who is in a voice channel. Without it,
DisTube throws a `MISSING_INTENTS` error.
:::

## Next

- [Quick start](/getting-started/quick-start/) — build the commands
- [Plugin system](/guide/plugins/) — add the music sources
