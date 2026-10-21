import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc";

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
      logo: {
        src: "./src/assets/logo.svg",
        replacesTitle: false,
      },
      favicon: "/favicon.svg",
      customCss: ["./src/styles/custom.css"],
      components: {
        Hero: "./src/components/Hero.astro",
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
          attrs: { name: "theme-color", content: "#ed4245" },
        },
        {
          tag: "link",
          attrs: { rel: "stylesheet", href: "/distube-website/fonts/fonts.css" },
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
  ],
});
