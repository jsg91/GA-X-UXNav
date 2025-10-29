/**
 * @fileoverview Tests for enforce-xaction-children ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./enforce-xaction-children');

const ruleTester = createRuleTester();

describe('enforce-xaction-children', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'enforce-xaction-children' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in enforce-xaction-children.js');
  }

  ruleTester.run('enforce-xaction-children', ruleToTest, {
    valid: [
      {
        code: '<XAction variant="primary">Text content</XAction>',
        filename: 'test.tsx',
      }, // text content
      {
        code: '<XAction variant="primary"><XIcon name="check" /></XAction>',
        filename: 'test.tsx',
      }, // XIcon child
    ],
    invalid: [
      {
        code: '<XAction variant="primary" />',
        filename: 'test.tsx',
        errors: [
          {
            message: /XAction must have children/,
          },
        ],
      }, // empty XAction
    ],
  });
});
