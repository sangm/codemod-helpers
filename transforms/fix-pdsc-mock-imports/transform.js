const sortImportTransform = require('codemod-imports-sort/dist');

const fixPdscMockTransform = (fileInfo, api, options) => {
  const { source } = fileInfo;
  const { jscodeshift: j } = api;

  let modified = false;
  const changedSource = j(source)
    .find(j.ImportDeclaration)
    .forEach(path => {
      const value = path.node.source.value;
      if (value.includes('/pdsc-mock')) {
        const importPaths = value.split('/');
        const lastPart = importPaths[importPaths.length - 1];
        const correctImport = `ember-pdsc-mocker/${lastPart}`;
        path.node.source.value = correctImport;
        modified = true;
      }
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
