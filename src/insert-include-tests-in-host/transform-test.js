import test from 'ava';
import jscodeshfit from 'jscodeshift';
import testCodemod from 'jscodeshift-ava-tester';
import transform from './transform';

const { testUnchanged, testChanged } = testCodemod(
  jscodeshfit,
  test,
  transform
);

testChanged(
  `
module.exports = {
  name: 'foo',
};
`,
  `
'use strict';
module.exports = {
  name: 'foo',
  includeTestsInHost: true
};
`
);

testChanged(
  `
module.exports = Engine.extend({
  name: 'jobs-search',
  isDevelopingAddon: () => true,
});
`,
  `
'use strict';
module.exports = Engine.extend({
  name: 'jobs-search',
  isDevelopingAddon: () => true,
  includeTestsInHost: true
});
`
);

testChanged(
  `
'use strict';
module.exports = emberRollup(['@foo'], {
  name: 'data-layer',
  options: {
    babel: babelOptions,
  },
});
`,
  `
'use strict';
module.exports = emberRollup(['@foo'], {
  name: 'data-layer',

  options: {
    babel: babelOptions,
  },

  includeTestsInHost: true
});
`
);

testChanged(
  `
// preserves comments
module.exports = emberRollup(['@foo'], {
  name: 'data-layer',

  options: {
    babel: babelOptions,
  },
});
`,
  `
'use strict';
// preserves comments
module.exports = emberRollup(['@foo'], {
  name: 'data-layer',

  options: {
    babel: babelOptions,
  },

  includeTestsInHost: true
});
`
);

testUnchanged(
  `
'use strict';
// preserves comments
module.exports = emberRollup(['@foo'], {
  name: 'data-layer',

  options: {
    babel: babelOptions,
  },

  includeTestsInHost: true
});
`
);

testUnchanged(
  `
module.exports = Engine.extend({
  name: 'jobs-search',

  includeTestsInHost: true,
  isDevelopingAddon: () => true,
});
`
);

testUnchanged(`import foo from 'bar';`);
