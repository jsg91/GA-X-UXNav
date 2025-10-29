/**
 * @fileoverview Tests for no-xtext-in-xtext ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./no-xtext-in-xtext');

const ruleTester = createRuleTester();

describe('no-xtext-in-xtext', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'no-xtext-in-xtext' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in no-xtext-in-xtext.js');
  }

  ruleTester.run('no-xtext-in-xtext', ruleToTest, {
    valid: [
      {
        code: '<XText variant="body">Plain text</XText>',
        filename: 'test.tsx',
      }, // plain text content
      {
        code: '<XText variant="body"><View><span>Nested</span></View></XText>',
        filename: 'test.tsx',
      }, // span nested in View (not XText)
    ],
    invalid: [
      {
        code: '<XText variant="body"><XText>Nested</XText></XText>',
        filename: 'test.tsx',
        errors: [
          {
            message: /XText elements are not allowed as direct children of other text components/,
          },
        ],
      }, // direct XText nesting
    ],
  });
});
