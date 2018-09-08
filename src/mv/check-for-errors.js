const { parse } = require('path');
const { ERROR_MESSAGES } = require('./constants');

module.exports = program => {
  if (program.args.length !== 2) {
    return 'Wrong number of arguments.';
  }

  return '';
};
