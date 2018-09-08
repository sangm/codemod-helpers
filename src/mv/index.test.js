import test from 'ava';
import fs from 'fs';
import { sep } from 'path';
import process from 'process';
import { ERROR_MESSAGES } from './constants';
import mv from '.';
import mock from 'mock-fs';

test.after.always(t => {
  mock.restore();
});

const getDirectory = (root, path) => {
  const paths = path.split(sep).filter(Boolean);
  return paths.reduce((dir, p) => dir.getItem(p), root);
};

test('wrong number of args results in error message', async t => {
  const program = { args: ['lib'], importPrefix: 'foo-tests' };
  const error = await t.throws(mv(program, fs, process));
  t.deepEqual(error, new Error(ERROR_MESSAGES.args));
});

test('if program.dry is true, ensure there are no side effects', async t => {
  const program = {
    args: ['foo.js', 'bar.js'],
    importPrefix: 'abc',
    dry: true,
  };

  mock({
    'foo.js': 'hello',
  });

  const cwd = process.cwd();
  const directory = getDirectory(mock.getMockRoot(), cwd);

  t.is(directory.list().length, 1);
  t.deepEqual(directory.list(), ['foo.js']);

  await mv(program, fs, process);

  t.is(directory.list().length, 1);
  t.deepEqual(directory.list(), ['foo.js']);
});

test('given one js file, ensure file is moved in flat structure', async t => {
  const program = { args: ['foo.js', 'bar.js'], importPrefix: 'abc' };
  mock({
    'foo.js': 'hello',
  });
  const cwd = process.cwd();
  const directory = getDirectory(mock.getMockRoot(), cwd);

  t.is(directory.list().length, 1);
  t.deepEqual(directory.list(), ['foo.js']);

  await mv(program, fs, process);
  t.is(directory.list().length, 1);
  t.deepEqual(directory.list(), ['bar.js']);
});

test('given one js file, ensure is moved in nested structure', async t => {
  const program = { args: ['src/foo.js', 'dest/bar/'], importPrefix: 'abc' };
  mock({
    src: { 'foo.js': 'hello' },
    dest: { bar: {} },
  });
  const cwd = process.cwd();
  const directory = getDirectory(mock.getMockRoot(), cwd);

  t.is(directory.list().length, 2);
  t.deepEqual(directory.list(), ['dest', 'src']);
  t.is(directory.getItem('src').list().length, 1);
  t.is(directory.getItem('dest').list().length, 1);
  t.is(
    directory
      .getItem('dest')
      .getItem('bar')
      .list().length,
    0
  );

  await mv(program, fs, process);

  t.is(directory.getItem('src').list().length, 0);
  t.is(
    directory
      .getItem('dest')
      .getItem('bar')
      .list().length,
    1
  );
});

test('given nested directory structure, verify files get replaced', async t => {
  const program = { args: ['dir1/foo.js', 'dir2/bar.js'], importPrefix: 'abc' };

  mock({
    dir1: {
      'foo.js': 'hello',
    },
    dir2: {
      'bar.js': 'nallo',
    },
  });
  const cwd = process.cwd();
  const directory = getDirectory(mock.getMockRoot(), cwd);
  t.deepEqual(directory.getItem('dir1').list(), ['foo.js']);
  t.deepEqual(directory.getItem('dir2').list(), ['bar.js']);

  await mv(program, fs, process);

  t.deepEqual(directory.getItem('dir1').list(), []);
  t.deepEqual(directory.getItem('dir2').list(), ['bar.js']);
  t.deepEqual(
    directory
      .getItem('dir2')
      .getItem('bar.js')
      .getContent()
      .toString(),
    'hello'
  );
});

test('given an existing directory, target is moved', async t => {
  const program = {
    args: ['foo.js', './dist'],
    importPrefix: 'abc',
  };

  mock({
    'foo.js': 'hello',
    dist: {},
  });

  const cwd = process.cwd();
  const directory = getDirectory(mock.getMockRoot(), cwd);

  t.deepEqual(directory.getItem('dist').list(), []);
  await mv(program, fs, process);
  t.deepEqual(directory.getItem('dist').list(), ['foo.js']);
});

test('given a directory that does not exist, make directory and move target', async t => {
  const program = {
    args: ['foo.js', 'dist'],
    importPrefix: 'abc',
  };

  mock({
    'foo.js': 'hello',
  });

  const cwd = process.cwd();
  const directory = getDirectory(mock.getMockRoot(), cwd);

  t.falsy(directory.getItem('dist'));
  await mv(program, fs, process);
  t.deepEqual(directory.getItem('dist').list(), ['foo.js']);
});

test('move file given nested target that does not exist', async t => {
  const program = {
    args: ['foo.js', 'dist/bar/foo.js'],
    importPrefix: 'abc',
  };

  mock({
    'foo.js': 'hello',
  });

  const cwd = process.cwd();
  const directory = getDirectory(mock.getMockRoot(), cwd);
  t.deepEqual(directory.list(), ['foo.js']);

  await mv(program, fs, process);
  // console.log(directory.list());
});

// test('move file given nested target that does not exist', async t => {
//   const program = {
//     args: ['foo.js', 'dist/bar/'],
//     importPrefix: 'abc',
//   };

//   mock({
//     'foo.js': 'hello',
//   });

// });

// test('given a failure, delete file')
// write some tests with many directories deep similar to real app for parsed.dir
