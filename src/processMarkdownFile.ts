import fs from "node:fs";
import path from "path";
import { marked } from "marked";
import { getConfig } from "./config";
import generateHtml from "./generateHtml";
import type { DrippyConfig } from "./types";

function processMarkdownFile(
  fullPath: string,
  content: string,
  variables: any = {},
  config: DrippyConfig = getConfig()
): void {
  if (!variables.template) {
    throw new Error(`Template is missing from ${fullPath}`);
  }

  const template = fs.readFileSync(
    path.join(config.templatesPath, variables.template + ".liquid"),
    "utf8"
  );

  generateHtml(
    fullPath,
    template,
    {
      ...variables,
      content: marked(content),
    },
    config
  );
}

export default processMarkdownFile;
