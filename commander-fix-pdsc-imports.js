const program = require('commander');
const runCodemod = require('./index');

program.parse(process.argv);
if (program.args.length !== 1) {
  console.log('codemod-helpers fix-pdsc-imports DIRECTORY');
  return;
}
runCodemod.fixPdscImports(program.args);
