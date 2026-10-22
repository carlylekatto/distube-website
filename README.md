# distube-website

The documentation website of [DisTube](https://github.com/carlylekatto/DisTube), the Discord music
library for [discord.js](https://discord.js.org/).

It is built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/), and
it is deployed to GitHub Pages.

## The design

The design system is written down in [`design.md`](./design.md): a white canvas, an emerald accent,
the deep code blocks of a developer documentation and a type scale that stays quiet. The type is
Inter for the prose and the system monospace for the code, so the page asks for nothing.

The landing page shows a mockup of the player, in `src/components/Hero.astro`, and the bars of its
equalizer come from `src/components/Waveform.astro`.

## The structure

```
src/
├── components/           # The components of the site
│   ├── Hero.astro        # The landing page
│   └── Waveform.astro    # The waveform
├── content/docs/          # The pages of the site
│   ├── index.mdx         # The landing page
│   ├── getting-started/  # Installation and quick start
│   ├── guide/            # The guide
│   ├── api/              # The API reference (generated)
│   ├── faq.md
│   └── projects.md
├── assets/               # The logo
└── styles/custom.css     # The design system
```

The API reference is **generated** from the sources of the library, with
[starlight-typedoc](https://starlight-typedoc.vercel.app/). The pages under
`src/content/docs/api/` are not committed: they are built at every deployment.

## Local development

The sources of the library have to be next to the website, or the path can be given with the
`DISTUBE_SOURCE` environment variable.

```bash
npm install

# The sources are expected in ./source by default
DISTUBE_SOURCE=../DisTube npm run dev
```

The website needs **Node.js 24**.

To review a change of the design, take a screenshot of the built site:

```bash
npm run build
node scripts/shot.cjs "/" shot.png 1440 1050
```

## The assistant files

The site ships the two files an assistant reads to understand the library:
[llms.txt](https://llmstxt.org/) is the index of the pages, and `llms-full.txt`
holds the whole documentation in one file. They are generated from the pages of
the site, so they never go out of date.

```bash
npm run llms
```

## Deployment

Every push on `main` builds the website and deploys it to GitHub Pages, at
<https://carlylekatto.github.io/distube-website>.

The workflow checks out the sources of the library, generates the API reference from them, and builds
the site.

## Adding a page

Add a Markdown file under `src/content/docs/`, with the frontmatter of the site:

```md
---
title: The title of the page
description: The description of the page.
---
```

Then add it to the sidebar of `astro.config.mjs`.

## The license

The content of the website is under the
[MIT license](https://github.com/carlylekatto/distube-website/blob/main/LICENSE), the same as the
library.
