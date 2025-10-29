// Custom rule to enforce that XAction components must have children
const enforceXActionChildrenRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that XAction components must have children',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create: function (context) {
    return {
      JSXElement: function (node) {
        // Cache element name for performance
        const elementName = node.openingElement?.name?.name;

        // Early return: Only process XAction elements
        if (!elementName || elementName !== 'XAction') {
          return;
        }

        // Check if XAction is self-closing (no children)
        if (node.openingElement.selfClosing) {
          // Allow self-closing if there's an icon prop (icon-only actions)
          const hasIconProp = node.openingElement.attributes.some(attr => attr.type === 'JSXAttribute' && attr.name.name === 'icon');

          if (!hasIconProp) {
            context.report({
              node: node,
              message: 'XAction must have children unless it has an icon prop for icon-only actions',
            });
          }
          return;
        }
      },
    };
  },
};

module.exports = { enforceXActionChildrenRule };
