import test from 'ava';
import jscodeshfit from 'jscodeshift';
import testCodemod from 'jscodeshift-ava-tester';
import fixImports from './transform-generator';

const { testUnchanged, testChanged } = testCodemod(
  jscodeshfit,
  test,
  fixImports('bar', 'lib-test-helpers')
);

testChanged(
  `import foo from 'foo/bar';`,
  `import foo from 'lib-test-helpers/bar';`
);

testChanged(
  `
import { foo } from '../bar';
import Ember from 'ember';
`,
  `
import Ember from 'ember';
import { foo } from 'lib-test-helpers/bar';
`
);

testChanged(
  `
import { foo } from '../bar';
import Ember from 'ember';
import { get } from '@ember/object';
`,
  `
import Ember from 'ember';
import { get } from '@ember/object';
import { foo } from 'lib-test-helpers/bar';
`
);

testChanged(
  `
import { click, currentRouteName, visit } from 'ember-native-dom-helpers';
import { moduleForAcceptance, test } from '../../helpers/module-for-acceptance';
import p from '../../helpers/p';
import BrowserUtil from '../../helpers/bar';

// Mock data
import c from '../../helpers/mocks/f/a/b';
`,
  `
import { click, currentRouteName, visit } from 'ember-native-dom-helpers';
import BrowserUtil from 'lib-test-helpers/bar';
// Mock data
import c from '../../helpers/mocks/f/a/b';
import { moduleForAcceptance, test } from '../../helpers/module-for-acceptance';

import p from '../../helpers/p';
`
);

testUnchanged(`import foo from 'bar/abc'`);
testUnchanged('const a = 123;');
