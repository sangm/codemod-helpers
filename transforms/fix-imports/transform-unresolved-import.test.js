import test from 'ava';
import jscodeshift from 'jscodeshift';
import testCodemod from 'jscodeshift-ava-tester';
import fixImports from './transform-generator';

const { testUnchanged, testChanged } = testCodemod(
  jscodeshift,
  test,
  fixImports({
    source: 'core/lib/cool-app-testing/tests/helpers/module-for-acceptance.js',
    target: 'lib/cool-app-test-helpers/module-for-acceptance.js',
    importPrefix: 'cool-app-test-helpers',
    filePath:
      'core/engines/messaging/tests/acceptance/topcard-modal/topcard-common-test.js',
  })
);

testChanged(
  `
import {
  moduleForAcceptance,
  test,
} from '../../../helpers/module-for-acceptance';`,
  `
import {
  moduleForAcceptance,
  test,
} from 'cool-app-test-helpers/module-for-acceptance';`
);
