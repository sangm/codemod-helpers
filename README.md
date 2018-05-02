# codemod-helpers

## mv

**Important:** Run this codemod in the _root_ directory of the project. All
arguments _must_ be relative from the root of the project.

`codemod-helpers mv --help`

```
Usage: mv [options]

Move file along with reference to all of its imports. We will also sort the imports by groups (absolute import and relative imports).

Options:

  -s, --source <required>          file to move
  -d, --directory <required>       folder to move the file to
  -i, --import-prefix <required>   string to append in front of the helper when replacing the import references
  -r --root <required>             Root of the project such as ~/workspace/foo-project/ (default: )
  -t --test-files-pattern [value]  Glob patterns for the test files relative to the root (default: )
  -h, --help                       output usage information
```

Examples:

We are using `pwd` here because this codemod requires running from the root directory.

```
codemod-helpers mv \
  -i "test-helpers" \
  -d "lib/test-helpers" \
  -r $(pwd) \
  -s "core/lib/scroll-to-bottom.js"
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

will result result in

```
// /Users/sangm/foo-project_trunk/tests/foo-test.js

import 'lib/test-helpers/scroll-to-bottom';
import '../helpers/a';
...
```

The order of imports will be sorted.

And the original file `core/lib/scroll-to-bottom.js` being moved to
`lib/test-helpers/scroll-to-bottom.js`

## fix-pdsc-imports

```
  Usage: fix-pdsc-imports [options] [command]

  fixes all pdsc mock imports and sorts imports

  Options:

    -p, --path [value]  foo (default: )
    -h, --help          output usage information
```

Fixes imports with `../pdsc-mock` to absolute path: `ember-pdsc-mocker/pdsc-mock`
