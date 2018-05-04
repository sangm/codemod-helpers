import test from 'ava';
import jscodeshfit from 'jscodeshift';
import testCodemod from 'jscodeshift-ava-tester';
import fixPdscMocks from './transform';

const { testUnchanged, testChanged } = testCodemod(
  jscodeshfit,
  test,
  fixPdscMocks
);

testChanged(
  `import PDSCMocker from '../../../../pdsc-mocker';`,
  `import PDSCMocker from 'ember-pdsc-mocker/pdsc-mocker';`
);

testChanged(
  `import PDSCMocker from 'core/tests/pdsc-mocker';`,
  `import PDSCMocker from 'ember-pdsc-mocker/pdsc-mocker';`
);

testChanged(
  `
import PDSCMocker from '../../pdsc-mocker';
import { get } from '@ember/object';
`,
  `
import { get } from '@ember/object';
import PDSCMocker from 'ember-pdsc-mocker/pdsc-mocker';
`
);

testChanged(
  `import PDSCMock from '../pdsc-mock';`,
  `import PDSCMock from 'ember-pdsc-mocker/pdsc-mock';`
);

testUnchanged(`import generateMsgPDSCMocks from './msg-pdsc-mocker';`);
testUnchanged(`import foobar from '../../pdsc-mocks/comments';`);
