/**
 * @fileoverview Tests for no-jsx-children-in-xaction ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./no-jsx-children-in-xaction');

const ruleTester = createRuleTester();

describe('no-jsx-children-in-xaction', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'no-jsx-children-in-xaction' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in no-jsx-children-in-xaction.js');
  }

  ruleTester.run('no-jsx-children-in-xaction', ruleToTest, {
    valid: [
      {
        code: '<XAction variant="primary">Click Me</XAction>',
        filename: 'test.tsx',
      }, // text content only
      {
        code: '<XAction variant="primary">{variable}</XAction>',
        filename: 'test.tsx',
      }, // expression content
    ],
    invalid: [
      {
        code: '<XAction variant="primary"><XText>Click</XText></XAction>',
        filename: 'test.tsx',
        errors: [
          {
            message: /XText elements are not allowed as direct children of XAction/,
          },
        ],
      }, // XText as direct child of XAction
      {
        code: '<XAction variant="primary"><YStack><XText>Text</XText></YStack></XAction>',
        filename: 'test.tsx',
        errors: [
          {
            message: /YStack elements are not allowed as direct children of XAction/,
          },
        ],
      }, // YStack as direct child of XAction
      {
        code: '<XAction variant="primary"><XStack><XText>Text</XText></XStack></XAction>',
        filename: 'test.tsx',
        errors: [
          {
            message: /XStack elements are not allowed as direct children of XAction/,
          },
        ],
      }, // XStack as direct child of XAction
      {
        code: '<XAction variant="primary"><XIcon name="home" /></XAction>',
        filename: 'test.tsx',
        errors: [
          {
            message: /XIcon elements are not allowed as direct children of XAction/,
          },
        ],
      }, // XIcon as direct child of XAction
      {
        code: '<XAction variant="primary"><View><Text>Text</Text></View></XAction>',
        filename: 'test.tsx',
        errors: [
          {
            message: /View elements are not allowed as direct children of XAction/,
          },
        ],
      }, // Any JSX element as direct child of XAction
    ],
  });
});
