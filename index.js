const fs = require('fs');
const Runner = require('jscodeshift/src/Runner');
const walkSync = require('walk-sync');
const { resolve, parse, join } = require('path');

const getGlobalOptions = options => ({
  extensions: 'js',
  silent: !options.dry,
  verbose: options.dry ? 0 : false,
  ...options,
});

const jscodeshfitRun = (relativeTransformFile, path, options, callback) => {
  console.log(`Applying codemod`);

  const afterRun =
    callback && typeof callback === 'function'
      ? callback
      : () => console.log('Finished applying the codemod');

  const transformFile = resolve(`${__dirname}/${relativeTransformFile}`);
  return Runner.run(transformFile, path, getGlobalOptions(options)).then(
    afterRun
  );
};

module.exports = {
  moveHelper: ({ source, directory, importPrefix, testFiles, dry }) => {
    const parsedSource = parse(source);
    const { name } = parsedSource;
    const resolvedSourcePath = resolve(source);
    const resolvedDirectoryPath = join(directory, name);

    const callback = () => {
      if (!dry) {
        try {
          fs.renameSync(resolvedSourcePath, `${resolvedDirectoryPath}.js`);
        } catch (e) {
          console.log(
            `Failed to rename ${resolvedSourcePath} to ${resolvedDirectoryPath}.js`
          );
        }
      }
    };

    return jscodeshfitRun(
      'transforms/fix-imports/transform.js',
      testFiles,
      { source: name, importPrefix, dry },
      callback
    );
  },

  fixPdscImports: (path, options) => {
    return jscodeshfitRun(
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

    return jscodeshfitRun(
      'transforms/insert-include-tests-in-host/transform.js',
      filesFlattened,
      options
    );
  },
};
