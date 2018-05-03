#!/usr/bin/env node

const program = require('commander');
const pkg = require('./package.json');
const { resolve } = require('path');

program
  .version(pkg.version)
  .command('fix-pdsc-imports', 'fixes all pdsc mock imports and sorts imports')
  .command(
    'mv',
    'Move file along with reference to all of its imports. We will also sort the imports.'
  )
  .parse(process.argv);
