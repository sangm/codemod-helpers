module.exports = {
  ERROR_MESSAGES: {
    args: 'Wrong number of arguments.',
    importPrefix: `Please provide importPrefix with either '-i' or '--import-prefix'.
    This will be used to prefix all the previous import references.
    Given the following:

    codemod-helpers mv core/helper/foo.js lib/test-helpers/ -i "test-helpers/test-support"

    we will find all import refences to 'core/helper/foo.js' and replace them with
    'test-helpers/test-support/foo'
    `,
  },
};
