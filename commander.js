#!/usr/bin/env node

const runCodemod = require('./index');
const program = require('commander');
const walkSync = require('walk-sync');
const { resolve } = require('path');

const list = val => val.split(',');
const collect = (val, memo) => {
  memo.push(val);
  return memo;
};

program
  .version('0.0.1')
  .command('mv')
  .description(
    'Move file along with reference to all of its imports. We will also sort the imports.'
  )
  .option('-s, --source <required>', 'file to move')
  .option('-d, --directory <required>', 'folder to move the file to')
  .option(
    '-i, --import-prefix <required>',
    `string to append in front of the helper when replacing the import references`
  )
  .option(
    '-r --root <required>',
    'Root of the project such as ~/workspace/foo-project/',
    collect,
    []
  )
  .option(
    '-t --test-files-pattern [value]',
    'Glob patterns for the test files relative to the root',
    collect,
    []
  )
  .action((req, optional) => {
    const { source, directory, importPrefix, root, testFilesPattern } = req;
    const absoluteDirectory = resolve(directory);
    if (!source) {
      console.log('-s --source option is missing.');
      return;
    } else if (!directory) {
      console.log('-d --directory option is missing.');
      return;
    } else if (!importPrefix) {
      console.log(
        '-i --import-prefix option is missing. This string will be used to prefix all the references we change through this codemod.'
      );
      return;
    } else if (!root) {
      console.log('-r --root is missing.');
      return;
    }

    const globs =
      testFilesPattern.length !== 0
        ? testFilesPattern
        : [
            'core/**/+(tests|addon-test-support)/**/*.js',
            'extended/**/+(tests|addon-test-support)/**/*.js',
            'lib/**/+(tests|addon-test-support)/**/*.js',
            'engine-lib/**/+(tests|addon-test-support)/**/*.js',
          ];

    const testFiles = walkSync(`${root}`, {
      globs,
      ignore: ['**/node_modules'],
      directories: false,
    });

    // use walkSync

    runCodemod.moveHelper({
      source,
      directory: resolve(directory),
      importPrefix,
      testFiles,
    });
  });

program.parse(process.argv);
