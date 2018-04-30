import test from 'ava';
import jscodeshfit from 'jscodeshift';
import testCodemod from 'jscodeshift-ava-tester';
import fixImports from './fix-imports';

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
import { get } from '@meber/object';
`,
  `
import { get } from '@meber/object';
import Ember from 'ember';
import { foo } from 'lib-test-helpers/bar';
`
);

testUnchanged(`import foo from 'bar/abc'`);
testUnchanged('const a = 123;');
