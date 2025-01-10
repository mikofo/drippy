#!/usr/bin/env node

import { Command } from "commander";
import { build } from "./build";
import { getConfig } from "./config";

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

program.parse();
