import * as fs from "fs";
import * as path from "path";
import { DrippyConfig } from "./types";

export const defaultConfig = {
  buildPath: path.join(process.cwd(), "build"),
  templatesPath: path.join(process.cwd(), "src/templates"),
  sourcePath: path.join(process.cwd(), "src"),
  pagesPath: path.join(process.cwd(), "src/pages"),
};

export function getConfig(): DrippyConfig {
  const configPath = path.join(process.cwd(), "drippy.json");
  const userConfig: Partial<DrippyConfig> = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, "utf-8"))
    : {};

  return {
    ...defaultConfig,
    ...userConfig,
  };
}
