/**
 * @fileoverview Tests for no-xtext-in-label ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./no-xtext-in-label');

const ruleTester = createRuleTester();

describe('no-xtext-in-label', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'no-xtext-in-label' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in no-xtext-in-label.js');
  }

  ruleTester.run('no-xtext-in-label', ruleToTest, {
    valid: [
      {
        code: '<label>Plain text</label>',
        filename: 'test.tsx',
      }, // plain text in label
      {
        code: '<label><span>Text</span></label>',
        filename: 'test.tsx',
      }, // HTML element in label
    ],
    invalid: [
      {
        code: '<label><XText>Label</XText></label>',
        filename: 'test.tsx',
        errors: [
          {
            message: /XText elements are not allowed as direct children of/,
          },
        ],
      }, // XText inside label
    ],
  });
});
