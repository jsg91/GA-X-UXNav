/**
 * @fileoverview Tests for no-color-literals-tokens ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./no-color-literals-tokens');

const ruleTester = createRuleTester();

describe('no-color-literals-tokens', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'no-color-literals-tokens' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in no-color-literals-tokens.js');
  }

  ruleTester.run('no-color-literals-tokens', ruleToTest, {
    valid: [
      {
        code: '<View style={{ color: "$primary" }} />',
        filename: 'test.tsx',
      }, // Tamagui color token
      {
        code: '<View style={{ backgroundColor: "transparent" }} />',
        filename: 'test.tsx',
      }, // transparent is allowed
      {
        code: '<View style={{ color: "$content" }} />',
        filename: 'test.tsx',
      }, // semantic color token
    ],
    invalid: [
      {
        code: '<View style={{ color: "#FF0000" }} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Color literal "#FF0000" is not allowed/,
          },
        ],
      }, // hex color literal
      {
        code: '<View style={{ backgroundColor: "white" }} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Color literal "white" is not allowed/,
          },
        ],
      }, // named color literal
    ],
  });
});
