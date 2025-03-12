import fs from "fs";
import path from "path";
import { mkdir } from "./utils/fsHelpers";

export function createExample(dir?: string) {
  const tempDir = path.join(dir || "drippy-example");
  const srcDir = path.join(tempDir, "src");
  const buildDir = path.join(tempDir, "build");
  const pagesDir = path.join(srcDir, "pages");
  const templatesDir = path.join(srcDir, "templates");
  const assetsDir = path.join(srcDir, "assets");

  mkdir(srcDir);
  mkdir(buildDir);
  mkdir(pagesDir);
  mkdir(templatesDir);
  mkdir(assetsDir);

  // Create config
  const config = {
    buildPath: buildDir,
    sourcePath: srcDir,
    pagesPath: pagesDir,
    templatesPath: templatesDir,
  };

  // Create templates
  const headTemplate = `<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />`;

  fs.writeFileSync(path.join(templatesDir, "head.liquid"), headTemplate);

  const postTemplate = `<div class="post">
  <h1>{{ title }}</h1>
  <div class="post-content">
    {{ content }}
  </div>
</div>
`;

  fs.writeFileSync(path.join(templatesDir, "post.liquid"), postTemplate);

  const indexPage = `<!DOCTYPE html>
  <html lang="en">
    <head>
     {% include 'src/templates/head.liquid' %}
      <title>My website</title>
    </head>

    <body>
      <h1>Hello World</h1>
      {% for post in posts %}
        {% include 'src/templates/post.liquid' with post %}
      {% endfor %}
    </body>
  </html>
`;

  fs.writeFileSync(path.join(pagesDir, "index.liquid"), indexPage);

  // Create posts
  mkdir(path.join(pagesDir, "posts"));

  fs.writeFileSync(
    path.join(pagesDir, "posts", "post-1.md"),
    `---
title: My first post
template: post
---

This is the content of my first post.
`
  );

  fs.writeFileSync(
    path.join(pagesDir, "posts", "post-2.md"),
    `---
title: My second post
template: post
---

This is the content of my second post.
`
  );
}
