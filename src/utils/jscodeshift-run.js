const Runner = require('jscodeshift/src/Runner');
const { resolve } = require('path');

const getGlobalOptions = options => ({
  extensions: 'js',
  silent: !options.dry,
  verbose: options.dry ? 0 : false,
  ...options,
});

module.exports = (relativeTransformFile, path, options, callback) => {
  console.log(`Applying codemod`);

  const afterRun =
    callback && typeof callback === 'function'
      ? callback
      : () => console.log('Finished applying the codemod');

  const transformFile = resolve(`${__dirname}/../../${relativeTransformFile}`);
  return Runner.run(transformFile, path, getGlobalOptions(options)).then(
    afterRun
  );
};
