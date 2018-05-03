const program = require('commander');
const walkSync = require('walk-sync');
const runCodemod = require('./index');
const fs = require('fs');

program
  .usage(
    'source | codemod-helpers-include-tests-in-host source1 source2 ... sourceN'
  )
  .option('-d --dry', 'Dry run (no changes are made to files')
  .parse(process.argv);

runCodemod.includeTestsInHost(program.args, { dry: program.dry });
