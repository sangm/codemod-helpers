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
    '-i, --import-prefix',
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

runCodemod.moveHelper(program);
