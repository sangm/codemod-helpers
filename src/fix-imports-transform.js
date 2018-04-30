const transform = require('./fix-imports');

module.exports = (fileInfo, api, options) => {
  const { source, importPrefix } = options;
  return transform(source, importPrefix)(fileInfo, api, options);
};
