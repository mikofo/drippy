#!/usr/bin/env node

import { Command } from "commander";
import { build } from "./build";
import { getConfig } from "./config";
import { createExample } from "./createExample";

const program = new Command();

program
  .name("drippy")
  .description(
    "Build unopinionated, simple static sites with Liquid templates and Markdown."
  )
  .version(require("../package.json").version);

program
  .command("build")
  .description("Compile project to static html")
  .action(async () => {
    try {
      const config = getConfig();

      // Add your build logic here
      console.log("Building project with config:", config);
      build(config);
    } catch (error) {
      console.error("Error during build:", error);
      process.exit(1);
    }
  });

program
  .command("example")
  .description("Create an example project")
  .action(async () => {
    console.log("Creating example project");
    try {
      await createExample();
    } catch (error) {
      console.error("Error creating example project:", error);
      process.exit(1);
    }
  });

program
  .command("help")
  .description("Display detailed usage information")
  .action(() => {
    console.log(
      `
Drippy - Static Site Generator

Usage:
  drippy <command> [options]

Commands:
  build         Compile project to static HTML
  help          Display this help message

Configuration:
  Drippy looks for a 'drippy.config.js' or 'drippy.config.json' file in your project root.
  
Example config:
  {
    "input": "./src",
    "output": "./dist",
    "layouts": "./layouts",
    "assets": "./assets"
  }

For more information, visit: https://github.com/your-repo/drippy
    `.trim()
    );
  });

program.parse();
