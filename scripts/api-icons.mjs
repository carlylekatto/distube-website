/**
 * Mark the kind of the members of the API reference.
 *
 * TypeDoc writes the members of a class under a heading that tells the kind
 * of the member: Properties, Accessors, Methods... The heading of the member
 * itself does not, so a reader who lands on a member, or who reads the table
 * of contents, has no way to tell a method from a property.
 *
 * This adds a marker before the heading of every member. The marker carries
 * the kind in its class, and the stylesheet of the site draws it.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The sections of TypeDoc that hold members, and the kind of the member they
 * hold.
 */
const KINDS = {
  Constructors: "constructor",
  Properties: "property",
  Accessors: "accessor",
  Methods: "method",
  Events: "event",
  Functions: "function",
  Variables: "variable",
  "Enumeration Members": "enum-member",
  "Type Aliases": "type",
  Interfaces: "interface",
  Classes: "class",
  Enumerations: "enum",
};

/**
 * The label of a kind, for the readers of a screen.
 */
const LABELS = {
  constructor: "Constructor",
  property: "Property",
  accessor: "Accessor",
  method: "Method",
  event: "Event",
  function: "Function",
  variable: "Variable",
  "enum-member": "Enumeration member",
  type: "Type alias",
  interface: "Interface",
  class: "Class",
  enum: "Enumeration",
};

/**
 * Walk the markdown files of the API reference.
 */
async function walk(dir) {
  const files = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
      continue;
    }
    if (entry.name.endsWith(".md")) files.push(full);
  }
  return files;
}

/**
 * Add the markers to one file.
 */
function mark(content) {
  const lines = content.split("\n");
  let kind = null;
  let count = 0;

  const marked = lines.map((line) => {
    // A section of level 2 holds the members, or something else: the
    // Parameters of a function, for instance.
    if (line.startsWith("## ") && !line.startsWith("### ")) {
      kind = KINDS[line.slice(3).trim()] ?? null;
      return line;
    }
    // The member itself is a heading of level 3.
    if (!kind || !line.startsWith("### ")) return line;
    const name = line.slice(4).trim();
    if (name.startsWith("<span")) return line;
    count += 1;
    // There is no space between the marker and the name: the space would
    // become a dash in the anchor of the heading, and every link to a member
    // of the reference would break.
    return `### <span class="api-kind api-kind--${kind}" role="img" aria-label="${LABELS[kind]}"></span>${name}`;
  });

  return { content: marked.join("\n"), count };
}

/**
 * Add the markers to the whole API reference.
 */
export async function markApiKinds(root, logger) {
  const apiDir = path.join(root, "src", "content", "docs", "api");
  const files = await walk(apiDir);
  if (!files.length) {
    logger.warn("The API reference is empty, no kind was marked.");
    return;
  }

  let total = 0;
  for (const file of files) {
    const before = await readFile(file, "utf8");
    const { content, count } = mark(before);
    if (count) {
      await writeFile(file, content, "utf8");
      total += count;
    }
  }

  logger.info(`Marked ${total} members of the API reference.`);
}

export const apiIconsDir = path.dirname(fileURLToPath(import.meta.url));
