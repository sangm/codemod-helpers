const sortImportTransform = require('codemod-imports-sort/dist');

const changeImportTransform = (helper, importPrefix) => (
  fileInfo,
  api,
  options
) => {
  const { source } = fileInfo;
  const { jscodeshift: j } = api;

  let modified = false;
  const changedSource = j(source)
    .find(j.ImportDeclaration)
    .forEach(path => {
      if (path.node.source.value.endsWith(`/${helper}`)) {
        path.node.source.value = `${importPrefix}/${helper}`;
        modified = true;
      }
    })
    .toSource({ quote: 'single' });

  return { modified, changedSource };
};

module.exports = (source, importPrefix) => (fileInfo, api, options) => {
  const { modified, changedSource } = changeImportTransform(
    source,
    importPrefix
  )(fileInfo, api, options);

  if (modified) {
    return sortImportTransform.default(
      { ...fileInfo, source: changedSource },
      api,
      options
    );
  }

  return changedSource;
};
