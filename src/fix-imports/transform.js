const transformGenerator = require('./transform-generator');

module.exports = (fileInfo, api, options) => {
  const { source, importPrefix } = options;
  return transformGenerator(source, importPrefix)(fileInfo, api, options);
};
