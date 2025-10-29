// Custom rule to enforce no text elements inside action/button components
const noXTextInXActionRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow text elements as direct children of action/button components',
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

        // Check if this is an action/button component (pattern-based detection)
        const isActionComponent = elementName && (elementName.includes('Action') || elementName.includes('Button') || elementName.endsWith('Btn') || elementName.match(/^[A-Z][a-zA-Z]*Button$/));

        if (isActionComponent) {
          // Check its direct children (optimized forEach with early returns)
          for (const child of node.children) {
            if (child.type === 'JSXElement') {
              // Cache child element name for performance
              const childName = child.openingElement?.name?.name;

              // Check if this is a text component (pattern-based detection)
              const isTextComponent = childName && (childName.includes('Text') || childName.endsWith('Text') || childName.match(/^[A-Z][a-zA-Z]*Text$/));

              if (isTextComponent) {
                context.report({
                  node: child.openingElement,
                  message: `${childName} elements are not allowed as direct children of ${elementName}. Use the component's children prop directly or wrap in a container.`,
                });
              }
            }
          }
        }
      },
    };
  },
};

module.exports = {
  noXTextInXActionRule,
};
