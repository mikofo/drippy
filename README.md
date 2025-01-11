# Drippy

A lightweight, unopinionated static site generator powered by Liquid templates and Markdown.

Perfect for building blog-aware websites you can leverage the flexibility and composability of Liquid templates. And if you want to write collection content in markdown, Drippy will convert it to HTML and render it using your Liquid templates.

## Installation

```bash
npm install drippy
```

## Getting Started

Create a new Drippy project:

```bash
drippy new
```

## Configuration

Drippy looks for a 'drippy.config.js' or 'drippy.config.json' file in your project root.

Example config:

```js
{
  "input": "./src",
  "output": "./dist",
  "layouts": "./layouts",
  "assets": "./assets"
}
```
