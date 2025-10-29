// Custom rule to enforce that XAction components contain only raw text (no JSX elements)
const noJsxChildrenInXActionRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow JSX elements as direct children of XAction components - only raw text is allowed',
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

        // Check if this is specifically an XAction component
        if (elementName === 'XAction') {
          // Check its direct children (optimized forEach with early returns)
          for (const child of node.children) {
            if (child.type === 'JSXElement') {
              // Cache child element name for performance
              const childName = child.openingElement?.name?.name;
              context.report({
                node: child.openingElement,
                message: `${childName} elements are not allowed as direct children of XAction. Only raw text content is permitted.`,
              });
            }
          }
        }
      },
    };
  },
};

module.exports = {
  noJsxChildrenInXActionRule,
};
