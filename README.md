# codemod-helpers

## mv

`codemod-helpers mv --help`

```
Usage: mv [options]

Move file along with reference to all of its imports. We will also sort the imports.

Options:

  -s, --source <required>          file to move
  -d, --directory <required>       folder to move the file to
  -i, --import-prefix <required>   string to append in front of the helper when replacing the import references
  -r --root <required>             Root of the project such as ~/workspace/foo-project/ (default: )
  -t --test-files-pattern [value]  Glob patterns for the test files relative to the root (default: )
  -h, --help                       output usage information
```

Examples:

```
codemod-helpers mv
  -i "test-helpers"
  -d "lib/test-helpers"
  -r /Users/sangm/workspace/foo-project_trunk
  -s core/lib/scroll-to-bottom.js
```

Will result in `core/lib/scroll-to-bottom.js` moved to `lib/test-helpers` as
well as finding / replacing all the references of the file.
