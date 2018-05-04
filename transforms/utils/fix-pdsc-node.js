module.exports = path => {
  const value = path.node.source.value;
  if (value.includes('/pdsc-mock')) {
    const importPaths = value.split('/');
    const lastPart = importPaths[importPaths.length - 1];
    if (lastPart.includes('pdsc-mock')) {
      const correctImport = `ember-pdsc-mocker/${lastPart}`;
      path.node.source.value = correctImport;
    }

    return true;
  }

  return false;
};
