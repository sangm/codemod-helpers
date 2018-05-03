const fs = require('fs');
const Runner = require('jscodeshift/src/Runner');
const { resolve, parse, join } = require('path');

const getGlobalOptions = options => ({
  extensions: 'js',
  silent: !options.dry,
  verbose: options.dry ? 0 : false,
  ...options,
});

const jscodeshfitRun = (transformFile, path, options, callback) => {
  console.log(`Applying codemod`);

  const afterRun =
    callback && typeof callback === 'function'
      ? callback
      : () => console.log('Finished applying the codemod');

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
      resolve(`${__dirname}/src/fix-imports/transform.js`),
      testFiles,
      { source: name, importPrefix, dry },
      callback
    );
  },

  fixPdscImports: (path, options) => {
    return jscodeshfitRun(
      resolve(`${__dirname}/src/fix-pdsc-mock-imports/transform.js`),
      path,
      {
        ignorePattern: 'node_modules',
        ...options,
      }
    );
  },
  },
};
