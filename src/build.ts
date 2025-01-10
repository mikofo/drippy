import fs from "fs";
import { Liquid } from "liquidjs";
import { DrippyConfig } from "./types";
import path from "path";
import extractFrontmatter, { Frontmatter } from "./extractFrontmatter";
import { marked } from "marked";
import { mkdir } from "./fsHelpers";
import { getConfig } from "./config";
import prettier from "prettier";

export function build(config: DrippyConfig) {
  const collections: { [key: string]: Frontmatter[] } = {};
  const entries = fs.readdirSync(config.sourcePath, { withFileTypes: true });

  // First pass: gather all collections
  for (const entry of entries) {
    const fullPath = path.join(config.sourcePath, entry.name);
    const relativePath = path.relative(config.sourcePath, fullPath);
    if (entry.isDirectory()) {
      collections[relativePath] = parseCollectionContent(fullPath);
    }
  }

  // Second pass: process index files
  processIndexFile(config.sourcePath, collections); // Process root index file
  for (const entry of entries) {
    const fullPath = path.join(config.sourcePath, entry.name);
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
    generateHtml(indexPath, content, collections);
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

      if (entry.name.endsWith(".liquid")) {
        generateHtml(fullPath, content, frontmatter);
      }

      if (entry.name.endsWith(".md")) {
        processMarkdownFile(fullPath, content, frontmatter);
      }

      return frontmatter;
    });

  return frontmatters;
}

function processMarkdownFile(
  fullPath: string,
  content: string,
  variables: any = {}
): void {
  const config = getConfig();

  if (!variables.template) {
    throw new Error(`Template is missing from ${fullPath}`);
  }

  const template = fs.readFileSync(
    path.join(config.templatesPath, variables.template + ".liquid"),
    "utf8"
  );

  generateHtml(fullPath, template, {
    ...variables,
    content: marked(content),
  });
}

async function generateHtml(
  fullPath: string,
  content: string,
  variables: any = {}
) {
  const engine = new Liquid();
  const config = getConfig();

  const outputFile = path.join(
    config.buildPath,
    path
      .relative(config.sourcePath, fullPath)
      .replace(".liquid", ".html")
      .replace(".md", ".html")
  );

  const html = await engine.parseAndRender(content, variables);
  mkdir(path.dirname(outputFile));
  const formattedHtml = await prettier.format(html, {
    parser: "html",
    printWidth: 120,
    htmlWhitespaceSensitivity: "css",
  });
  fs.writeFileSync(outputFile, formattedHtml);
}
