import { describe, it, expect, vi, beforeEach } from "vitest";
import extractFrontmatter from "../src/extractFrontmatter";
import { fs, vol } from "memfs";

describe("extractFrontmatter", () => {
  vi.mock("node:fs");
  vi.mock("node:fs/promises");

  beforeEach(() => {
    vol.reset();
  });

  it("should extract frontmatter and content from a valid markdown file", () => {
    const path = "/test.md";
    const content = `---
title: Test Post
date: 2024-03-12
author: John Doe
---
# Main Content
This is the main content of the post.`;
    fs.writeFileSync(path, content);

    const result = extractFrontmatter(path);

    expect(result).toEqual({
      frontmatter: {
        title: "Test Post",
        date: "2024-03-12",
        author: "John Doe",
      },
      content: "# Main Content\nThis is the main content of the post.",
      fullPath: "/test.md",
    });
  });

  it("should handle files without frontmatter", () => {
    const path = "/test.md";
    const content = "# Just Content\nNo frontmatter here.";
    fs.writeFileSync(path, content);

    const result = extractFrontmatter(path);

    expect(result).toEqual({
      frontmatter: {},
      content: content,
      fullPath: "/test.md",
    });
  });

  it("should handle files with invalid frontmatter format", () => {
    const path = "/test.md";
    const content = `---
invalid frontmatter
without proper format
---
Content here`;
    fs.writeFileSync(path, content);

    const result = extractFrontmatter(path);

    expect(result).toEqual({
      frontmatter: {},
      content: "Content here",
      fullPath: "/test.md",
    });
  });

  it("should handle files with only opening frontmatter delimiter", () => {
    const path = "/test.md";
    const content = `---
title: Test
Content without closing delimiter`;
    fs.writeFileSync(path, content);

    const result = extractFrontmatter(path);

    expect(result).toEqual({
      frontmatter: {},
      content: content,
      fullPath: "/test.md",
    });
  });

  it("should handle frontmatter with colons in the value", () => {
    const path = "/test.md";
    const content = `---
title: Post with: colon
time: 12:30:00
---
Content`;
    fs.writeFileSync(path, content);

    const result = extractFrontmatter(path);

    expect(result).toEqual({
      frontmatter: {
        title: "Post with: colon",
        time: "12:30:00",
      },
      content: "Content",
      fullPath: "/test.md",
    });
  });

  it("should throw error if file does not exist", () => {
    const path = "/nonexistent.md";
    // No need to mock existsSync, memfs will handle this case
    expect(() => extractFrontmatter(path)).toThrow();
  });
});
