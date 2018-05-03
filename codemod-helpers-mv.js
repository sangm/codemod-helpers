const program = require('commander');
const walkSync = require('walk-sync');
const runCodemod = require('./index');
const fs = require('fs');

const collect = (val, memo) => {
  memo.push(val);
  return memo;
};

program
  .usage('source target [--import-prefix]')
  .option(
    '-i, --import-prefix <required>',
    `string to append in front of the helper when replacing the import references`
  )
  .option(
    '-r --root',
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
  .option('-d --dry', 'Dry run (no changes are made to files')
  .parse(process.argv);

const checkForErrors = (program, root) => {
  if (program.args.length !== 2) {
    return 'Wrong number of arguments.';
  } else if (!program.importPrefix) {
    return `Please provide importPrefix with either '-i' or '--import-prefix'.
This wil be used to prefix all the previous import references.
Given the following:

codemod-helpers mv core/helper/foo.js lib/test-helpers/ -i "test-helpers/test-support"

we will find all import refences to 'core/helper/foo.js' and replace them with
'test-helpers/test-support/foo'
`;
  }

  const [source, directory] = program.args;
  // directory needs to exist
  const absolutePathDirectory = `${root}/${directory}`;
  try {
    const lstat = fs.lstatSync(absolutePathDirectory);
    return lstat.isDirectory()
      ? ''
      : `${absolutePathDirectory} is not a directory`;
  } catch (e) {
    return `${absolutePathDirectory} does not exist`;
  }
};

const { importPrefix, root: rootArg, testFilesPattern, dry } = program;
const root = rootArg || process.cwd();

const error = checkForErrors(program, root);
if (error) {
  console.log(error);
  console.log('run codemod-helpers mv --help to see documentation');
  return;
}

if (!rootArg) {
  console.log(
    'This command HAS to be ran on the root directory of the project.'
  );
  console.log(
    `Since '-r --root' option was not provided, we will assume the current working directory ${root}`
  );
}

const [source, directory] = program.args;

const globs =
  testFilesPattern.length !== 0
    ? testFilesPattern
    : [
        'core/**/+(tests|addon-test-support)/**/*.js',
        'extended/**/+(tests|addon-test-support)/**/*.js',
        'lib/**/+(tests|addon-test-support)/**/*.js',
        'engine-lib/**/+(tests|addon-test-support)/**/*.js',
      ];

const testFiles = walkSync(root, {
  globs,
  ignore: ['**/node_modules', '**/bower_components'],
  directories: false,
});

runCodemod.moveHelper({
  source,
  directory: `${root}/${directory}`,
  importPrefix,
  testFiles,
  dry,
});
