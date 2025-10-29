// Custom rule for no color literals with dynamic Tamagui token allowlist
const { ESLintGlobalCache } = require('../utils/eslint-utils');

// Pre-compute color properties as Set for O(1) lookups at module level
const colorPropsSet = new Set([
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderRightColor',
  'shadowColor',
  'textShadowColor',
  'tintColor',
  'placeholderTextColor',
  'selectionColor',
  'underlineColorAndroid',
]);

const noColorLiteralsWithTokensRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow color literals except for Tamagui color tokens and themeConstants.ts',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create: function (context) {
    // Cache Tamagui colors using shared cache (expensive operation, done once per ESLint run)
    const tamaguiColors = ESLintGlobalCache.getTamaguiColorTokens();

    // Helper function to check if a value is a valid color (literal or token)
    function isValidColor(value) {
      if (!value) return true; // Allow empty/null values

      // Allow Tamagui color tokens (starting with $)
      if (typeof value === 'string' && value.startsWith('$')) {
        return true; // Let Tamagui handle validation of token names
      }

      // Allow color values that are in our extracted tamagui colors (O(1) Set lookup)
      if (tamaguiColors && (tamaguiColors.has ? tamaguiColors.has(value) : tamaguiColors.includes(value))) {
        return true;
      }

      // Allow transparent
      if (value === 'transparent') {
        return true;
      }

      return false;
    }

    // Helper function to check if a property is color-related (O(1) Set lookup)
    function isColorProperty(propName) {
      return propName && colorPropsSet.has(propName);
    }

    return {
      JSXAttribute: function (node) {
        // Cache attribute name for performance
        const attrName = node.name?.name;
        if (attrName === 'style') {
          // Handle inline styles (optimized)
          if (node.value?.expression?.properties) {
            for (const prop of node.value.expression.properties) {
              // Cache property name for performance
              const propName = prop.key?.name || prop.key?.value;
              if (isColorProperty(propName)) {
                if (prop.value?.type === 'Literal') {
                  const colorValue = prop.value.value;
                  if (!isValidColor(colorValue)) {
                    context.report({
                      node: prop,
                      message: `Color literal "${colorValue}" is not allowed. Use Tamagui color tokens instead.`,
                    });
                  }
                }
              }
            }
          }
        }
      },
      CallExpression: function (node) {
        // Cache callee for performance
        const callee = node.callee;
        if (callee?.object?.name === 'StyleSheet' && callee.property?.name === 'create') {
          if (node.arguments?.[0]?.properties) {
            for (const styleProp of node.arguments[0].properties) {
              if (styleProp.value?.properties) {
                for (const prop of styleProp.value.properties) {
                  // Cache property name for performance
                  const propName = prop.key?.name || prop.key?.value;
                  if (isColorProperty(propName)) {
                    if (prop.value?.type === 'Literal') {
                      const colorValue = prop.value.value;
                      if (!isValidColor(colorValue)) {
                        context.report({
                          node: prop,
                          message: `Color literal "${colorValue}" is not allowed. Use Tamagui color tokens instead.`,
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
    };
  },
};

module.exports = {
  noColorLiteralsWithTokensRule,
};
