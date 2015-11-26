# argparse-reorder-groups

A quick hack I wrote for JS [argparse](https://github.com/nodeca/argparse) that
allows you to put your own subparser groups above the standard positional and
optional argument groups in the `--help` output. (I wrote this because I got
tired of seeing my own subcommand lists appearing underneath the optional
arguments list.)

This depends on implementation details of argparse, so it could break in future
versions. At the moment, it works with 1.0.2.

## Example

```js
var ArgumentParser = require('argparse').ArgumentParser;
var reorderArgparseGroups = require('argparse-reorder-groups');

var parser = new ArgumentParser({
  'version': '1.0.0',
  'addHelp': true,
  'description': 'Description goes here.'
});
parser.addArgument(['--something'], {
  'type': 'int',
  'defaultValue': 3000,
  'required': false,
  'help': 'Does something.'
});

var lintingCommands = parser.addSubparsers({
  title: 'Linting commands',
  dest: 'linting_commands'
});
lintingCommands.addParser('eslint', {
  'description': 'Subcommand to run the linters for code correctness.',
  'help': 'Run ESLint to verify code correctness.'
});

// Normally, this would first display the optional arguments list with
// the --something argument and whatever else you put there.
// However, we want the 'eslint' command list on top. Apply our hack.
// You can add multiple command subparsers to the array.
reorderArgparseGroups(parser, [lintingCommands]);
```

## Copyright

© 2015, MIT License