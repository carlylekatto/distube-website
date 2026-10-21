# distube-website

The documentation website of [DisTube](https://github.com/skick1234/DisTube), the Discord music
library for [discord.js](https://discord.js.org/).

It is built with [Astro](https://astro.build/) and
[Starlight](https://starlight.astro.build/), and it is deployed to GitHub Pages.

## The structure

```
src/
├── content/docs/          # The pages of the site
│   ├── index.mdx          # The landing page
│   ├── getting-started/   # Installation and quick start
│   ├── guide/             # The guide
│   ├── api/               # The API reference (generated)
│   ├── faq.md
│   └── projects.md
├── assets/                # The logo
└── styles/custom.css      # The theme of the site
```

The API reference is **generated** from the sources of the library, with
[starlight-typedoc](https://starlight-typedoc.vercel.app/). The pages under
`src/content/docs/api/` are not committed: they are built at every deployment.

## Local development

The sources of the library have to be next to the website, or the path can be given with the
`DISTUBE_SOURCE` environment variable.

```bash
npm install

# The sources are expected in ../DisTube by default
npm run dev

# Or somewhere else
DISTUBE_SOURCE=../somewhere/else npm run dev
```

The website needs **Node.js 24**.

## Deployment

Every push on `main` builds the website and deploys it to GitHub Pages, at
<https://carlylekatto.github.io/distube-website>.

The workflow checks out the sources of the library, generates the API reference from them, and
builds the site.

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

The content of the website is under the [MIT license](https://github.com/carlylekatto/distube-website/blob/main/LICENSE),
the same as the library.
