/**
 * @fileoverview Shared ESLint RuleTester configuration for ESLint v9 flat config
 * @description Provides a consistent test configuration for all custom rule tests
 */

const { RuleTester } = require('eslint');

// ESLint v9 flat config format for RuleTester
const ruleTesterConfig = {
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2021,
      sourceType: 'module',
    },
  },
};

// Special configuration for JSON files (package.json)
const jsonRuleTesterConfig = {
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    parser: require('espree'), // Use espree for JSON parsing
    parserOptions: {
      ecmaFeatures: {
        jsx: false,
      },
      ecmaVersion: 2021,
      sourceType: 'module',
      // Allow more permissive parsing
      allowReserved: true,
      allowImportExportEverywhere: true,
    },
  },
  rules: {
    // Disable rules that would conflict with JSON parsing
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-redeclare': 'off',
    'no-console': 'off',
  },
};

// Create a configured RuleTester instance
function createRuleTester() {
  return new RuleTester(ruleTesterConfig);
}

// Create a JSON-specific RuleTester instance
function createJSONRuleTester() {
  return new RuleTester(jsonRuleTesterConfig);
}

module.exports = {
  ruleTesterConfig,
  jsonRuleTesterConfig,
  createRuleTester,
  createJSONRuleTester,
};
