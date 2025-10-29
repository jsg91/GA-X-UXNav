// Custom rule to prevent text elements inside other text components
const noXTextInXTextRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow text elements as direct children of other text components',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create: function (context) {
    const textComponentStack = [];

    return {
      JSXOpeningElement: function (node) {
        // Cache component name for performance
        const componentName = node.name?.name;

        // Check if this is a text component (pattern-based detection)
        const isTextComponent = componentName && (componentName.includes('Text') || componentName.endsWith('Text') || componentName.match(/^[A-Z][a-zA-Z]*Text$/));

        if (isTextComponent) {
          // Check if this text component is nested inside another text component (optimized)
          if (textComponentStack.length > 0) {
            context.report({
              node: node,
              message: `${componentName} elements are not allowed as direct children of other text components. Use a container or span element instead.`,
            });
          }
          textComponentStack.push(node);
        }
      },
      JSXClosingElement: function (node) {
        // Cache component name for performance
        const componentName = node.name?.name;

        // Check if this is a text component (pattern-based detection)
        const isTextComponent = componentName && (componentName.includes('Text') || componentName.endsWith('Text') || componentName.match(/^[A-Z][a-zA-Z]*Text$/));

        if (isTextComponent && textComponentStack.length > 0) {
          textComponentStack.pop();
        }
      },
    };
  },
};

module.exports = {
  noXTextInXTextRule,
};
