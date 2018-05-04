const { promisify } = require('util');
const fs = require('fs');
const walkSync = require('walk-sync');
const { resolve, parse, join } = require('path');
const jscodeshiftRun = require('./src/utils/jscodeshift-run');
const mv = require('./src/mv');

module.exports = {
  moveHelper: program => {
    const [source, target] = program.args;
    const { importPrefix, root: rootArg, testFilesPattern, dry } = program;
    const root = rootArg || process.cwd();
    if (!rootArg) {
      console.log(
        'This command HAS to be ran on the root directory of the project.'
      );
      console.log(
        `Since '-r --root' option was not provided, we will assume the current working directory ${root}`
      );
    }

    const parsedSource = parse(source);
    const globs = [
      'core/**/+(tests|addon-test-support)/**/*.js',
      'extended/**/+(tests|addon-test-support)/**/*.js',
      'lib/**/+(tests|addon-test-support)/**/*.js',
      'engine-lib/**/+(tests|addon-test-support)/**/*.js',
    ];

    const testFiles =
      testFilesPattern.length === 0
        ? walkSync(root, {
            globs,
            ignore: ['**/node_modules', '**/bower_components'],
            directories: false,
          })
        : testFilesPattern;

    return jscodeshiftRun(
      'transforms/fix-imports/transform.js',
      testFiles,
      {
        source,
        target,
        importPrefix,
        dry,
      },
      () =>
        mv(program, fs, process).then(() =>
          console.log('Finished applying the codemod')
        )
    );
  },

  fixPdscImports: (path, options) => {
    return jscodeshiftRun(
      'transforms/fix-pdsc-mock-imports/transform.js',
      path,
      {
        ignorePattern: 'node_modules',
        ...options,
      }
    );
  },

  includeTestsInHost: (paths, options) => {
    const cwd = process.cwd();
    const filesArray = paths.map(path =>
      walkSync(cwd, {
        globs: [`${path}/**/index.js`],
        ignore: ['**/node_modules', '**/bower_components'],
        directories: false,
      })
    );

    const filesFlattened = [].concat(...filesArray);

    return jscodeshiftRun(
      'transforms/insert-include-tests-in-host/transform.js',
      filesFlattened,
      options
    );
  },
};
