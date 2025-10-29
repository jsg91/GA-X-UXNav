/**
 * @fileoverview Tests for no-usememo-react19 ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./no-usememo-react19');

const ruleTester = createRuleTester();

describe('no-usememo-react19', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'no-usememo-react19' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in no-usememo-react19.js');
  }

  ruleTester.run('no-usememo-react19', ruleToTest, {
    valid: [
      {
        code: 'const value = expensiveCalculation();',
        filename: 'test.tsx',
      }, // direct calculation
    ],
    invalid: [
      {
        code: 'const value = useMemo(() => expensiveCalculation(), []);',
        filename: 'test.tsx',
        errors: [
          {
            message: /useMemo is mostly unnecessary in React 19/,
          },
        ],
      }, // using useMemo
    ],
  });
});
