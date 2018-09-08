const { promisify } = require('util');
const { parse, join } = require('path');
const mkdirp = require('mkdirp');
const checkForErrors = require('./check-for-errors');

const moveFile = (fs, root, source, target) => {
  const rename = promisify(fs.rename);
  const targetParsed = parse(target);
  const sourceParsed = parse(source);
  const absoluteSourcePath = join(root, sourceParsed.dir, sourceParsed.base);
  const absoluteTargetPath = join(root, targetParsed.dir, targetParsed.base);
  return targetParsed.ext
    ? rename(absoluteSourcePath, absoluteTargetPath)
    : rename(absoluteSourcePath, join(absoluteTargetPath, sourceParsed.base));
};

module.exports = (program, fs, process) => {
  const errors = checkForErrors(program);

  if (errors) {
    return Promise.reject(new Error(errors));
  }

  const root = program.root || process.cwd();
  const [source, target] = program.args;
  const targetParsed = parse(target);
  const absoluteTargetPath = join(root, targetParsed.dir, targetParsed.base);

  if (!program.dry) {
    if (fs.existsSync(absoluteTargetPath)) {
      return moveFile(fs, root, source, target);
    } else {
      const newDirectory = targetParsed.ext
        ? join(root, targetParsed.dir)
        : absoluteTargetPath;
      mkdirp.sync(newDirectory);
      return moveFile(fs, root, source, target);
    }
  }
};
