---
title: YouTube cookies
description: Why the YouTube plugin needs cookies, and how to provide them.
---

The YouTube plugin works without cookies, but YouTube answers a lot of requests with
*"Sign in to confirm you're not a bot"* and with `429` errors. Cookies solve most of it.

## What the cookies change

| Without cookies | With cookies |
| --- | --- |
| YouTube often asks for a bot check | The requests look like a signed-in session |
| Rate limits are frequent | Much higher limits |
| Age-restricted videos are refused | They play |
| Member-only and private videos are refused | They play, with the account of the cookie |
| Some live streams are refused | They play |

## Getting the cookies

The cookies are the ones of a signed-in YouTube session, exported as a raw `Cookie:` header.

1. Install the [EditThisCookie](https://www.editthiscookie.com/) extension for your browser.
2. Go to [youtube.com](https://www.youtube.com/) and **sign in**.
3. Click the extension icon, then **Export**.
4. Copy the value.

:::tip
Use a throwaway account. The plugin only reads the cookies, but a personal account exposes
everything that account can see.
:::

## Using the cookies

```js
import { YouTubePlugin } from "@distube/youtube";
import { DisTube } from "@kattowo/distube";

const distube = new DisTube(client, {
  plugins: [new YouTubePlugin({ cookie: process.env.YOUTUBE_COOKIE })],
});
```

The value of `YOUTUBE_COOKIE` is the raw header:

```text
SID=...; HSID=...; SAPISID=...; __Secure-3PAPISID=...
```

## From a file

```js
import { readFileSync } from "node:fs";

const cookie = readFileSync("./cookie.txt", "utf8").trim();

const distube = new DisTube(client, {
  plugins: [new YouTubePlugin({ cookie })],
});
```

## When it stops working

A cookie expires, and a wrong one is refused. The symptoms are:

- `429` on every request
- *"Sign in to confirm you're not a bot"*
- *"Sign in to confirm your age"*

When it happens, export a new one. There is no way to refresh a cookie by itself.
