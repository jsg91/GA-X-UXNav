/**
 * @fileoverview Tests for require-aviation-mocks ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./require-aviation-mocks');

const ruleTester = createRuleTester();

describe('require-aviation-mocks', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'require-aviation-mocks' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in require-aviation-mocks.js');
  }

  ruleTester.run('require-aviation-mocks', ruleToTest, {
    valid: [
      {
        code: 'import { createMockAircraft } from "@/lib/testing";',
        filename: '__tests__/test.tsx',
      }, // using aviation mocks
    ],
    invalid: [
      {
        code: 'const aircraft = { id: 1 };',
        filename: '__tests__/test.tsx',
        errors: [
          {
            message: /Use createMockData instead of creating manual mock data/,
          },
        ],
      }, // manual mock data
    ],
  });
});
