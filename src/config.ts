import * as fs from "fs";
import * as path from "path";
import { DrippyConfig } from "./types";

export const defaultConfig = {
  buildPath: path.join(process.cwd(), "build"),
  templatesPath: path.join(process.cwd(), "templates"),
  sourcePath: path.join(process.cwd(), "pages"),
  publicPath: path.join(process.cwd(), "public"),
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
