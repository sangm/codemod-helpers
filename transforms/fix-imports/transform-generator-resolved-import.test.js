import test from 'ava';
import jscodeshift from 'jscodeshift';
import testCodemod from 'jscodeshift-ava-tester';
import fixImports from './transform-generator';

const { testUnchanged, testChanged } = testCodemod(
  jscodeshift,
  test,
  fixImports({
    source: 'app/lib/bar-addon/tests/helpers/register-mocks.js',
    target: 'lib/foo-test-helpers/addon-test-support/',
    importPrefix: 'foo-test-helpers',
    filePath: 'app/lib/bar-addon/tests/test-helper.js',
  })
);

testChanged(
  `import registerMocks from './helpers/register-mocks';`,
  `import registerMocks from 'foo-test-helpers/register-mocks';`
);

testChanged(
  `
import registerMocks from './helpers/register-mocks';
import Ember from 'ember';
import { get } from '@ember/object';
`,
  `
import Ember from 'ember';
import { get } from '@ember/object';
import registerMocks from 'foo-test-helpers/register-mocks';
`
);

testUnchanged(`import foo from 'bar/abc'`);
testUnchanged('const a = 123;');
