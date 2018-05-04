import test from 'ava';
import jscodeshift from 'jscodeshift';
import testCodemod from 'jscodeshift-ava-tester';
import fixImports from './transform-generator';

const { testUnchanged, testChanged } = testCodemod(
  jscodeshift,
  test,
  fixImports({
    source: 'core/lib/voyager-testing/tests/helpers/module-for-acceptance.js',
    target: 'lib/voyager-test-helpers/module-for-acceptance.js',
    importPrefix: 'voyager-test-helpers',
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
} from 'voyager-test-helpers/module-for-acceptance';`
);
