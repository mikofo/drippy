import * as fs from "fs";
import { getConfig } from "../config";
import path from "path";

function mkdir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function rmdir(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true });
  }
}

function getPathname(dirPath: string): string {
  const relativePath = path.relative(getConfig().pagesPath, dirPath);
  return relativePath ? `/${relativePath}` : "/";
}

export { mkdir, rmdir, getPathname };
