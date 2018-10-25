#!/usr/bin/env node
const rewrite = require("./index");

const argv = require("yargs")
  .option("path", {
    alias: "p",
    type: "string",
    demandOption: true,
    describe: "Extension-less path for target files"
  })
  .option("namespace", {
    alias: "n",
    type: "string",
    demandOption: true,
    describe: "UMD global namespace"
  })
  .argv;

rewrite(argv.path, argv.namespace);
