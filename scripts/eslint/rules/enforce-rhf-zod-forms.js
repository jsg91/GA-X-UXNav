// Pre-compute patterns at module level for better performance
const oldFormComponents = new Set(['ConfigurableFormModal', 'useFormValidation', 'FormComponents']);
const rhfComponents = new Set(['FormModal', 'useFormManager', 'useZodForm', 'useSimpleForm']);
const validationFields = new Set(['required', 'minLength', 'maxLength', 'pattern']);

// Custom rule to enforce React Hook Form + Zod usage for forms
const enforceRhfZodFormsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce React Hook Form + Zod for form implementations',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create: function (context) {
    // Track imports per file for efficient checking
    const fileImports = {
      hasRhfImport: false,
      hasOldFormImport: false,
      hasValidationObject: false,
    };

    return {
      // Check for imports of old form components (fast O(1) Set lookups)
      ImportDeclaration: function (node) {
        if (node.source && node.source.value) {
          // Check if importing old form components
          if (oldFormComponents.has(node.source.value) || node.specifiers.some(spec => spec.imported?.name && oldFormComponents.has(spec.imported.name))) {
            fileImports.hasOldFormImport = true;
          }

          // Check if importing RHF components
          if (rhfComponents.has(node.source.value) || node.specifiers.some(spec => spec.imported?.name && rhfComponents.has(spec.imported.name))) {
            fileImports.hasRhfImport = true;
          }
        }
      },

      // Check for usage of old form patterns in JSX
      JSXElement: function (node) {
        if (node.openingElement?.name?.name === 'ConfigurableFormModal') {
          context.report({
            node: node,
            message: 'Use FormModal with Zod schema instead of ConfigurableFormModal',
          });
        }
      },

      // Check for form-related files that should use RHF + Zod (optimized)
      Program: function (node) {
        const filename = context.getFilename().toLowerCase();
        const hasFormInName = filename.includes('form') || filename.includes('modal');

        if (hasFormInName && fileImports.hasOldFormImport && !fileImports.hasRhfImport) {
          context.report({
            node: node,
            message: 'Form files should use React Hook Form + Zod. Import from @/components/common/ui/forms',
          });
        }
      },

      // Check for validation object patterns that should use Zod (O(1) Set lookups)
      Property: function (node) {
        if (node.key?.name === 'validation' && node.parent?.type === 'ObjectExpression') {
          const hasValidationFields = node.value.properties?.some(prop => prop.key?.name && validationFields.has(prop.key.name));

          if (hasValidationFields) {
            context.report({
              node: node,
              message: 'Consider using Zod schema validation instead of validation objects. See lib/utils/validation.ts',
            });
          }
        }
      },
    };
  },
};

module.exports = {
  enforceRhfZodFormsRule,
};
