const program = require('commander');
const runCodemod = require('./index');

program
  .usage('[DIRECTORY|FILE]')
  .option('-d --dry', 'Dry run (no changes are made to files')
  .parse(process.argv);

if (program.args.length !== 1) {
  console.log('codemod-helpers fix-pdsc-imports DIRECTORY');
  return;
}

runCodemod.fixPdscImports(program.args, { dry: program.dry });
