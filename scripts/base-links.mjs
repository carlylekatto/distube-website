/**
 * Add the base of the site to the links that start with a slash.
 *
 * The site lives in a sub path, so a link of "/guide/plugins/" points
 * outside of it. The pages are written with the short path, and the
 * pipeline adds the base.
 */
import { defineMdastPlugin } from "satteri";

export function baseLinks(options = {}) {
  const base = options.base ?? "";
  if (!base) return null;

  const prefix = base.endsWith("/") ? base : `${base}/`;

  return defineMdastPlugin({
    name: "base-links",
    link(node) {
      const url = node.url;
      // The links that leave the site are left alone, and so are the ones
      // that already carry the base.
      if (typeof url !== "string") return;
      if (!url.startsWith("/") || url.startsWith("//")) return;
      if (url.startsWith(prefix)) return;
      return { ...node, url: prefix + url.slice(1) };
    },
  });
}
