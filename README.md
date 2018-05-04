# codemod-helpers

## mv

**Important:** Run this codemod in the _root_ directory of the project. All
arguments _must_ be relative from the root of the project.

`codemod-helpers mv --help`

```
Usage: codemod-helpers-mv source target [--import-prefix]

Options:

  -i, --import-prefix <required>   string to append in front of the helper when replacing the import references
  -r --root                        Root of the project such as ~/workspace/foo-project/
  -t --test-files-pattern [value]  Glob patterns for the test files relative to the root (default: )
  -d --dry                         Dry run (no changes are made to files
  -h, --help                       output usage information
```

```
codemod-helpers mv core/lib/scroll-to-bottom.js lib/test-helpers -i "IMPORT_PREFIX"
```

Will result in `core/lib/scroll-to-bottom.js` moved to `lib/test-helpers` as
well as finding / replacing all the references and adding `test-helpers`.

Given this file:

```
// /Users/sangm/foo-project_trunk/tests/foo-test.js

import '../helpers/a';
import '../helpers/scroll-to-bottom';
...
```

will result in

```
// /Users/sangm/foo-project_trunk/tests/foo-test.js

import 'IMPORT_PREFIX/scroll-to-bottom';
import '../helpers/a';
...
```

The order of imports will be sorted.

And the original file `core/lib/scroll-to-bottom.js` being moved to
`lib/test-helpers/scroll-to-bottom.js`

## fix-pdsc-imports

```
Usage: codemod-helpers-fix-pdsc-imports [DIRECTORY|FILE]

Options:

  -d --dry    Dry run (no changes are made to files
  -h, --help  output usage information
```

Fixes imports with `../pdsc-mock` to absolute path:
`ember-pdsc-mocker/pdsc-mock`

## include-tests-in-host | it

Goes through a given directory and inserts `use strict` + `includeTestsInHost`

```
Usage: codemod-helpers-include-tests-in-host source | codemod-helpers-include-tests-in-host source1 source2 ... sourceN

Options:

  -d --dry    Dry run (no changes are made to files
  -h, --help  output usage information
```
