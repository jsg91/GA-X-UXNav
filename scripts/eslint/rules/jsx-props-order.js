/**
 * @fileoverview Enforce consistent JSX prop ordering (following common JSX conventions)
 * @author GA-X Team
 */

'use strict';

// Helper function to check if a prop name is an event handler
function isEventHandler(propName) {
  return /^on[A-Z]/.test(propName);
}

// Custom rule for JSX prop ordering
const jsxPropsOrderRule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent JSX prop ordering (key/ref first, then layout/handlers, then component-specific, then alphabetical)',
      category: 'Stylistic Issues',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    return {
      JSXOpeningElement: function (node) {
        // Handle both simple component names (<div>) and complex names (<Select.ScrollDownButton>)
        let componentName;
        if (node.name?.name) {
          componentName = node.name.name;
        } else if (node.name?.property?.name) {
          componentName = node.name.property.name;
        } else if (node.name?.object?.name) {
          componentName = node.name.object.name;
        }

        // 🚀 Performance: Early return if no component name
        if (!componentName) {
          return;
        }

        const attributes = node.attributes;

        // 🚀 Performance: Early return if no attributes or only one attribute
        if (!attributes || attributes.length <= 1) {
          return;
        }

        // Extract JSX attributes (not spread attributes)
        const jsxAttributes = attributes.filter(attr => attr.type === 'JSXAttribute' && attr.name?.name);

        // 🚀 Performance: Early return if no sortable JSX attributes
        if (jsxAttributes.length <= 1) {
          return;
        }

        // Get the props we care about for ordering (component-specific)
        const propNames = jsxAttributes.map(attr => attr.name.name);

        // Universal JSX prop ordering (following common conventions)
        // 1. React reserved props (key, ref)
        // 2. Layout/styling props (style, className)
        // 3. Event handlers (on*)
        // 4. Common props (children, id, name, value)
        // 5. Component-specific props (variant, action, size for X components)
        // 6. Other props alphabetically

        const reactReserved = ['key', 'ref'];
        const layoutProps = ['variant', 'style', 'className'];
        const commonProps = ['children', 'id', 'name', 'value', 'defaultValue', 'placeholder', 'disabled', 'required'];
        const eventHandlers = jsxAttributes.filter(attr => isEventHandler(attr.name.name)).map(attr => attr.name.name);

        // Component-specific props (only for X components)
        let componentSpecificProps = [];
        if (componentName.startsWith('X')) {
          if (componentName === 'XAction') {
            componentSpecificProps = ['variant', 'icon', 'action', 'size'];
          } else if (componentName === 'XText' || componentName === 'XInput') {
            componentSpecificProps = ['variant'];
          } else if (componentName === 'XIcon') {
            componentSpecificProps = ['name', 'color', 'size'];
          } else if (componentName === 'XDropdown') {
            componentSpecificProps = ['options', 'searchable', 'searchPlaceholder', 'minWidth', 'maxWidth', 'width', 'backgroundColor', 'borderColor', 'size'];
          }
        }

        // Create ordered list of desired props in priority order
        // Only include props that are actually present on the component
        const availableProps = [
          ...reactReserved.filter(prop => propNames.includes(prop)),
          ...layoutProps.filter(prop => propNames.includes(prop)),
          ...eventHandlers.sort(), // Event handlers are already filtered to only include those present
          ...commonProps.filter(prop => propNames.includes(prop)),
          ...(componentName.startsWith('X') ? componentSpecificProps.filter(prop => propNames.includes(prop)) : []),
        ];

        const finalDesiredProps = availableProps.filter((prop, index, arr) => arr.indexOf(prop) === index); // Remove duplicates

        // Check if this component has any of the props we want to order
        const hasRelevantProps = finalDesiredProps.some(prop => propNames.includes(prop)) || (finalDesiredProps.length === 0 && jsxAttributes.length > 1);

        if (!hasRelevantProps) {
          return; // No relevant props to order
        }

        // Build current prop order map for O(1) lookups
        const currentOrder = {};
        jsxAttributes.forEach((attr, index) => {
          currentOrder[attr.name.name] = index;
        });

        // Check if props are in the correct order
        let hasOrderingIssue = false;

        if (finalDesiredProps.length > 0) {
          // Check that desired props come in the correct priority order
          let lastDesiredIndex = -1;

          for (const prop of finalDesiredProps) {
            if (currentOrder[prop] !== undefined) {
              if (currentOrder[prop] < lastDesiredIndex) {
                hasOrderingIssue = true;
                break;
              }
              lastDesiredIndex = currentOrder[prop];
            }
          }

          // If desired props are correctly ordered, check alphabetical order for remaining props
          if (!hasOrderingIssue) {
            const remainingProps = jsxAttributes.filter(attr => !finalDesiredProps.includes(attr.name.name)).sort((a, b) => a.name.name.localeCompare(b.name.name));

            // Check if remaining props are in alphabetical order
            for (let i = 0; i < remainingProps.length - 1; i++) {
              const currentIndex = currentOrder[remainingProps[i].name.name];
              const nextIndex = currentOrder[remainingProps[i + 1].name.name];

              if (currentIndex > nextIndex) {
                hasOrderingIssue = true;
                break;
              }
            }
          }
        } else {
          // For components without specific ordering rules, check alphabetical ordering of all props
          const sortedProps = [...jsxAttributes].sort((a, b) => a.name.name.localeCompare(b.name.name));

          // Check if current order matches sorted order
          for (let i = 0; i < jsxAttributes.length; i++) {
            const currentAttr = jsxAttributes[i];
            const sortedAttr = sortedProps[i];

            if (currentAttr.name.name !== sortedAttr.name.name) {
              hasOrderingIssue = true;
              break;
            }
          }
        }

        if (hasOrderingIssue) {
          const message = `Props in ${componentName} should be ordered: key/ref/layout/handlers first, then component-specific props, then alphabetical`;

          context.report({
            node,
            message,
            fix: function (fixer) {
              // Generate correctly ordered attributes
              const sortedAttributes = [];

              // Add desired props in priority order (if they exist)
              finalDesiredProps.forEach(prop => {
                const attr = jsxAttributes.find(a => a.name.name === prop);
                if (attr) sortedAttributes.push(attr);
              });

              // Add remaining props in alphabetical order
              const remainingProps = jsxAttributes.filter(attr => !finalDesiredProps.includes(attr.name.name)).sort((a, b) => a.name.name.localeCompare(b.name.name));

              sortedAttributes.push(...remainingProps);

              // Generate fix replacements
              const fixes = [];
              sortedAttributes.forEach((attr, index) => {
                if (index < jsxAttributes.length) {
                  const originalAttr = jsxAttributes[index];
                  if (originalAttr !== attr) {
                    // Replace the attribute at this position
                    fixes.push(fixer.replaceText(originalAttr, context.getSourceCode().getText(attr)));
                  }
                }
              });

              return fixes;
            },
          });
        }
      },
    };
  },
};

module.exports = { jsxPropsOrderRule };
