// Module-level constants for better performance
const deprecatedShadowProps = ['shadowColor', 'shadowOffset', 'shadowOpacity', 'shadowRadius', 'elevation'];
const deprecatedShadowPropsSet = new Set(deprecatedShadowProps);
const stylePropsSet = new Set(['backgroundColor', 'borderRadius', 'width', 'height', 'margin', 'padding']);

// Custom rule to enforce boxShadow instead of deprecated shadow props
const noDeprecatedShadowPropsRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce use of boxShadow instead of deprecated shadow props (shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation)',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create: function (context) {
    return {
      JSXAttribute: function (node) {
        const propName = node.name?.name;
        if (propName && deprecatedShadowPropsSet.has(propName)) {
          // Check if this attribute is a style prop on a JSX element
          if (node.parent?.name?.name === 'style') {
            context.report({
              node: node,
              message: `Deprecated shadow prop '${propName}' is not allowed. Use 'boxShadow' instead for consistent cross-platform shadow styling.`,
            });
          }
        }
      },
      Property: function (node) {
        // Handle StyleSheet.create objects and other style objects
        const keyName = node.key?.name;
        if (keyName && deprecatedShadowPropsSet.has(keyName)) {
          // Check if this property is inside a style object (optimized)
          let isInStyleObject = false;
          let parent = node.parent;

          // Optimize parent traversal with early breaks
          while (parent && !isInStyleObject) {
            if (parent.type === 'ObjectExpression') {
              const grandparent = parent.parent;

              // Check if this object is part of StyleSheet.create
              if (grandparent?.type === 'CallExpression' && grandparent.callee?.object?.name === 'StyleSheet' && grandparent.callee.property?.name === 'create') {
                isInStyleObject = true;
                break;
              }

              // Check if this object is assigned to a style property
              if (grandparent?.type === 'Property' && grandparent.key?.name === 'style') {
                isInStyleObject = true;
                break;
              }

              // Check if this object is inside Platform.select
              if (grandparent?.type === 'CallExpression' && grandparent.callee?.name === 'select') {
                isInStyleObject = true;
                break;
              }

              // Check if this object is used in a style context (has other style properties) - O(1) Set lookup
              if (parent.properties.length > 1) {
                for (const prop of parent.properties) {
                  const propKeyName = prop.key?.name;
                  if (propKeyName && stylePropsSet.has(propKeyName)) {
                    isInStyleObject = true;
                    break;
                  }
                }
              }
            }
            parent = parent.parent;
          }

          if (isInStyleObject) {
            context.report({
              node: node,
              message: `Deprecated shadow prop '${keyName}' is not allowed. Use 'boxShadow' instead for consistent cross-platform shadow styling.`,
            });
          }
        }
      },
    };
  },
};

module.exports = {
  noDeprecatedShadowPropsRule,
};
