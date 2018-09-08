import test from 'ava';
import inferPrefix from './infer-prefix';

test('excludes test-support', async t => {
  t.deepEqual(
    inferPrefix('lib/test-helpers/addon-test-support/admin/mocks/', true),
    'test-helpers/admin/mocks'
  );

  t.deepEqual(
    inferPrefix('lib/test-helpers/addon-test-support/p/m/', true),
    'test-helpers/p/m'
  );
});

test('handles something other than "lib"', async t => {
  t.deepEqual(
    inferPrefix('ex/engines/admin/addon-test-support/'),
    'admin/test-support'
  );
});
