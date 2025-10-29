// Module-level constants for better performance
const reactSources = new Set(['react', 'React']);

// Custom rule to warn about useMemo usage in React 19
const noUseMemoReact19Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn about useMemo usage - React 19 optimizes automatically',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create: function (context) {
    return {
      CallExpression: function (node) {
        // Cache callee for performance
        const callee = node.callee;
        if (!callee) return;

        // Cache property access chains for performance
        const calleeName = callee.name;
        const calleeObjectName = callee.object?.name;
        const calleePropertyName = callee.property?.name;

        // Combined check for useMemo and React.useMemo (optimized)
        if (calleeName === 'useMemo' || (calleeObjectName === 'React' && calleePropertyName === 'useMemo')) {
          context.report({
            node: node,
            message: 'useMemo is mostly unnecessary in React 19 due to automatic optimization. Consider removing it unless you have a specific performance requirement.',
          });
        }
      },

      // Check for import statements of useMemo (optimized with Set lookup)
      ImportSpecifier: function (node) {
        // Cache imported name for performance
        const importedName = node.imported?.name;
        if (importedName === 'useMemo') {
          // Check if it's from React (O(1) Set lookup)
          const parent = node.parent;
          if (parent?.source && reactSources.has(parent.source.value)) {
            context.report({
              node: node,
              message: 'useMemo import detected. In React 19, useMemo is mostly unnecessary due to automatic optimization. Consider removing unused imports.',
            });
          }
        }
      },
    };
  },
};

module.exports = {
  noUseMemoReact19Rule,
};
