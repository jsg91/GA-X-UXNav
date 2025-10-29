// Module-level Set for component names that support pointerEvents
const componentsWithPointerEvents = new Set(['View', 'TouchableOpacity', 'TouchableHighlight', 'TouchableWithoutFeedback', 'Pressable', 'ScrollView', 'FlatList', 'SectionList']);

// Custom rule to enforce pointerEvents in style prop instead of as a direct prop
const noPointerEventsPropRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce pointerEvents in style prop instead of as a direct prop for future-proofing',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create: function (context) {
    return {
      JSXAttribute: function (node) {
        const attrName = node.name?.name;
        if (attrName === 'pointerEvents') {
          // Check if this is on a View component (or similar component that supports pointerEvents)
          const componentName = node.parent?.name?.name;

          // O(1) Set lookup instead of multiple OR conditions
          if (componentName && componentsWithPointerEvents.has(componentName)) {
            context.report({
              node: node,
              message: `pointerEvents should be specified in the style prop as 'style={{ pointerEvents: \'none\' }}' instead of as a direct prop for better cross-platform compatibility and future-proofing.`,
            });
          }
        }
      },
    };
  },
};

module.exports = {
  noPointerEventsPropRule,
};
