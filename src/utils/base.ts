/**
 * The path of the site.
 *
 * The site lives in a sub path, so the links of the pages that are written
 * by hand have to carry it. The build adds it to the links of the markdown
 * on its own, this is for the links that are written as HTML.
 */
export const base = import.meta.env.BASE_URL;
