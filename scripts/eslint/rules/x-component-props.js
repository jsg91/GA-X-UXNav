// Pre-compute allowed props as Set at module level for O(1) lookups
const allowedPropsSet = new Set([
  // Essential React props
  'key',
  'children',
  'ref',
  // Core styling props as requested
  'variant',
  'margin',
  // Layout and spacing props
  'align',
  // All margin and padding props
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingHorizontal',
  'paddingVertical',
  // Text-specific props
  'numberOfLines',
  'ellipsizeMode',
  // Essential accessibility (for compliance)
  'accessibilityLabel',
  'accessibilityHint',
  'accessibilityRole',
  'accessibilityState',
  'accessibilityActions',
  'testID',
  'aria-label',
  // Button-specific props
  'disabled',
  'loading',
  'onPress', // Standard button event handler
  // Icon prop for XAction
  'icon',
  'name', //icon name for XIcon
  // Size and circular props for XAction
  'size',
  'circular',
  // Input-specific props
  'placeholder',
  'value',
  'defaultValue',
  'autoCapitalize',
  'autoCorrect',
  'autoFocus',
  'editable',
  'keyboardType',
  'maxLength',
  'multiline',
  'secureTextEntry',
  'returnKeyType',
  'selectTextOnFocus',
  'textContentType',
  'prependIcon',
  'preAction',
]);

// Component-specific allowed props (in addition to base allowedPropsSet)
// If a component is not listed here, it will use allowedPropsSet as fallback
const componentSpecificProps = {
  XText: new Set([
    // XText-specific props can be added here
  ]),
  XAction: new Set([
    // XAction already has icon, action, size, circular, disabled, loading in base set
    'action',
    'icon',
  ]),
  XIcon: new Set([
    // XIcon already has name, size in base set
    'name',
    'color',
  ]),
  XInput: new Set([
    // XInput already has most input props in base set
    'onChangeText',
    'onBlur',
    'onFocus',
    'onSubmitEditing',
  ]),
  XTooltip: new Set([
    // XTooltip-specific props
    'content',
  ]),
  XCard: new Set([
    // XCard-specific props
    'title',
    'subtitle',
    'collapsible',
    'defaultExpanded',
    'tooltipInfo',
    'infoVariant',
    'onToggle',
  ]),
  XSwitch: new Set([
    // XSwitch-specific props
    'checked',
    'onCheckedChange',
  ]),
  // Add more component-specific props as needed
  XDropdown: new Set([
    'onValueChange',
    'options',
    'placeholder',
    'value',
    'searchable',
    'searchPlaceholder',
    'minWidth',
    'maxWidth',
    'width',
    'backgroundColor',
    'borderColor',
    'variant',
    'size',
    'disabled',
  ]),
  XDateTimePicker: new Set(['mode', 'value', 'onChange', 'minDate', 'maxDate', 'disabled']),
  // XCheckbox: new Set(['checked', 'onCheckedChange']),
};

/**
 * Get allowed props for a specific component
 * @param {string} componentName - The name of the component (e.g., 'XText', 'XAction')
 * @returns {Set} Set of allowed prop names
 */
function getAllowedPropsForComponent(componentName) {
  const baseProps = allowedPropsSet;
  const specificProps = componentSpecificProps[componentName];

  if (!specificProps) {
    // No component-specific props defined, use base set
    return baseProps;
  }

  // Merge base props with component-specific props
  return new Set([...baseProps, ...specificProps]);
}

// Custom rule to require variant prop and only allow specific attributes on X-components (excluding XStack)
const xComponentPropsRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require variant prop on all X-components (excluding XStack) and only allow specific attributes',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create: function (context) {
    return {
      JSXOpeningElement: function (node) {
        // Skip if node.name is undefined or doesn't have the expected structure
        if (!node.name) {
          return;
        }

        // Cache component name for performance
        // Handle both <XText> and <Primitives.XText> cases
        let componentName;
        if (node.name.name) {
          componentName = node.name.name;
        } else if (node.name.property && node.name.property.name) {
          componentName = node.name.property.name;
        } else if (node.name.object && node.name.object.name) {
          componentName = node.name.object.name;
        }

        // Handle styled components - check if they have a name that indicates they are X-components
        // Tamagui styled components often have a displayName or name property
        if (!componentName && node.name && node.name.type === 'Identifier') {
          // This might be a styled component, check if it starts with X
          const identifierName = node.name.name;
          if (identifierName && identifierName.startsWith('X') && identifierName !== 'XStack') {
            componentName = identifierName;
          }
        }

        // Check if this is an X-component (any component starting with X, but exclude XStack as it's a Tamagui layout component)
        // Also handle styled components like XStyledButton
        const isXComponent = componentName && ((componentName.startsWith('X') && componentName !== 'XStack') || (componentName.startsWith('XStyled') && componentName.includes('X')));

        if (isXComponent) {
          // XIcon components don't require a variant prop as they can work without it
          // XStyled* components also don't require variant as they have built-in styling
          // XDateTimePicker doesn't require variant as it uses mode prop instead
          const requiresVariant = componentName !== 'XIcon' && !componentName.startsWith('XStyled') && componentName !== 'XDateTimePicker';
          let hasVariant = false;
          const invalidProps = [];

          // Get allowed props for this specific component
          // For styled components like XStyledButton, use the base XAction props
          let allowedProps;
          if (componentName.startsWith('XStyled') && componentName.includes('XAction')) {
            allowedProps = getAllowedPropsForComponent('XAction');
          } else {
            allowedProps = getAllowedPropsForComponent(componentName);
          }

          node.attributes.forEach(attr => {
            if (attr.type === 'JSXAttribute') {
              const propName = attr.name.name;

              // Check if variant prop is present
              if (propName === 'variant') {
                hasVariant = true;
              }

              // Check if prop is allowed (O(1) Set lookup instead of O(n) array.includes())
              if (!allowedProps.has(propName)) {
                invalidProps.push(propName);
              }
            }
          });

          // Report error if variant is missing (only for components that require it)
          if (requiresVariant && !hasVariant) {
            context.report({
              node: node,
              message: `${componentName} components must use a 'variant' prop for styling.`,
            });
          }

          // Report errors for invalid props
          invalidProps.forEach(propName => {
            const invalidAttr = node.attributes.find(attr => attr.name && attr.name.name === propName);
            if (invalidAttr) {
              context.report({
                node: invalidAttr,
                message: `Prop '${propName}' is not allowed on ${componentName}. Use 'variant' for styling. Event handlers, align, margin, padding, and text props are allowed.`,
              });
            }
          });
        }
      },
    };
  },
};

module.exports = {
  xComponentPropsRule,
};
