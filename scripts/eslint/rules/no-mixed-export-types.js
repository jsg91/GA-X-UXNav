/**
 * @fileoverview Enforce separation of type definitions from function implementations
 * @description Files should contain either type definitions (interfaces, types) OR function implementations, but not both
 *
 * Export Type Standards:
 * - Components: Use default exports (export default function ComponentName)
 * - Utilities: Use named exports (export { utilityFunction, utilityConstant })
 * - Types: Use named exports (export type { ComponentProps, UtilityType })
 * - Constants: Use named exports (export { CONSTANT_VALUE, CONFIG_OBJECT })
 * - No mixing export types in the same file
 *
 * File Organization Philosophy:
 * - Implementation files: Default exports for main functionality
 * - Type files: Named exports for type definitions (.types.ts)
 * - Utility files: Named exports for reusable functions/constants
 * - Consistent export patterns improve tree-shaking and maintainability
 *
 * @author GA-X Team
 */

'use strict';

// Module-level constants for better performance
const componentTypePatterns = [
  /Props$/, // ComponentNameProps
  /Variant$/, // ComponentVariant
  /Size$/, // ComponentSize
  /Style$/, // ComponentStyle
  /Color$/, // ComponentColor
  /Theme$/, // ComponentTheme
  /State$/, // ComponentState
  /Config$/, // ComponentConfig (for component configuration)
  /Data$/, // ComponentData
  /Item$/, // ComponentItem (for list items)
  /View$/, // ComponentView (for different view modes)
  /Mode$/, // ComponentMode
];

const componentFilePatterns = ['Component', 'Button', 'Text', 'Input', 'Modal', 'Card', 'Icon', 'Badge', 'Select', 'Form', 'List', 'Tile'];

/**
 * Check if an export declaration contains type definitions
 */
function isTypeExport(node) {
  if (!node.declaration) return false;

  // Direct type/interface declarations
  if (node.declaration.type === 'TSTypeAliasDeclaration') return true;
  if (node.declaration.type === 'TSInterfaceDeclaration') return true;
  if (node.declaration.type === 'TSEnumDeclaration') return true;

  // Export type { ... } syntax
  if (node.exportKind === 'type') return true;

  return false;
}

/**
 * Check if an export declaration contains function implementations
 */
function isFunctionExport(node) {
  if (!node.declaration) return false;

  // Function declarations
  if (node.declaration.type === 'FunctionDeclaration') return true;

  // Variable declarations that contain functions
  if (node.declaration.type === 'VariableDeclaration') {
    return node.declaration.declarations.some(decl => {
      if (!decl.init) return false;

      // Function expressions or arrow functions
      if (decl.init.type === 'FunctionExpression' || decl.init.type === 'ArrowFunctionExpression') {
        return true;
      }

      // Styled components (CallExpression with styled function)
      if (decl.init.type === 'CallExpression') {
        // Check for styled() calls or createContext calls
        const callee = decl.init.callee;

        // Direct styled call: styled(Component, {...})
        if (callee?.name === 'styled') return true;

        // Indirect styled call: (styled as styledFunc)(Component, {...})
        if (callee?.type === 'CallExpression' && callee.callee?.name === 'styled') return true;

        // createContext calls
        if (callee?.name === 'createContext') return true;

        // React.forwardRef calls (for components created with forwardRef)
        if (callee?.property?.name === 'forwardRef') {
          return true;
        }

        return false;
      }

      return false;
    });
  }

  // Class declarations (considered implementations)
  if (node.declaration.type === 'ClassDeclaration') return true;

  return false;
}

// Cache for expensive computations
const componentFileCache = new Map();

/**
 * Check if mixed exports are acceptable (component + component-related types)
 * or problematic (component + unrelated business types) - optimized version
 */
function areTypesComponentRelated(exports, filename) {
  const typeExports = exports.filter(e => e.isType);
  const functionExports = exports.filter(e => e.isFunction);

  // If no functions, this shouldn't be called
  if (functionExports.length === 0) return true;

  // Check if this looks like a component file (with caching)
  const fileCacheKey = `component:${filename}`;
  if (componentFileCache.has(fileCacheKey)) {
    const isComponentFile = componentFileCache.get(fileCacheKey);
    if (!isComponentFile) return false;
  } else {
    const isComponentFile = functionExports.some(func => {
      // For VariableDeclaration (styled components), the name is in declarations[0].id.name
      const funcName = func.nodeId || func.declaration?.id?.name || func.declaration?.declarations?.[0]?.id?.name || '';

      // Look for React component patterns
      return (
        funcName.match(/^[A-Z][a-zA-Z]*$/) || // PascalCase component (XText, Button, etc.)
        funcName.match(/^[A-Z]/) || // Any PascalCase name (React components)
        componentFilePatterns.some(pattern => filename.includes(pattern))
      );
    });

    componentFileCache.set(fileCacheKey, isComponentFile);
    if (!isComponentFile) return false;
  }

  // Check if ALL types are component-related (with caching)
  return typeExports.every(typeExport => {
    // Extract type name from the stored nodeId or declaration
    const typeName = typeExport.nodeId || typeExport.declaration?.id?.name || '';

    // Check if the type name matches component-related patterns
    return componentTypePatterns.some(pattern => pattern.test(typeName));
  });
}

// Custom ESLint rule to enforce separation of type definitions from function implementations
const noMixedExportTypesRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce separation of type definitions from function implementations',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      mixedExports: 'File contains both type definitions and function implementations. Move types to a PascalCase.types.ts file in /lib/types and functions to implementation file.',
      typeExport: 'File contains type definitions. Move to a PascalCase.types.ts file in /lib/types (e.g., AircraftRow.types.ts).',
      functionExport: 'File contains function implementations. Move to implementation file.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowInServiceFiles: {
            type: 'boolean',
            default: false,
          },
          allowInHookFiles: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const exports = [];
    const filename = context.getFilename();

    // Skip barrel files (index.ts)
    if (filename.endsWith('/index.ts') || filename.includes('/index.ts')) {
      return {};
    }

    return {
      ExportNamedDeclaration(node) {
        const exportInfo = {
          // Don't store the full node to avoid circular references
          // Store only what we need for checking
          nodeId: node.declaration?.id?.name || node.declaration?.declarations?.[0]?.id?.name,
          isType: isTypeExport(node),
          isFunction: isFunctionExport(node),
          loc: node.loc,
          // Store minimal node info needed for type checking
          declaration: node.declaration
            ? {
                type: node.declaration.type,
                id: node.declaration.id ? { name: node.declaration.id.name } : null,
                declarations: node.declaration.declarations
                  ? node.declaration.declarations.map(d => ({
                      id: d.id ? { name: d.id.name } : null,
                    }))
                  : null,
              }
            : null,
        };

        if (exportInfo.isType || exportInfo.isFunction) {
          exports.push(exportInfo);
        }
      },

      ExportDefaultDeclaration(node) {
        const declaration = node.declaration;

        // Check if it's a function declaration or arrow function
        const isFunction =
          declaration?.type === 'FunctionDeclaration' ||
          (declaration?.type === 'ArrowFunctionExpression' && declaration.body?.type !== 'ObjectExpression') ||
          // Check for identifier that might be a React component (PascalCase)
          (declaration?.type === 'Identifier' && /^[A-Z][a-zA-Z]*$/.test(declaration.name));

        const exportInfo = {
          isFunction,
          loc: node.loc,
        };

        if (exportInfo.isFunction) {
          exports.push(exportInfo);
        }
      },

      'Program:exit'() {
        if (exports.length === 0) return;

        const hasTypes = exports.some(e => e.isType);
        const hasFunctions = exports.some(e => e.isFunction);

        // Check for mixed exports
        if (hasTypes && hasFunctions) {
          // Enhanced logic: Check if types are component-related (acceptable) or business types (problematic)
          const isAcceptableMixed = areTypesComponentRelated(exports, filename);

          if (!isAcceptableMixed) {
            context.report({
              loc: exports[0].loc,
              messageId: 'mixedExports',
            });
            return;
          }
          // If acceptable mixed exports, allow them
          return;
        }

        // Check if file should only contain types
        if (hasTypes && !hasFunctions) {
          // Type-only files should use .types.ts suffix
          const isInTypesDirectory = filename.includes('/types/') || filename.includes('\\types\\');
          const hasTypesSuffix = filename.endsWith('.types.ts') || filename.endsWith('.types.tsx');

          // Exception: database entity files in lib/types/database/entities/ can use plain .ts
          const isDatabaseEntity = isInTypesDirectory && (filename.includes('/database/entities/') || filename.includes('\\database\\entities\\'));

          if (!hasTypesSuffix && !isDatabaseEntity) {
            context.report({
              loc: exports[0].loc,
              messageId: 'typeExport',
            });
          }
          return;
        }

        // Check if file should only contain functions
        if (hasFunctions && !hasTypes) {
          // Allow function-only files, but ensure they're not in types directories
          const isInTypesDirectory = filename.includes('/types/') || filename.includes('\\types\\');
          if (isInTypesDirectory && !filename.endsWith('.ts') && !filename.endsWith('.tsx')) {
            context.report({
              loc: exports[0].loc,
              messageId: 'functionExport',
            });
          }
          return;
        }
      },
    };
  },
};

module.exports = {
  noMixedExportTypesRule,
};
