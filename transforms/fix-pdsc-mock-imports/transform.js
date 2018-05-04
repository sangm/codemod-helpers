const sortImportTransform = require('codemod-imports-sort/dist');
const fixPdscNode = require('../utils/fix-pdsc-node');

const fixPdscMockTransform = (fileInfo, api, options) => {
  const { source } = fileInfo;
  const { jscodeshift: j } = api;

  let modified = false;
  const changedSource = j(source)
    .find(j.ImportDeclaration)
    .forEach(path => {
      modified = modified || fixPdscNode(path);
    })
    .toSource({ quote: 'single' });

  return { modified, changedSource };
};

module.exports = (fileInfo, api, options) => {
  const { modified, changedSource } = fixPdscMockTransform(
    fileInfo,
    api,
    options
  );

  if (modified) {
    return sortImportTransform.default(
      { ...fileInfo, source: changedSource },
      api,
      options
    );
  }

  return changedSource;
};
