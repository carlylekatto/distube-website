---
title: Source sessions
description: Why a music source asks for a signed-in session, and how to give one to a plugin.
---

Some services answer a request that comes from a bot with a challenge, a rate limit, or a refusal. A
plugin that talks to such a service usually takes a session: a cookie, a token, or a pair of them.
The plugin documents what it expects, and the option that carries it.

:::caution
DisTube ships no music source, and this fork does not maintain the plugins of the upstream
repository. They may not work with it. Write your own extractor, or use a plugin that you trust
and that you can keep up to date.
:::

## What a session changes

| Without a session | With one |
| --- | --- |
| The service asks the bot to prove it is not one | The requests look like a signed-in session |
| The rate limits are frequent | The limits are much higher |
| Some content is refused | It plays, with the rights of the account |
| Some live streams are refused | They play |

## Getting a session

The value is the raw header of a signed-in session, exported from a browser.

1. Install a cookie exporter for your browser.
2. Open the site of the service, and **sign in**.
3. Click the extension icon, then **Export**.
4. Copy the value.

:::tip
Use a throwaway account. The plugin only reads the session, but a personal account exposes
everything that account can see.
:::

## Giving it to the plugin

Every plugin names its own option. A session is a string, so it comes from the environment:

```js
import { DisTube } from "@kattowo/distube";
import { MyPlugin } from "./my-plugin.js";

const distube = new DisTube(client, {
  plugins: [new MyPlugin({ session: process.env.SOURCE_SESSION })],
});
```

The name of the option and the format of the value belong to the plugin. The value is the raw
header, without a name:

```text
SID=...; HSID=...; SAPISID=...; __Secure-3PAPISID=...
```

A session can also be read from a file, which keeps it out of the environment:

```js
import { readFileSync } from "node:fs";

const session = readFileSync("./session.txt", "utf8").trim();

const distube = new DisTube(client, {
  plugins: [new MyPlugin({ session })],
});
```

## When it stops working

A session expires, and a wrong one is refused. The symptoms are a request that fails with a
challenge, with a rate limit, or with a refusal that a signed-in session does not get. When it
happens, export a new one. There is no way to refresh a session by itself.

## Keeping it out of the repository

A session is a credential. Keep it in the environment of the bot, and add the file that holds it to
the ignore list of the repository:

```text
session.txt
```
