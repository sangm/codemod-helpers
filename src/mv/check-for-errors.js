const { parse } = require('path');
const { ERROR_MESSAGES } = require('./constants');

module.exports = program => {
  if (program.args.length !== 2) {
    return 'Wrong number of arguments.';
  } else if (!program.importPrefix) {
    return ERROR_MESSAGES.importPrefix;
  }

  const [source, target] = program.args;

  //   const [source, directory] = program.args;
  //   // directory needs to exist
  //   const absolutePathDirectory = `${root}/${directory}`;
  //   try {
  //     const lstat = fs.lstatSync(absolutePathDirectory);
  //     return lstat.isDirectory()
  //       ? ''
  //       : `${absolutePathDirectory} is not a directory`;
  //   } catch (e) {
  //     return `${absolutePathDirectory} does not exist`;
  //   }
};
