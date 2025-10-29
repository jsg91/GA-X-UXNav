/**
 * @fileoverview Enforce single destructuring export pattern for XDBSchema entity definitions
 * @description Ensures all .xdbschema.ts files use the standardized defineAndExportXDBSchema pattern
 *
 * ## XDBSchema Export Pattern
 *
 * All .xdbschema.ts files must have exactly ONE export statement that destructures from defineAndExportXDBSchema:
 *
 * ```typescript
 * export const {
 *   schemaDefinition: entitySchemaDefinition,
 *   migrationMetadata: entityMigrationMetadata,
 *   getSchemaExports: getEntitySchemaExports,
 *   schema: entitySchema,
 *   service: entityService,
 *   hooks: entityHooks,
 *   formConfig: entityFormConfig, // optional
 *   types: {
 *     Entity: EntityType,
 *     EntityInsert: EntityInsertType,
 *     EntityUpdate: EntityUpdateType
 *   },
 * } = defineAndExportXDBSchema('Entity', { ... });
 * ```
 *
 * @author GA-X Team
 */

'use strict';

const path = require('path');

// ============================================================================
// RULE DEFINITION
// ============================================================================

module.exports = {
  'enforce-xdbschema-exports': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce single destructuring export pattern for XDBSchema entity definitions',
        category: 'Best Practices',
        recommended: true,
      },
      fixable: null,
      schema: [],
      messages: {
        multipleExports: 'XDBSchema files must have exactly one export statement',
        notDestructuringExport: 'XDBSchema files must use destructuring export from defineAndExportXDBSchema',
        notDefineAndExportXDBSchema: 'XDBSchema files must destructure from defineAndExportXDBSchema function',
        missingRequiredProperty: 'XDBSchema export missing required property: {{property}}',
        missingRequiredType: 'XDBSchema export missing required type: {{type}}',
        invalidPropertyAlias: 'XDBSchema export property "{{property}}" must be aliased appropriately',
      },
    },

    create(context) {
      const filename = context.getFilename();

      // Only apply to .xdbschema.ts files
      if (!filename.endsWith('.xdbschema.ts')) {
        return {};
      }

      // Extract entity name from filename (e.g., aircrafts.xdbschema.ts -> aircrafts)
      const entityFileName = path.basename(filename, '.xdbschema.ts');

      // State tracking
      const state = {
        exportDeclarations: [],
        hasValidDestructuringExport: false,
        destructuredProperties: new Set(),
        typeProperties: new Set(),
      };

      return {
        // Track all export declarations
        ExportNamedDeclaration(node) {
          state.exportDeclarations.push(node);

          // Check if it's a destructuring export from defineAndExportXDBSchema
          if (node.declaration &&
              node.declaration.type === 'VariableDeclaration' &&
              node.declaration.declarations.length === 1) {

            const declarator = node.declaration.declarations[0];

            // Check if it's destructuring
            if (declarator.id.type === 'ObjectPattern' &&
                declarator.init &&
                declarator.init.type === 'CallExpression' &&
                declarator.init.callee.name === 'defineAndExportXDBSchema') {

              state.hasValidDestructuringExport = true;

              // Track destructured properties
              declarator.id.properties.forEach(prop => {
                if (prop.type === 'Property') {
                  const propName = prop.key.name;

                  if (propName === 'types' && prop.value.type === 'ObjectPattern') {
                    // Handle nested types object
                    prop.value.properties.forEach(typeProp => {
                      if (typeProp.type === 'Property') {
                        state.typeProperties.add(typeProp.key.name);
                      }
                    });
                  } else {
                    state.destructuredProperties.add(propName);
                  }
                }
              });
            }
          }
        },

        // Validate at end of file
        'Program:exit'(node) {
          // Must have exactly one export
          if (state.exportDeclarations.length !== 1) {
            context.report({
              node,
              messageId: 'multipleExports',
            });
            return;
          }

          // Must be valid destructuring export
          if (!state.hasValidDestructuringExport) {
            context.report({
              node,
              messageId: 'notDestructuringExport',
            });
            return;
          }

          // Check for required properties
          const requiredProperties = [
            'schemaDefinition',
            'migrationMetadata',
            'getSchemaExports',
            'schema',
            'service',
            'hooks'
          ];

          requiredProperties.forEach(prop => {
            if (!state.destructuredProperties.has(prop)) {
              context.report({
                node,
                messageId: 'missingRequiredProperty',
                data: { property: prop },
              });
            }
          });

          // Check for required type properties
          const requiredTypes = ['Entity', 'EntityInsert', 'EntityUpdate'];
          requiredTypes.forEach(type => {
            if (!state.typeProperties.has(type)) {
              context.report({
                node,
                messageId: 'missingRequiredType',
                data: { type },
              });
            }
          });
        },
      };
    },
  },
};
