/**
 * One-shot script: take a screenshot of the built site, to review the design.
 *
 * Usage: node scripts/shot.cjs <path> <output> [width] [height] [--full]
 *   path: the path of the page, e.g. "/" or "/guide/plugins/"
 */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.join(__dirname, "..", "dist");
const base = "/distube-website";

const page$ = process.argv[2] || "/";
const output = process.argv[3] || "shot.png";
const width = Number(process.argv[4] || 1440);
const height = Number(process.argv[5] || 900);
const full = process.argv.includes("--full");

const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".webp": "image/webp",
  ".txt": "text/plain",
};

const server = http.createServer((req, res) => {
  let url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url.startsWith(base)) url = url.slice(base.length) || "/";

  let file = path.join(root, url);
  if (url.endsWith("/")) file = path.join(file, "index.html");

  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const notFound = path.join(root, "404.html");
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : "not found");
    return;
  }

  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  res.end(fs.readFileSync(file));
});

(async () => {
  await new Promise(r => server.listen(4322, "127.0.0.1", r));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:4322${base}${page$}`, { waitUntil: "networkidle", timeout: 60000 });
  if (process.env.THEME) {
    await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), process.env.THEME);
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: output, fullPage: full });
  await browser.close();
  server.close();
  console.log("saved", output);
})();
