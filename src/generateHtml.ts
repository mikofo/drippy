import fs from "node:fs";
import { Liquid } from "liquidjs";
import path from "path";
import { mkdir } from "./utils/fsHelpers";
import { getConfig } from "./config";
import prettier from "prettier";
import type { DrippyConfig } from "./types";

async function generateHtml(
  fullPath: string,
  content: string,
  variables: any = {},
  config: DrippyConfig = getConfig()
) {
  const engine = new Liquid();

  const outputFile = path.join(
    config.buildPath,
    path
      .relative(config.pagesPath, fullPath)
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

export default generateHtml;
