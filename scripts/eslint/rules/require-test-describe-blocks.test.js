/**
 * @fileoverview Tests for require-test-describe-blocks ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const { requireTestDescribeBlocksRule } = require('./require-test-describe-blocks');

const ruleTester = createRuleTester();

describe('require-test-describe-blocks', () => {
  ruleTester.run('require-test-describe-blocks', requireTestDescribeBlocksRule, {
    valid: [
      {
        code: 'describe("Component", () => { it("works", () => {}); });',
        filename: '__tests__/component.test.tsx',
      }, // test with describe
      {
        code: 'describe("Feature", () => { test("works", () => {}); });',
        filename: '__tests__/feature.test.ts',
      }, // test with describe and test()
    ],
    invalid: [
      {
        code: 'it("works", () => {});',
        filename: '__tests__/component.test.tsx',
        errors: [
          {
            message: /Test files must have at least one describe block/,
          },
        ],
      }, // test without describe
      {
        code: 'test("works", () => {});',
        filename: '__tests__/feature.test.ts',
        errors: [
          {
            message: /Test files must have at least one describe block/,
          },
        ],
      }, // test() without describe
    ],
  });
});
