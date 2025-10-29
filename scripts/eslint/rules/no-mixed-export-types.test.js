/**
 * @fileoverview Tests for no-mixed-export-types ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const ruleModule = require('./no-mixed-export-types');

const ruleTester = createRuleTester();

describe('no-mixed-export-types', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(ruleModule).find(key => key === 'noMixedExportTypesRule' || key.includes('Rule') || key === 'default');
  const ruleToTest = ruleModule[ruleKey] || ruleModule[Object.keys(ruleModule)[0]];

  if (!ruleToTest || !ruleToTest.create) {
    throw new Error('Could not find rule export in no-mixed-export-types.js');
  }

  ruleTester.run('no-mixed-export-types', ruleToTest, {
    valid: [
      {
        code: 'export const value = 1;\nexport const other = 2;',
        filename: 'test.tsx',
      }, // all named exports
      {
        code: 'export default Component;',
        filename: 'test.tsx',
      }, // default export only
    ],
    invalid: [
      {
        code: 'export type MyType = string;\nexport const Component = () => null;',
        filename: 'test.tsx',
        errors: [
          {
            message: /File contains both type definitions and function implementations/,
          },
        ],
      }, // mixed type and function exports
    ],
  });
});
