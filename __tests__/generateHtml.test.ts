import { describe, it, expect, vi, beforeEach } from "vitest";
import { fs, vol } from "memfs";
import path from "path";
import generateHtml from "../src/generateHtml";
import { DrippyConfig } from "../src/types";

describe("generateHtml", () => {
  const tempDir = "/tmp";
  const buildDir = path.join(tempDir, "build");
  const templatesDir = path.join(tempDir, "templates");
  const pagesDir = path.join(tempDir, "pages");
  const config: DrippyConfig = {
    buildPath: buildDir,
    templatesPath: templatesDir,
    sourcePath: tempDir,
    pagesPath: pagesDir,
  };

  vi.mock("node:fs");
  vi.mock("node:fs/promises");

  beforeEach(() => {
    vol.reset();
    // Create base directory structure in virtual fs
    vol.mkdirSync(tempDir, { recursive: true });
    vol.mkdirSync(buildDir, { recursive: true });
    vol.mkdirSync(templatesDir, { recursive: true });
    vol.mkdirSync(pagesDir, { recursive: true });

    // Mock prettier.format to return the input unchanged for testing
    vi.mock("prettier", () => ({
      default: {
        format: vi.fn((html) => Promise.resolve(html)),
      },
    }));
  });

  it("should generate HTML from a simple liquid template", async () => {
    const templatePath = path.join(pagesDir, "test.liquid");
    const content = "<h1>{{ title }}</h1>";
    const variables = { title: "Test Page" };
    vol.writeFileSync(templatePath, content);

    await generateHtml(templatePath, content, variables, config);

    const outputPath = path.join(buildDir, "test.html");
    expect(vol.existsSync(outputPath)).toBe(true);

    const generatedHtml = vol.readFileSync(outputPath, "utf-8");
    expect(generatedHtml).toContain("<h1>Test Page</h1>");
  });

  it("should handle nested liquid templates with loops and conditionals", async () => {
    const templatePath = path.join(pagesDir, "list.liquid");
    const content = `
      {% if showHeader %}
        <h1>{{ header }}</h1>
      {% endif %}
      <ul>
      {% for item in items %}
        <li>{{ item.name }} - {{ item.value }}</li>
      {% endfor %}
      </ul>
    `;
    const variables = {
      showHeader: true,
      header: "Item List",
      items: [
        { name: "Item 1", value: "Value 1" },
        { name: "Item 2", value: "Value 2" },
      ],
    };
    vol.writeFileSync(templatePath, content);

    await generateHtml(templatePath, content, variables, config);

    const outputPath = path.join(buildDir, "list.html");
    expect(vol.existsSync(outputPath)).toBe(true);

    const generatedHtml = vol.readFileSync(outputPath, "utf-8");
    expect(generatedHtml).toContain("<h1>Item List</h1>");
    expect(generatedHtml).toContain("<li>Item 1 - Value 1</li>");
    expect(generatedHtml).toContain("<li>Item 2 - Value 2</li>");
  });

  it("should handle markdown file conversion to HTML", async () => {
    const mdPath = path.join(pagesDir, "test.md");
    const content = "# {{ title }}\n\n{{ content }}";
    const variables = {
      title: "Markdown Test",
      content: "This is a *markdown* test with **formatting**.",
    };
    vol.writeFileSync(mdPath, content);

    await generateHtml(mdPath, content, variables, config);

    const outputPath = path.join(buildDir, "test.html");
    expect(vol.existsSync(outputPath)).toBe(true);

    const generatedHtml = vol.readFileSync(outputPath, "utf-8");
    expect(generatedHtml).toContain("Markdown Test");
    expect(generatedHtml).toContain(
      "This is a *markdown* test with **formatting**."
    );
  });

  it("should create nested output directories as needed", async () => {
    const nestedPath = path.join(pagesDir, "nested/deep/test.liquid");
    const content = "<p>{{ message }}</p>";
    const variables = { message: "Nested content" };

    // Create nested directories in virtual fs
    vol.mkdirSync(path.dirname(nestedPath), { recursive: true });
    vol.mkdirSync(path.join(buildDir, "nested/deep"), { recursive: true });
    vol.writeFileSync(nestedPath, content);

    await generateHtml(nestedPath, content, variables, config);

    const outputPath = path.join(buildDir, "nested/deep/test.html");
    expect(vol.existsSync(outputPath)).toBe(true);

    const generatedHtml = vol.readFileSync(outputPath, "utf-8");
    expect(generatedHtml).toContain("<p>Nested content</p>");
  });

  it("should handle empty variables object", async () => {
    const templatePath = path.join(pagesDir, "simple.liquid");
    const content = "<div>Static content</div>";
    vol.writeFileSync(templatePath, content);

    await generateHtml(templatePath, content, {}, config);

    const outputPath = path.join(buildDir, "simple.html");
    expect(vol.existsSync(outputPath)).toBe(true);

    const generatedHtml = vol.readFileSync(outputPath, "utf-8");
    expect(generatedHtml).toContain("<div>Static content</div>");
  });

  it("should handle liquid syntax errors gracefully", async () => {
    const templatePath = path.join(pagesDir, "invalid.liquid");
    const content = "{% if unclosed %}";
    vol.writeFileSync(templatePath, content);

    await expect(generateHtml(templatePath, content)).rejects.toThrow();
  });

  it("should handle special characters in variables", async () => {
    const templatePath = path.join(pagesDir, "special.liquid");
    const content = "<div>{{ specialChars }}</div>";
    const variables = {
      specialChars: "Special & chars < > \" '",
    };
    vol.writeFileSync(templatePath, content);

    await generateHtml(templatePath, content, variables, config);

    const outputPath = path.join(buildDir, "special.html");
    expect(vol.existsSync(outputPath)).toBe(true);

    const generatedHtml = vol.readFileSync(outputPath, "utf-8");
    expect(generatedHtml).toContain("Special & chars < > \" '");
  });

  it("should handle undefined variables gracefully", async () => {
    const templatePath = path.join(pagesDir, "undefined.liquid");
    const content = "<div>{{ undefinedVar }}</div>";
    vol.writeFileSync(templatePath, content);

    await generateHtml(templatePath, content, {}, config);

    const outputPath = path.join(buildDir, "undefined.html");
    expect(vol.existsSync(outputPath)).toBe(true);

    const generatedHtml = vol.readFileSync(outputPath, "utf-8");
    expect(generatedHtml).toContain("<div></div>");
  });
});
