/**
 * @fileoverview Tests for x-component-props ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./x-component-props');

const ruleTester = createRuleTester();

describe('x-component-props', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'x-component-props' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in x-component-props.js');
  }

  ruleTester.run('x-component-props', ruleToTest, {
    valid: [
      {
        code: '<XText variant="body">Text</XText>',
        filename: 'test.tsx',
      }, // XText with variant
      {
        code: '<XAction variant="primary">Click</XAction>',
        filename: 'test.tsx',
      }, // XAction with variant
    ],
    invalid: [
      {
        code: '<XText style={{ color: "red" }}>Text</XText>',
        filename: 'test.tsx',
        errors: [
          {
            message: /Prop 'style' is not allowed on XText/,
          },
        ],
      }, // XText with style instead of variant
    ],
  });
});
