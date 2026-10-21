# distube-website

The documentation website of [DisTube](https://github.com/carlylekatto/DisTube), the Discord music
library for [discord.js](https://discord.js.org/).

It is built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/), and
it is deployed to GitHub Pages.

## The design

The site is the panel of a studio device: warm graphite, hairline rules, one red signal colour and
one amber lamp. The type is [Familjen Grotesk](https://fonts.google.com/specimen/Familjen+Grotesk)
for the prose and [Azeret Mono](https://fonts.google.com/specimen/Azeret+Mono) for the code and the
technical values. Both are self hosted, so the page never waits for a third party.

The waveform of the landing page is generated from a fixed seed, in
`src/components/Waveform.astro`.

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
