# Drippy

Drippy is a lightweight, unopinionated static site micro-framework that uses Liquid templates and Markdown to create static websites.

## Installation

```bash
npm install drippy-liquid
```

## Quick Start

1. Create a new project:

```bash
npx drippy example
```

This will create an example project structure with all necessary files and folders.

2. Build your site:

```bash
npx drippy build
```

## Project Structure

A typical Drippy project has the following structure:

```
your-project/
├── src/
│   ├── pages/
│   │   ├── index.liquid
│   │   └── posts/
│   │       ├── index.liquid
│   │       └── post1.md
│   ├── templates/
│   │   └── post.liquid
│   └── assets/
└── drippy.config.js
```

## Configuration

Create a `drippy.config.js` or `drippy.config.json` file in your project root:

```javascript
{
  "input": "./src",        // Source directory
  "output": "./dist",      // Build output directory
  "layouts": "./layouts",  // Templates directory
  "assets": "./assets"    // Static assets directory
}
```

## Features

### 1. Liquid Templates

Drippy uses LiquidJS for templating. Create your templates with the `.liquid` extension:

```liquid
---
layout: default
title: My Page
---
<h1>{{ page.title }}</h1>
<div class="content">
  {{ content }}
</div>
```

### 2. Markdown Support

Write content in Markdown with frontmatter:

```markdown
---
template: post
title: My First Post
date: 2024-03-12
---

# Welcome to my blog

This is my first blog post using Drippy.
```

### 3. Collections

Collections are automatically created from directory structures. For example, all files in the `blog/` directory become part of the `blog` collection, accessible in templates:

```liquid
{% for post in blog %}
  <h2><a href="{{ post.pathname }}">{{ post.title }}</a></h2>
  <time>{{ post.date }}</time>
{% endfor %}
```

### 4. Asset Management

Static assets are automatically copied from the `assets` directory to the build output.

## CLI Commands

- `drippy build`: Builds your static site
- `drippy example`: Creates an example project
- `drippy help`: Displays help information
