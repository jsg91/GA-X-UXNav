// Pre-compute forbidden component names and sources as Sets at module level for O(1) lookups
const forbiddenComponents = new Set(['Icon', 'Iconify']);
const forbiddenSources = new Set(['@iconify/react']);

// Custom rule to enforce no Icon or Iconify usage (should use XIcon instead)
const noIconOrIconifyRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow usage of Icon and Iconify components - use XIcon instead',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create: function (context) {
    return {
      ImportDeclaration: function (node) {
        // Check for imports of Icon or Iconify (O(1) Set lookups)
        node.specifiers.forEach(specifier => {
          if (specifier.type === 'ImportSpecifier' && specifier.imported?.name && forbiddenComponents.has(specifier.imported.name)) {
            context.report({
              node: specifier,
              message: `Do not import '${specifier.imported.name}' - use 'XIcon' instead`,
            });
          }
        });

        // Check for Iconify import (O(1) Set lookup)
        if (node.source?.value && forbiddenSources.has(node.source.value)) {
          context.report({
            node: node,
            message: "Do not import from '@iconify/react' directly - use XIcon component instead",
          });
        }
      },
      JSXElement: function (node) {
        // Check for <Icon> JSX usage (O(1) Set lookup)
        if (node.openingElement?.name?.name && forbiddenComponents.has(node.openingElement.name.name)) {
          context.report({
            node: node.openingElement,
            message: `Do not use <${node.openingElement.name.name}> - use <XIcon> instead`,
          });
        }
      },
      // Also check for Iconify in expressions (like Iconify.icon)
      'MemberExpression[object.name="Iconify"]': function (node) {
        context.report({
          node: node,
          message: 'Do not use Iconify directly - use XIcon component instead',
        });
      },
    };
  },
};

module.exports = {
  noIconOrIconifyRule,
};
