/**
 * @fileoverview Tests for enforce-xaction-links ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./enforce-xaction-links');

const ruleTester = createRuleTester();

describe('enforce-xaction-links', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'enforce-xaction-links' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in enforce-xaction-links.js');
  }

  ruleTester.run('enforce-xaction-links', ruleToTest, {
    valid: [
      {
        code: '<XAction variant="primary" onPress={() => {}}>Click</XAction>',
        filename: 'test.tsx',
      }, // XAction with onPress
      {
        code: '<XAction variant="primary" href="/page">Link</XAction>',
        filename: 'test.tsx',
      }, // XAction with href
    ],
    invalid: [
      {
        code: '<Link href="/page"><XAction variant="primary">Click</XAction></Link>',
        filename: 'test.tsx',
        errors: [
          {
            message: /Use href prop on XAction instead of wrapping with Link/,
          },
        ],
      }, // XAction wrapped in Link
    ],
  });
});
