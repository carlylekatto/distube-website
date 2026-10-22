/**
 * Mark the kind of the members of the API reference.
 *
 * TypeDoc writes the members of a class under a heading that tells the kind
 * of the member: Properties, Accessors, Methods... The heading of the member
 * itself does not, so a reader who lands on a member has no way to tell a
 * method from a property.
 *
 * This adds a badge before the heading of every member, and before the
 * entries of the lists of the classes, the interfaces and the enumerations.
 * The badge carries the kind in its class, and the stylesheet of the site
 * draws it.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * The sections of TypeDoc that hold members, the kind of the member they
 * hold, and the label a reader of a screen gets.
 */
const KINDS = {
  Constructors: { kind: "constructor", label: "Constructor" },
  Properties: { kind: "property", label: "Property" },
  Accessors: { kind: "accessor", label: "Accessor" },
  Methods: { kind: "method", label: "Method" },
  Events: { kind: "event", label: "Event" },
  Functions: { kind: "function", label: "Function" },
  Variables: { kind: "variable", label: "Variable" },
  "Enumeration Members": { kind: "enum-member", label: "Enumeration member" },
  "Type Aliases": { kind: "type", label: "Type alias" },
  Interfaces: { kind: "interface", label: "Interface" },
  Classes: { kind: "class", label: "Class" },
  Enumerations: { kind: "enum", label: "Enumeration" },
};

/**
 * The sections that hold a list of entries instead of members.
 */
const LISTS = new Set(["Classes", "Interfaces", "Enumerations", "Functions", "Variables", "Type Aliases"]);

/**
 * The badge of a kind.
 */
const badge = (kind, label) => `<span class="api-kind api-kind--${kind}" role="img" aria-label="${label}"></span>`;

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
 * Add the badges to one file.
 */
function mark(content) {
  const lines = content.split("\n");
  let section = null;
  let count = 0;

  const marked = lines.map((line) => {
    // A section of level 2 holds the members, or a list of entries, or
    // something else: the Parameters of a function, for instance.
    if (line.startsWith("## ") && !line.startsWith("### ")) {
      section = line.slice(3).trim();
      return line;
    }

    const kind = KINDS[section];
    if (!kind) return line;

    // The member itself is a heading of level 3.
    if (line.startsWith("### ")) {
      const name = line.slice(4).trim();
      if (name.startsWith("<span")) return line;
      count += 1;
      // There is no space between the badge and the name: a space would become
      // a dash in the anchor of the heading, and every link to a member would
      // break.
      return `### ${badge(kind.kind, kind.label)}${name}`;
    }

    // The entries of a list of classes, of interfaces or of enumerations.
    if (LISTS.has(section) && /^- \[/.test(line)) {
      if (line.includes("api-kind")) return line;
      count += 1;
      return line.replace(/^- /, `- ${badge(kind.kind, kind.label)}`);
    }

    return line;
  });

  return { content: marked.join("\n"), count };
}

/**
 * Add the badges to the whole API reference.
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
