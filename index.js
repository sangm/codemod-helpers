const fs = require('fs');
const Runner = require('jscodeshift/src/Runner');
const { resolve, parse, join } = require('path');

module.exports = {
  moveHelper: ({ source, directory, importPrefix, testFiles }) => {
    const parsedSource = parse(source);
    const { name } = parsedSource;
    const resolvedSourcePath = resolve(source);
    const resolvedDirectoryPath = join(directory, name);

    Runner.run(
      resolve(`${__dirname}/src/fix-imports-transform.js`),
      testFiles,
      {
        source: name,
        importPrefix,
      }
    ).then(() => {
      fs.renameSync(resolvedSourcePath, `${resolvedDirectoryPath}.js`);
    });
  },
};
