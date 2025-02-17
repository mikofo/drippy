import fs from "fs";
import { Liquid } from "liquidjs";
import path from "path";
import { mkdir } from "./utils/fsHelpers";
import { getConfig } from "./config";
import prettier from "prettier";

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

export default generateHtml;
