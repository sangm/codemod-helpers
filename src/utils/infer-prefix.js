const { join } = require('path');

module.exports = (path, excludeTestSupport) => {
  const parts = path.split('/').filter(Boolean);

  if (!parts) {
    return '';
  }
  const pivotIndex = parts.indexOf('addon-test-support');

  if (!pivotIndex) {
    return '';
  }

  const addonName = parts[pivotIndex - 1];
  const rest = parts.slice(pivotIndex + 1).join('/');

  return excludeTestSupport
    ? join(addonName, rest)
    : join(addonName, 'test-support', rest);
};
