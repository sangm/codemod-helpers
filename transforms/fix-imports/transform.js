const transformGenerator = require('./transform-generator');

module.exports = (fileInfo, api, options) => {
  const { source, target, importPrefix } = options;
  return transformGenerator(options)(fileInfo, api, options);
};
