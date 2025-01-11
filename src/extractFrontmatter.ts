import type { Frontmatter, ParseResult } from "./types";
import fs from "fs";

function extractFrontmatter(path: string): ParseResult {
  const fileContent = fs.readFileSync(path, "utf8");

  if (!fileContent.startsWith("---")) {
    return {
      frontmatter: {},
      content: fileContent,
      fullPath: path,
    };
  }

  const endOfFrontmatter = fileContent.indexOf("---", 3);
  if (endOfFrontmatter === -1) {
    return {
      frontmatter: {},
      content: fileContent,
      fullPath: path,
    };
  }

  const frontmatterRaw = fileContent.slice(3, endOfFrontmatter).trim();
  const content = fileContent.slice(endOfFrontmatter + 3).trim();

  const frontmatter: Frontmatter = {};
  frontmatterRaw.split("\n").forEach((line: string) => {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length) {
      frontmatter[key.trim()] = valueParts.join(":").trim();
    }
  });

  return {
    frontmatter,
    content,
    fullPath: path,
  };
}

export default extractFrontmatter;
