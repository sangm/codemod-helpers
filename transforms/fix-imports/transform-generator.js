const { join, parse } = require('path');
const sortImportTransform = require('codemod-imports-sort/dist');
const fixPdscTransfrom = require('../fix-pdsc-mock-imports/transform');
const fixPdscNode = require('../utils/fix-pdsc-node');

const TEST_REGEX = /.+\/(tests\/.+)/;
const TEST_HELPER_REGEX = /.+\/(helpers\/.+)/;

const mutatePathWithNewImportValue = (
  parsedSource,
  parsedTarget,
  path,
  importPrefix
) => {
  // it means we found a match. we need to replace the string now
  const name = parsedTarget.ext ? parsedTarget.name : parsedSource.name;
  const newImportValue = join(importPrefix, name);
  path.node.source.value = newImportValue;
};

const resolvedRelativeImportTransform = (helper, target, importPrefix) => (
  fileInfo,
  api,
  options
) => {
  const { source, path: filePath } = fileInfo;
  const { jscodeshift: j } = api;

  let modified = false;
  const parsedSource = parse(helper);
  const parsedTarget = parse(target);
  const filePathParsed = parse(filePath);
  const fileWithoutExtension = join(parsedSource.dir, parsedSource.name);
  const fullSourcePathWithoutExtension = join(
    parsedSource.dir,
    parsedSource.name
  );
  const changedSource = j(source)
    .find(j.ImportDeclaration)
    .forEach(path => {
      const importString = path.node.source.value;
      const resolvedImportPathWithoutExtension = join(
        filePathParsed.dir,
        importString
      );

      const matchedExpResolvedImport = TEST_REGEX.exec(
        resolvedImportPathWithoutExtension
      );
      const matchedFullSource = TEST_REGEX.exec(fullSourcePathWithoutExtension);
      if (
        matchedExpResolvedImport &&
        matchedFullSource &&
        resolvedImportPathWithoutExtension === fullSourcePathWithoutExtension
      ) {
        {
          mutatePathWithNewImportValue(
            parsedSource,
            parsedTarget,
            path,
            importPrefix
          );
          modified = true;
        }
      } else {
        // If path is not fully resolved, let's see if we have partial match
        const partialResolvedImportMatch = TEST_HELPER_REGEX.exec(
          resolvedImportPathWithoutExtension
        );
        const partialSourceMatch = TEST_HELPER_REGEX.exec(
          fullSourcePathWithoutExtension
        );
        if (
          partialResolvedImportMatch &&
          partialSourceMatch &&
          partialResolvedImportMatch[1] === partialSourceMatch[1]
        ) {
          mutatePathWithNewImportValue(
            parsedSource,
            parsedTarget,
            path,
            importPrefix
          );
          modified = true;
        }
      }
    })
    .toSource({ quote: 'single' });

  return { modified, changedSource };
};

module.exports = ({ source, target, importPrefix, filePath = undefined }) => (
  file,
  api,
  options
) => {
  const fileInfo = filePath ? { ...file, path: filePath } : file;

  const { modified, changedSource } = resolvedRelativeImportTransform(
    source,
    target,
    importPrefix
  )(fileInfo, api, options);

  if (modified) {
    return sortImportTransform.default(
      {
        ...fileInfo,
        source: changedSource,
      },
      api,
      options
    );
  }

  return changedSource;
};
