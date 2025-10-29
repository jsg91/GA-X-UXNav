/**
 * @fileoverview Tests for no-deprecated-shadow-props ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./no-deprecated-shadow-props');

const ruleTester = createRuleTester();

describe('no-deprecated-shadow-props', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'no-deprecated-shadow-props' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in no-deprecated-shadow-props.js');
  }

  ruleTester.run('no-deprecated-shadow-props', ruleToTest, {
    valid: [
      {
        code: '<View style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />',
        filename: 'test.tsx',
      }, // using boxShadow (recommended)
      {
        code: '<View backgroundColor="$primary" />',
        filename: 'test.tsx',
      }, // non-shadow prop
    ],
    invalid: [
      {
        code: "const styles = { container: { shadowOffset: { width: 0, height: 2 }, backgroundColor: 'white' } };",
        filename: 'test.tsx',
        errors: [
          {
            message: /Deprecated shadow prop 'shadowOffset'/,
          },
        ],
      }, // using shadowOffset in style object
    ],
  });
});
