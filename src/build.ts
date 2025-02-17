import fs from "fs";
import path from "path";
import type { DrippyConfig, Frontmatter } from "./types";
import extractFrontmatter from "./extractFrontmatter";
import generateHtml from "./generateHtml";
import processMarkdownFile from "./processMarkdownFile";
import { getPathname, rmdir } from "./utils/fsHelpers";
import { snakeCased } from "./utils/snakeCased";

export function build(config: DrippyConfig) {
  const collections: { [key: string]: Frontmatter[] } = {};
  const entries = fs.readdirSync(config.pagesPath, { withFileTypes: true });
  rmdir(config.buildPath);

  // Copy assets to public folder
  fs.cpSync(
    path.join(config.sourcePath, "assets"),
    path.join(config.buildPath, "assets"),
    { recursive: true }
  );

  // First pass: gather all collections
  for (const entry of entries) {
    const fullPath = path.join(config.pagesPath, entry.name);
    const relativePath = path.relative(config.pagesPath, fullPath);
    if (entry.isDirectory()) {
      collections[relativePath] = parseCollectionContent(fullPath);
    }
  }

  // Second pass: process index files
  processIndexFile(config.pagesPath, collections); // Process root index file
  for (const entry of entries) {
    const fullPath = path.join(config.pagesPath, entry.name);
    if (entry.isDirectory()) {
      processIndexFile(fullPath, collections);
    }
  }
}

function processIndexFile(
  dirPath: string,
  collections: { [key: string]: Frontmatter[] }
) {
  const indexPath = path.join(dirPath, "index.liquid");
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, "utf8");
    generateHtml(indexPath, content, {
      ...collections,
      pathname: getPathname(dirPath),
    });
  }
}

function parseCollectionContent(dir: string): Frontmatter[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const frontmatters = entries
    .filter((entry) => entry.isFile() && !entry.name.startsWith("index."))
    .map((entry) => {
      const { content, frontmatter, fullPath } = extractFrontmatter(
        path.join(dir, entry.name)
      );

      const fm = {
        ...frontmatter,
        pathname:
          getPathname(path.join(dir, snakeCased(entry.name)))
            .replace(".liquid", "")
            .replace(".md", "") + ".html",
      };

      if (entry.name.endsWith(".liquid")) {
        generateHtml(fullPath, content, fm);
      }

      if (entry.name.endsWith(".md")) {
        processMarkdownFile(fullPath, content, fm);
      }

      return fm;
    });

  // Write collection data to JSON file for debugging and reference
  const outputDir = path.dirname(dir);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, "frontmatter.json"),
    JSON.stringify(frontmatters, null, 2)
  );
  return frontmatters;
}
