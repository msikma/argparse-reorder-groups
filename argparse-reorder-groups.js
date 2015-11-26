// (C) 2015, MIT License

/**
 * A hack to reorder the subparsers as they are displayed in --help.
 * Normally, there's a specific order in which the indented groups appear:
 * first the positionals, then the optionals, and finally subparsers with
 * custom defined names.
 *
 * This messes with internals, so it might break in future versions.
 * It works as of argparse@1.0.2.
 *
 * The 'order' array should contain subparsers.
 *
 * @param {ArgumentParser} parser Instance to modify group position of
 * @param {Array} order Array containing the subparsers in the correct order
 */
function reorderArgparseGroups(parser, order) {
  var a, b;
  var groups, group;

  // We'll make two arrays. Everything that isn't in 'order' will go to
  // the back, as close to the original order of 'parser._actionGroups'
  // as possible.
  var front = [], back = [];

  // Copy the actionGroups.
  groups = parser._actionGroups;

  for (a = 0; a < groups.length; ++a) {
    group = groups[a];

    // Run through our preferred order, moving things to 'front'
    // as needed.
    for (b = 0; b < order.length; ++b) {
      if (isGroupEqual(order[b], group)) {
        front.push(group);

        // Remove from 'groups' and 'order'.
        groups[a] = null;
        order = order.splice(b, 1);
      }
    }
  }

  // Move everything else into 'back'.
  for (a = 0; a < groups.length; ++a) {
    group = groups[a];
    if (group != null) {
      back.push(group);
    }
  }

  parser._actionGroups = front.concat(back);
}

/**
 * Checks whether a subparser, as returned by ArgumentParser.addSubparsers()
 * is equal to an internal entry in ArgumentParser._actionGroups.
 *
 * @param {Object} subparser Object returned by ArgumentParser.addSubparsers()
 * @param {Object} actionGroup Internal object of ArgumentParser._actionGroups
 */
function isGroupEqual(subparser, actionGroup) {
  if (!subparser.container) {
    return false;
  }
  return subparser.container.title === actionGroup.title;
}

module.exports = reorderArgparseGroups;
