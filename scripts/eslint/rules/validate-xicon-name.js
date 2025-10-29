const { ESLintGlobalCache } = require('../utils/eslint-utils');

// Get cached icon names once at module level (shared across all files)
const validIconNames = ESLintGlobalCache.getValidIconNames();

/**
 * Custom ESLint rule to validate any icon-related prop values (icon, iconName, startIcon, endIcon, etc.)
 */
const validateIconPropsRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Validate that any icon-related prop values are valid Material Community Icon names',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create: function (context) {
    /**
     * Validate a single icon name
     */
    function validateIconName(iconName, node) {
      if (!validIconNames.has(iconName)) {
        const suggestions = getSimilarIconNames(iconName);
        context.report({
          node: node,
          message: `Invalid icon name "${iconName}". ${suggestions.length > 0 ? `Did you mean: ${suggestions.join(', ')}?` : 'Use a valid Material Community Icon name.'}`,
        });
      }
    }

    return {
      JSXAttribute: function (node) {
        const propName = node.name?.name;

        // Skip non-component attributes (like spread props)
        if (node.name?.type !== 'JSXIdentifier') {
          return;
        }

        // Check if this is XIcon component with name prop (original functionality)
        const parentElement = node.parent;
        const isXIconName = parentElement?.type === 'JSXOpeningElement' && parentElement.name?.name === 'XIcon' && propName === 'name';

        // Check if this is any component with icon-related prop (new functionality)
        // Only validate actual icon props, not color or other icon-related props
        const isIconProp =
          propName &&
          (propName.toLowerCase() === 'icon' ||
            propName.toLowerCase() === 'iconname' ||
            propName.toLowerCase() === 'starticon' ||
            propName.toLowerCase() === 'endicon' ||
            (propName.toLowerCase().includes('icon') && propName.toLowerCase().endsWith('icon')));

        // Process if either condition is met
        if (!isXIconName && !isIconProp) {
          return;
        }

        const value = node.value;

        // Handle direct string literals: icon="airplane", iconName="car", startIcon="bus"
        if (value?.type === 'Literal' && typeof value.value === 'string') {
          validateIconName(value.value, value);
        }
        // Handle JSX expressions: icon={...}, iconName={getIcon()}, startIcon={someVar ? 'a' : 'b'}
        else if (value?.type === 'JSXExpressionContainer') {
          const expression = value.expression;

          // Extract all string literals from the expression
          const iconNames = extractStringLiterals(expression);

          if (iconNames.length > 0) {
            // Validate all found string literals
            iconNames.forEach(iconName => validateIconName(iconName, value));
          }
          // Note: Dynamic values that can't be analyzed are silently ignored
          // Only statically analyzable string literals are validated
        }
      },
    };
  },
};

/**
 * Get similar icon names using simple distance
 */
function getSimilarIconNames(invalidName) {
  const suggestions = [];
  const maxDistance = 2;
  const maxSuggestions = 3;

  let foundCount = 0;
  for (const validName of validIconNames) {
    if (foundCount >= maxSuggestions) break;

    const distance = simpleDistance(invalidName, validName);
    if (distance <= maxDistance && distance > 0) {
      suggestions.push(validName);
      foundCount++;
    }
  }

  return suggestions.sort();
}

/**
 * Simple string distance for icon names
 */
function simpleDistance(str1, str2) {
  let differences = 0;
  const maxLen = Math.max(str1.length, str2.length);

  for (let i = 0; i < maxLen; i++) {
    const char1 = str1[i] || '';
    const char2 = str2[i] || '';
    if (char1 !== char2) differences++;
    if (differences > 2) return 3;
  }

  return differences;
}

/**
 * Extract all string literals from an expression (ternaries, logical ops, template literals)
 */
function extractStringLiterals(node) {
  const literals = [];

  function walk(n) {
    if (!n) return;

    // Direct string literal
    if (n.type === 'Literal' && typeof n.value === 'string') {
      literals.push(n.value);
    }
    // Ternary: condition ? 'a' : 'b'
    else if (n.type === 'ConditionalExpression') {
      walk(n.consequent);
      walk(n.alternate);
    }
    // Logical: x && 'a' || 'b'
    else if (n.type === 'LogicalExpression') {
      walk(n.left);
      walk(n.right);
    }
    // Template literal: `icon-${x}` (extract static parts)
    else if (n.type === 'TemplateLiteral') {
      n.quasis.forEach(quasi => {
        if (quasi.value.cooked) {
          literals.push(quasi.value.cooked);
        }
      });
    }
  }

  walk(node);
  return literals;
}

module.exports = {
  validateIconPropsRule,
};
