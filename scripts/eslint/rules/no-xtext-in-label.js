// Custom rule to prevent text elements inside label/form components
const noXTextInLabelRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow text elements as direct children of label/form components',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create: function (context) {
    const labelStack = [];

    return {
      JSXOpeningElement: function (node) {
        // Cache component name for performance
        const componentName = node.name?.name;

        // Check if this is a label/form component (pattern-based detection)
        const isLabelComponent = componentName && (componentName.includes('Label') || componentName.endsWith('Label') || componentName.match(/^[A-Z][a-zA-Z]*Label$/) || componentName === 'label');

        if (isLabelComponent) {
          labelStack.push(node);
        } else {
          // Check if this is a text component (pattern-based detection)
          const isTextComponent = componentName && (componentName.includes('Text') || componentName.endsWith('Text') || componentName.match(/^[A-Z][a-zA-Z]*Text$/));

          if (isTextComponent && labelStack.length > 0) {
            // Check if this text component is a direct child of a label component (optimized)
            if (labelStack.length > 0) {
              context.report({
                node: node,
                message: `${componentName} elements are not allowed as direct children of ${labelStack[labelStack.length - 1].openingElement?.name?.name || 'label'}. Use the component's children prop directly or apply styling to the component itself.`,
              });
            }
          }
        }
      },
      JSXClosingElement: function (node) {
        // Cache component name for performance
        const componentName = node.name?.name;

        // Check if this is a label/form component (pattern-based detection)
        const isLabelComponent = componentName && (componentName.includes('Label') || componentName.endsWith('Label') || componentName.match(/^[A-Z][a-zA-Z]*Label$/) || componentName === 'label');

        if (isLabelComponent && labelStack.length > 0) {
          labelStack.pop();
        }
      },
    };
  },
};

module.exports = {
  noXTextInLabelRule,
};
