export interface DrippyConfig {
  buildPath: string;
  templatesPath: string;
  sourcePath: string;
}

export interface Frontmatter {
  [key: string]: string;
}

export interface ParseResult {
  frontmatter: Frontmatter;
  content: string;
  fullPath: string;
}
