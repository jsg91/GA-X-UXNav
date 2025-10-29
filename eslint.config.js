/**
 * ESLint Configuration for GA-X Project
 *
 * 🚀 PERFORMANCE OPTIMIZATION:
 * Custom ESLint rules use shared utilities from scripts/eslint/utils/eslint-utils.js
 * for optimized operations and better maintainability.
 *
 * 📖 SHARED UTILITIES DOCUMENTATION:
 * See scripts/eslint/README.md and scripts/eslint/utils/eslint-utils.js for comprehensive
 * documentation on available utilities and performance optimizations.
 *
 * 🔧 NEW RULE DEVELOPMENT:
 * - Import shared utilities for consistent patterns
 * - Implement early returns for external imports (biggest performance gain)
 * - Use ESLintGlobalCache for configuration caching
 * - Leverage PathUtils for cross-platform compatibility
 */

// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require('eslint-config-expo/flat');
const unusedImports = require('eslint-plugin-unused-imports').default || require('eslint-plugin-unused-imports');
const reactNative = require('eslint-plugin-react-native');
const tseslint = require('typescript-eslint');
const jest = require('eslint-plugin-jest');

// Additional ESLint plugins for enhanced code quality
const jsxA11y = require('eslint-plugin-jsx-a11y');
const eslintComments = require('eslint-plugin-eslint-comments');
const promise = require('eslint-plugin-promise');
const security = require('eslint-plugin-security');

// 🎯 ULTRA-MINIMAL: Declarative ESLint Configuration
// Maximum clarity, zero repetition, AI-first maintainability

// Rule level constants for consistency and type safety
const LEVELS = { ERROR: 'error', WARN: 'warn', OFF: 'off' };

// Removed dynamic loading for better AI comprehension and knip compatibility

// Static imports for better AI comprehension and knip compatibility
const enforceImportConventionsRule = require('./scripts/eslint/rules/enforce-import-conventions')['enforce-import-conventions'];
const enforceRhfZodFormsRule = require('./scripts/eslint/rules/enforce-rhf-zod-forms').enforceRhfZodFormsRule;
const enforceXActionChildrenRule = require('./scripts/eslint/rules/enforce-xaction-children').enforceXActionChildrenRule;
const enforceXActionLinksRule = require('./scripts/eslint/rules/enforce-xaction-links').enforceXActionLinksRule;
const enforceXDBSchemaExportsRule = require('./scripts/eslint/rules/enforce-xdbschema-exports')['enforce-xdbschema-exports'];
const noColorLiteralsWithTokensRule = require('./scripts/eslint/rules/no-color-literals-tokens').noColorLiteralsWithTokensRule;
const noDeepBarrelsRule = require('./scripts/eslint/rules/no-deep-barrels')['no-deep-barrels'];
const noDeprecatedShadowPropsRule = require('./scripts/eslint/rules/no-deprecated-shadow-props').noDeprecatedShadowPropsRule;
const noIconOrIconifyRule = require('./scripts/eslint/rules/no-icon-or-iconify').noIconOrIconifyRule;
const noJsxChildrenInXActionRule = require('./scripts/eslint/rules/no-jsx-children-in-xaction').noJsxChildrenInXActionRule;
const noMarkdownOutsideDocsRule = require('./scripts/eslint/rules/no-markdown-outside-docs')['no-markdown-outside-docs'];
const noMixedExportTypesRule = require('./scripts/eslint/rules/no-mixed-export-types').noMixedExportTypesRule;
const noPointerEventsPropRule = require('./scripts/eslint/rules/no-pointer-events-prop').noPointerEventsPropRule;
const noUseMemoReact19Rule = require('./scripts/eslint/rules/no-usememo-react19').noUseMemoReact19Rule;
const noXTextInLabelRule = require('./scripts/eslint/rules/no-xtext-in-label').noXTextInLabelRule;
const noXTextInXActionRule = require('./scripts/eslint/rules/no-xtext-in-xaction').noXTextInXActionRule;
const noXTextInXTextRule = require('./scripts/eslint/rules/no-xtext-in-xtext').noXTextInXTextRule;
const requireAviationMocksRule = require('./scripts/eslint/rules/require-aviation-mocks').requireAviationMocksRule;
const requireTestDescribeBlocksRule = require('./scripts/eslint/rules/require-test-describe-blocks').requireTestDescribeBlocksRule;
const testFileNamingConventionRule = require('./scripts/eslint/rules/test-file-naming-convention').testFileNamingConventionRule;
const xComponentPropsRule = require('./scripts/eslint/rules/x-component-props').xComponentPropsRule;
const jsxPropsOrderRule = require('./scripts/eslint/rules/jsx-props-order').jsxPropsOrderRule;
const filenameNamingConventionRule = require('./scripts/eslint/rules/test-file-naming-convention').filenameNamingConventionRule;
const validateIconPropsRule = require('./scripts/eslint/rules/validate-xicon-name').validateIconPropsRule;

// Declarative rule definitions - single source of truth
const RULE_DEFINITIONS = {
  // Standard ESLint rules (defaults to 'error')
  'prefer-const': LEVELS.ERROR,
  'no-var': LEVELS.ERROR,
  'no-undef': LEVELS.ERROR,
  'unused-imports/no-unused-imports': LEVELS.ERROR,
  '@typescript-eslint/no-unused-vars': [LEVELS.ERROR, { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  '@typescript-eslint/no-explicit-any': LEVELS.ERROR,
  '@typescript-eslint/no-misused-promises': LEVELS.ERROR,
  '@typescript-eslint/no-floating-promises': LEVELS.ERROR,
  '@typescript-eslint/await-thenable': LEVELS.ERROR,
  '@typescript-eslint/naming-convention': require('./scripts/eslint/configs/naming-conventions').namingConventionRules,
  complexity: [LEVELS.ERROR, 12],

  // React ecosystem (React 19 critical)
  'react-hooks/exhaustive-deps': LEVELS.ERROR,
  'react-hooks/rules-of-hooks': LEVELS.ERROR,
  'react/jsx-no-undef': [LEVELS.ERROR, { allowGlobals: true }],
  'react-native/no-unused-styles': LEVELS.ERROR,
  'react-native/no-raw-text': [
    LEVELS.ERROR,
    {
      skip: ['XText', 'Select.Item', 'Select.Trigger', 'XAction', 'XInput', 'Button', 'Label'],
    },
  ],
  'react-native/no-single-element-style-arrays': LEVELS.ERROR,

  // Cross-platform compatibility (Expo critical)
  'no-restricted-globals': [
    LEVELS.ERROR,
    {
      name: 'localStorage',
      message: 'Use AsyncStorage instead of localStorage for cross-platform compatibility in Expo',
    },
    {
      name: 'sessionStorage',
      message: 'Use AsyncStorage instead of sessionStorage for cross-platform compatibility in Expo',
    },
    {
      name: 'document',
      message: 'document is not available in React Native. Use appropriate React Native APIs instead',
    },
    {
      name: 'notification',
      message: 'notification (Notification API) is not available in React Native. Use expo-notifications or similar library',
    },
  ],

  // Note: no-console rule is applied per-environment below (app code vs scripts)

  // Import/export validation
  'import/no-unused-modules': LEVELS.ERROR,
  'import/no-namespace': [LEVELS.ERROR, { ignore: ['@*/**'] }],
  'import/no-unresolved': LEVELS.ERROR,
  'import/export': LEVELS.ERROR,
  'import/named': LEVELS.ERROR,
  'import/default': LEVELS.ERROR,
  'import/no-duplicates': LEVELS.ERROR,
  'import/no-anonymous-default-export': LEVELS.ERROR,
  'import/no-self-import': LEVELS.ERROR,
  'import/no-cycle': LEVELS.ERROR,
  'import/no-relative-packages': LEVELS.ERROR,
  'import/no-useless-path-segments': LEVELS.ERROR,
  'import/consistent-type-specifier-style': [LEVELS.ERROR, 'prefer-top-level'],
  'no-restricted-imports': [
    LEVELS.ERROR,
    {
      patterns: [
        {
          group: ['@/ui/*', '@/ui/*/*'],
          message: 'Import from "@/ui" only, not from subdirectories',
        },
        {
          group: ['react-native'],
          importNames: ['StyleSheet'],
          message: 'Use Tamagui styling instead of React Native StyleSheet',
        },
        // 🚫 FONT IMPORTS
        {
          group: ['expo-font', '@expo-google-fonts/*'],
          message: 'Custom fonts are not allowed. GA-X uses system fonts via Tamagui defaultConfig.',
        },
        {
          group: ['**/*.ttf', '**/*.otf', '**/*.woff', '**/*.woff2', '**/*.eot'],
          message: 'Font file imports are not allowed. Use system fonts via Tamagui tokens.',
        },
      ],
      paths: [
        {
          name: 'expo-font',
          message: 'expo-font is not allowed. GA-X uses system fonts via Tamagui defaultConfig.',
        },
      ],
    },
  ],
  'no-restricted-syntax': [
    LEVELS.ERROR,
    {
      selector: 'ImportDeclaration[source.value^="@/"][specifiers.0.type="ImportNamespaceSpecifier"]',
      message: 'Wildcard imports (import *) are not allowed for internal modules. Use named imports instead.',
    },
    {
      selector: 'ImportDeclaration[source.value^="@/"][specifiers.0.type="ImportAllSpecifier"]',
      message: 'Wildcard imports (import *) are not allowed for internal modules. Use named imports instead.',
    },
    {
      selector: 'JSXElement[openingElement.name.name="TouchableOpacity"]',
      message: 'TouchableOpacity is not cross-platform compatible. Use XAction or other Tamagui cross-platform components instead.',
    },
    {
      selector: 'ImportDeclaration[source.value="react-native"]:has(ImportSpecifier[imported.name="TouchableOpacity"])',
      message: 'Importing TouchableOpacity is not allowed as it is not cross-platform compatible. Use XAction or other Tamagui cross-platform components instead.',
    },
    {
      selector: 'JSXElement[openingElement.name.name="Tooltip"]',
      message: 'Tooltip is not cross-platform compatible. Use a cross-platform tooltip solution or Tamagui Popover instead.',
    },
    {
      selector: 'ImportDeclaration:has(ImportSpecifier[imported.name="Tooltip"])',
      message: 'Importing Tooltip is not allowed as it is not cross-platform compatible. Use a cross-platform tooltip solution or Tamagui Popover instead.',
    },
    {
      selector: 'JSXElement[openingElement.name.name="Sheet"]',
      message: 'Sheet has platform-specific behaviors (native UIKit on iOS). Use Dialog or a custom cross-platform modal solution for consistent behavior.',
    },
    {
      selector: 'ImportDeclaration:has(ImportSpecifier[imported.name="Sheet"])',
      message: 'Importing Sheet is not allowed due to platform-specific behaviors. Use Dialog or a custom cross-platform modal solution instead.',
    },
    {
      selector: 'JSXElement[openingElement.name.name="Select"]',
      message: 'Select has significant UX differences between web and mobile (native picker vs custom dropdown). Use a custom cross-platform select component for consistency.',
    },
    {
      selector: 'ImportDeclaration:has(ImportSpecifier[imported.name="Select"])',
      message: 'Importing Select is not allowed due to platform inconsistencies. Use a custom cross-platform select component instead.',
    },
    // 🚫 FONT LOADING
    {
      selector: 'CallExpression[callee.name="useFonts"]',
      message: 'useFonts() is not allowed. GA-X uses system fonts via Tamagui defaultConfig for optimal performance.',
    },
    {
      selector: 'CallExpression[callee.object.name="Font"][callee.property.name="loadAsync"]',
      message: 'Font.loadAsync() is not allowed. GA-X uses system fonts via Tamagui defaultConfig for optimal performance.',
    },
    // 🚫 FONT-FAMILY (all forms)
    {
      selector: 'Property[key.name="fontFamily"][value.type="Literal"]:not([value.value=/^\\$/])',
      message: 'fontFamily with literal values is not allowed. Use Tamagui tokens ($body, $mono) or XText variants.',
    },
    {
      selector: 'Property[key.name=/^font-family$/][value.type="Literal"]',
      message: 'font-family (kebab-case) is not allowed. Use fontFamily with Tamagui tokens ($body, $mono).',
    },
    {
      selector: 'JSXAttribute[name.name="fontFamily"] > Literal:not([value=/^\\$/])',
      message: 'fontFamily prop with literal values is not allowed. Use Tamagui tokens ($body, $mono).',
    },
    {
      selector: 'JSXAttribute[name.name="fontFamily"] > JSXExpressionContainer > Literal:not([value=/^\\$/])',
      message: 'fontFamily prop with literal values is not allowed. Use Tamagui tokens ($body, $mono).',
    },
    // 🚫 FONT-SIZE (enforce XText variants or Tamagui tokens)
    {
      selector: 'Property[key.name="fontSize"][value.type="Literal"]:not([value.value=/^\\$/])',
      message: 'fontSize with literal values is not allowed outside XText definitions. Use XText variants or Tamagui tokens ($1-$10).',
    },
    {
      selector: 'Property[key.name=/^font-size$/]',
      message: 'font-size (kebab-case) is not allowed. Use fontSize with Tamagui tokens.',
    },
    {
      selector: 'JSXAttribute[name.name="fontSize"] > Literal:not([value=/^\\$/])',
      message: 'fontSize prop with literal values is not allowed. Use XText variants or Tamagui tokens ($1-$10).',
    },
    {
      selector: 'JSXAttribute[name.name="fontSize"] > JSXExpressionContainer > Literal:not([value=/^\\$/])',
      message: 'fontSize prop with literal values is not allowed. Use XText variants or Tamagui tokens ($1-$10).',
    },
    // 🚫 FONT-WEIGHT (enforce XText variants)
    {
      selector: 'Property[key.name="fontWeight"]',
      message: 'fontWeight is not allowed outside XText definitions. Use XText variants (body, bodyBold, label, etc.).',
    },
    {
      selector: 'Property[key.name=/^font-weight$/]',
      message: 'font-weight (kebab-case) is not allowed. Use XText variants.',
    },
    {
      selector: 'JSXAttribute[name.name="fontWeight"]',
      message: 'fontWeight prop is not allowed. Use XText variants (body, bodyBold, label, etc.).',
    },
    // 🚫 FONT-STYLE (enforce XText variants)
    {
      selector: 'Property[key.name="fontStyle"]',
      message: 'fontStyle is not allowed outside XText definitions. Use XText variants.',
    },
    {
      selector: 'Property[key.name=/^font-style$/]',
      message: 'font-style (kebab-case) is not allowed. Use XText variants.',
    },
    {
      selector: 'JSXAttribute[name.name="fontStyle"]',
      message: 'fontStyle prop is not allowed. Use XText variants.',
    },
  ],
  'enforce-import-conventions/enforce-import-conventions': LEVELS.ERROR,

  // Custom component rules (React 19 critical)
  'x-component-props/x-component-props': LEVELS.ERROR,
  'no-jsx-children-in-xaction/no-jsx-children-in-xaction': LEVELS.ERROR,
  'no-xtext-in-label/no-xtext-in-label': LEVELS.ERROR,
  'no-xtext-in-xtext/no-xtext-in-xtext': LEVELS.ERROR,
  'no-color-literals-tokens/no-color-literals-tokens': LEVELS.ERROR,
  'no-deprecated-shadow-props/no-deprecated-shadow-props': LEVELS.ERROR,
  'no-pointer-events-prop/no-pointer-events-prop': LEVELS.ERROR,
  'enforce-xaction-links/enforce-xaction-links': LEVELS.ERROR,
  'enforce-xaction-children/enforce-xaction-children': LEVELS.ERROR,
  'no-icon-or-iconify/no-icon-or-iconify': LEVELS.ERROR,
  'no-usememo-react19/no-usememo-react19': LEVELS.ERROR,
  'validate-xicon-name/validate-xicon-name': LEVELS.ERROR,

  // Testing rules
  'filename-naming-convention/filename-naming-convention': LEVELS.ERROR,
  'require-test-describe-blocks/require-test-describe-blocks': LEVELS.ERROR,
  'require-aviation-mocks/require-aviation-mocks': LEVELS.ERROR,
  'no-deep-barrels/no-deep-barrels': LEVELS.WARN,

  // Utility rules
  'enforce-rhf-zod-forms/enforce-rhf-zod-forms': LEVELS.ERROR,
  'enforce-xdbschema-exports/enforce-xdbschema-exports': LEVELS.ERROR,
  'jsx-props-order/jsx-props-order': LEVELS.ERROR,

  // Additional React rules (not in recommended)
  'react/jsx-curly-brace-presence': [LEVELS.ERROR, 'never'],
  'react/self-closing-comp': LEVELS.ERROR,
  'react/no-array-index-key': LEVELS.WARN,
  'react/jsx-no-script-url': LEVELS.ERROR,
  //'react-native/no-inline-styles': LEVELS.WARN, // TODO: Re-enable as soon as styling figured out for good!
};

// Static rule definitions for better AI comprehension and knip compatibility
const CUSTOM_RULES = {
  // Component validation (React 19 critical)
  'x-component-props': { rules: { 'x-component-props': xComponentPropsRule } },

  // XDBSchema export pattern enforcement
  'enforce-xdbschema-exports': { rules: { 'enforce-xdbschema-exports': enforceXDBSchemaExportsRule } },
  'no-jsx-children-in-xaction': { rules: { 'no-jsx-children-in-xaction': noJsxChildrenInXActionRule } },
  'no-xtext-in-label': { rules: { 'no-xtext-in-label': noXTextInLabelRule } },
  'no-xtext-in-xtext': { rules: { 'no-xtext-in-xtext': noXTextInXTextRule } },
  'no-color-literals-tokens': { rules: { 'no-color-literals-tokens': noColorLiteralsWithTokensRule } },
  'no-deprecated-shadow-props': { rules: { 'no-deprecated-shadow-props': noDeprecatedShadowPropsRule } },
  'no-pointer-events-prop': { rules: { 'no-pointer-events-prop': noPointerEventsPropRule } },
  'enforce-xaction-links': { rules: { 'enforce-xaction-links': enforceXActionLinksRule } },
  'enforce-xaction-children': { rules: { 'enforce-xaction-children': enforceXActionChildrenRule } },
  'no-icon-or-iconify': { rules: { 'no-icon-or-iconify': noIconOrIconifyRule } },
  'no-usememo-react19': { rules: { 'no-usememo-react19': noUseMemoReact19Rule } },
  'validate-xicon-name': { rules: { 'validate-xicon-name': validateIconPropsRule } },

  // Testing enforcement
  'filename-naming-convention': { rules: { 'filename-naming-convention': filenameNamingConventionRule } },
  'require-test-describe-blocks': { rules: { 'require-test-describe-blocks': requireTestDescribeBlocksRule } },
  'require-aviation-mocks': { rules: { 'require-aviation-mocks': requireAviationMocksRule } },
  'enforce-import-conventions': { rules: { 'enforce-import-conventions': enforceImportConventionsRule } },
  'no-deep-barrels': { rules: { 'no-deep-barrels': noDeepBarrelsRule } },

  // Utility rules
  'no-mixed-export-types': { rules: { 'no-mixed-export-types': noMixedExportTypesRule } },
  'no-markdown-outside-docs': { rules: { 'no-markdown-outside-docs': noMarkdownOutsideDocsRule } },
  'enforce-rhf-zod-forms': { rules: { 'enforce-rhf-zod-forms': enforceRhfZodFormsRule } },
  'jsx-props-order': { rules: { 'jsx-props-order': jsxPropsOrderRule } },
};

// Standard plugins (no custom logic needed)
const STANDARD_PLUGINS = {
  'unused-imports': unusedImports,
  'react-native': reactNative,
  react: require('eslint-plugin-react'),
  'jsx-a11y': jsxA11y,
  'eslint-comments': eslintComments,
  promise: promise,
  security: security,
};

// Import recommended rules from plugins
const reactRecommendedRules = require('eslint-plugin-react').configs.recommended.rules;
const jsxA11yRecommendedRules = jsxA11y.configs.recommended.rules;
const eslintCommentsRecommendedRules = eslintComments.configs.recommended.rules;
const promiseRecommendedRules = promise.configs.recommended.rules;
const securityRecommendedRules = security.configs.recommended.rules;

// Ultra-minimal configuration assembly
const ALL_RULES = {
  ...reactRecommendedRules, // Add React recommended rules first
  ...eslintCommentsRecommendedRules, // ESLint directive management (ERROR - safe)
  ...RULE_DEFINITIONS, // Override with project-specific rules

  // Disable outdated React 16.x rules for React 19
  'react/react-in-jsx-scope': LEVELS.OFF, // Not needed in React 17+
  'react/jsx-uses-react': LEVELS.OFF, // Not needed in React 17+

  // Override potentially hindering rules to WARN level for better development experience
  ...Object.fromEntries(
    Object.entries({
      ...jsxA11yRecommendedRules, // Accessibility rules (WARN for development)
      ...promiseRecommendedRules, // Promise handling (WARN for development)
      ...securityRecommendedRules, // Security rules (WARN for development)
    }).map(([key, value]) => [key, LEVELS.WARN])
  ),

  // Disable outdated promise rules (must come after promiseRecommendedRules spread)
  'promise/no-native': LEVELS.OFF, // Promise is a native JavaScript global in modern environments

  // Disable security rules with excessive false positives
  'security/detect-object-injection': LEVELS.OFF, // Generates 200+ false positives in factory patterns, checked, no need
};
const ALL_PLUGINS = { ...STANDARD_PLUGINS, ...CUSTOM_RULES };

// 🎯 MAXIMUM SIMPLICITY: Declarative configuration
module.exports = [
  // Global ignores (formatted for clarity)
  {
    ignores: [
      'dist/**/*',
      '.git/**/*',
      'assets/**/*',
      'public/**/*',
      '.tamagui/**/*',
      '.expo/**/*',
      'node_modules/**/*',
      'eslint.config.js',
      '.vscode/**/*',
      '.cursor/**/*',
      'coverage/**/*',
      'supabase/**/*',
      'temp/**/*',
      'lint.txt',
      '*.log',
    ],
  },
  ...expoConfig,

  // Main TypeScript/React configuration (React 19/Expo optimized)
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['scripts/**/*', 'lib/infrastructure/logger.ts'], // Scripts and logger can use console
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: true, tsconfigRootDir: process.cwd() },
      globals: { 
        XText: 'readonly', 
        XAction: 'readonly', 
        XInput: 'readonly', 
        XIcon: 'readonly', 
        Label: 'readonly',
        Promise: 'readonly',
      },
    },
    plugins: ALL_PLUGINS,
    rules: {
      ...ALL_RULES,
      'no-console': [LEVELS.ERROR, { allow: ['warn', 'error'] }], // Use @/lib/infrastructure/logger for structured logging
    },
  },

  // Special overrides (minimal and declarative)
  {
    files: ['components/common/utilities/ErrorBoundary.tsx', 'contexts/AuthContext.tsx'],
    rules: {
      'react-native/no-raw-text': LEVELS.OFF,
      'x-component-props/x-component-props': LEVELS.OFF,
      'no-color-literals-tokens/no-color-literals-tokens': LEVELS.OFF,
    },
  },

  // Theme constants file - ONLY place allowed to use color literals
  {
    files: ['constants/ui/themeConstants.ts'],
    rules: {
      'no-color-literals-tokens/no-color-literals-tokens': LEVELS.OFF,
    },
  },

  // Test files (relaxed rules for testing)
  {
    files: ['**/__tests__/**/*', '**/*.test.*', '**/test-utils.*', 'setupTests.*'],
    languageOptions: {
      globals: {
        Promise: 'readonly',
      },
    },
    rules: {
      'no-restricted-globals': LEVELS.OFF,
      'react-native/no-raw-text': LEVELS.OFF,
      '@typescript-eslint/no-explicit-any': LEVELS.OFF,
      'enforce-rhf-zod-forms/enforce-rhf-zod-forms': LEVELS.OFF,
      '@typescript-eslint/no-require-imports': LEVELS.OFF,
      '@typescript-eslint/no-unused-vars': LEVELS.OFF,
      'react/display-name': LEVELS.OFF,
      'jest/no-identical-title': LEVELS.OFF,
      'no-undef': LEVELS.OFF,
      'react/jsx-no-undef': LEVELS.OFF,
      'jest/no-export': LEVELS.OFF,
    },
  },

  // Jest test files (test-specific rules)
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    plugins: { jest },
    languageOptions: { 
      globals: { 
        ...jest.environments.globals.globals,
        Promise: 'readonly',
      },
    },
    settings: {
      jest: {
        version: 30, // Using @jest/globals v30.2.0
      },
    },
    rules: {
      ...jest.configs.recommended.rules,
      'require-test-describe-blocks/require-test-describe-blocks': LEVELS.ERROR,
      'filename-naming-convention/filename-naming-convention': LEVELS.ERROR,
      'require-aviation-mocks/require-aviation-mocks': LEVELS.WARN,
      'jest/no-disabled-tests': LEVELS.WARN,
      'jest/no-focused-tests': LEVELS.ERROR,
      'jest/no-identical-title': LEVELS.ERROR,
      'jest/prefer-to-have-length': LEVELS.WARN,
      'jest/valid-expect': LEVELS.ERROR,
    },
  },

  // XText component - only place allowed to define font properties
  {
    files: ['components/common/ui/primitives/XText.tsx'],
    rules: {
      'no-restricted-syntax': LEVELS.OFF,
    },
  },

  // Special file formats (declarative parsers)
  {
    files: ['**/*.md'],
    languageOptions: {
      parser: {
        meta: {
          name: 'markdown-parser',
          version: '1.0.0',
        },
        parseForESLint(text) {
          return {
            ast: {
              type: 'Program',
              body: [],
              sourceType: 'module',
              start: 0,
              end: text.length,
              range: [0, text.length],
              tokens: [],
              comments: [],
              loc: { start: { line: 1, column: 0 }, end: { line: 1, column: text.length } },
            },
            scopeManager: null,
            services: {},
            visitorKeys: {},
          };
        },
      },
    },
    plugins: { 'no-markdown-outside-docs': CUSTOM_RULES['no-markdown-outside-docs'] },
    rules: { 'no-markdown-outside-docs/no-markdown-outside-docs': LEVELS.ERROR },
  },
];
