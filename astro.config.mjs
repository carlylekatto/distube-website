import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc";
import { fileURLToPath } from "node:url";
import { markApiKinds } from "./scripts/api-icons.mjs";

// The DisTube sources are checked out next to the website, in the "source"
// directory. The path is configurable so the CI and the local development use
// the same config.
const source = process.env.DISTUBE_SOURCE ?? "./source";

const site = "https://carlylekatto.github.io";
const base = "/distube-website";

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "DisTube",
      description:
        "A powerful Discord.js module for simplifying music commands and effortless playback of various sources with integrated audio filters.",
      favicon: "/favicon.png",
      // The logo is a white silhouette, so it has a version for the light
      // theme and one for the dark theme.
      logo: {
        light: "./src/assets/logo-light.png",
        dark: "./src/assets/logo-dark.png",
      },
      customCss: ["./src/styles/custom.css"],
      components: {
        Hero: "./src/components/Hero.astro",
        // The table of contents carries the badge of the kind of a member.
        TableOfContents: "./src/components/TableOfContents.astro",
      },
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/carlylekatto/DisTube" },
        { icon: "discord", label: "Discord", href: "https://discord.gg/feaDd9h" },
        { icon: "npm", label: "npm", href: "https://www.npmjs.com/package/distube" },
        { icon: "youtube", label: "YouTube", href: "https://www.youtube.com/@DisTube" },
      ],
      editLink: {
        baseUrl: "https://github.com/carlylekatto/distube-website/edit/main/",
      },
      lastUpdated: true,
      credits: false,
      head: [
        {
          tag: "meta",
          attrs: { name: "theme-color", content: "#3ecf8e" },
        },
      ],
      plugins: [
        starlightTypeDoc({
          entryPoints: [`${source}/src/index.ts`],
          // The website has its own tsconfig for the documentation: the build
          // does not depend on the configuration of the library.
          tsconfig: "./typedoc-tsconfig.json",
          output: "api",
          pagination: true,
          sidebar: {
            label: "API reference",
            collapsed: true,
          },
          typeDoc: {
            // The theme of the library is not used: the API reference follows
            // the theme of the website.
            plugin: ["typedoc-plugin-markdown"],
            // The overview of the API becomes the index of the section.
            readme: "./api-readme.md",
            entryFileName: "index",
            excludePrivate: true,
            excludeInternal: true,
            gitRevision: "",
            hideBreadcrumbs: true,
            useCodeBlocks: true,
            // The sources are not published: the path of the checkout would
            // leak the layout of the build.
            disableSources: true,
            sourceLinkTemplate: "",
          },
        }),
      ],
      sidebar: [
        {
          label: "Start here",
          items: [
            { label: "Overview", link: "/" },
            { label: "Installation", link: "/getting-started/installation/" },
            { label: "Quick start", link: "/getting-started/quick-start/" },
          ],
        },
        {
          label: "Guide",
          items: [
            { label: "Handling events", link: "/guide/events/" },
            { label: "Plugin system", link: "/guide/plugins/" },
            { label: "Audio filters", link: "/guide/filters/" },
            { label: "Discord.js events", link: "/guide/discord-events/" },
            { label: "YouTube cookies", link: "/guide/youtube-cookies/" },
            { label: "Upgrading", link: "/guide/upgrade/" },
          ],
        },
        {
          label: "Resources",
          items: [
            { label: "FAQ", link: "/faq/" },
            { label: "Plugins & bots", link: "/projects/" },
          ],
        },
        typeDocSidebarGroup,
      ],
    }),
    {
      // The Starlight TypeDoc plugin writes the API reference in the config
      // setup hook. The marker of the kind of a member is added after that,
      // when the configuration of the project is done.
      name: "api-kind-icons",
      hooks: {
        "astro:config:done": async ({ config, logger }) => {
          await markApiKinds(fileURLToPath(config.root), logger);
        },
      },
    },
  ],
});
