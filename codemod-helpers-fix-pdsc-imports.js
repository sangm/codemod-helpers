const program = require('commander');
const runCodemod = require('./index');

program
  .usage('[DIRECTORY|FILE]')
  .option('-d --dry', 'Dry run (no changes are made to files')
  .parse(process.argv);

runCodemod.fixPdscImports(program.args, { dry: program.dry });
