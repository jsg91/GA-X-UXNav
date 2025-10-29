/**
 * @fileoverview Tests for no-pointer-events-prop ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./no-pointer-events-prop');

const ruleTester = createRuleTester();

describe('no-pointer-events-prop', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'no-pointer-events-prop' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in no-pointer-events-prop.js');
  }

  ruleTester.run('no-pointer-events-prop', ruleToTest, {
    valid: [
      {
        code: '<View accessible={true} />',
        filename: 'test.tsx',
      }, // no pointerEvents prop
    ],
    invalid: [
      {
        code: '<View pointerEvents="none" />',
        filename: 'test.tsx',
        errors: [
          {
            message: /pointerEvents should be specified in the style prop/,
          },
        ],
      }, // using pointerEvents
    ],
  });
});
