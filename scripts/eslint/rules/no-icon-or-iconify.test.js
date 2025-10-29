/**
 * @fileoverview Tests for no-icon-or-iconify ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./no-icon-or-iconify');

const ruleTester = createRuleTester();

describe('no-icon-or-iconify', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'no-icon-or-iconify' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in no-icon-or-iconify.js');
  }

  ruleTester.run('no-icon-or-iconify', ruleToTest, {
    valid: [
      {
        code: '<XIcon name="airplane" size={24} />',
        filename: 'test.tsx',
      }, // using XIcon
    ],
    invalid: [
      {
        code: 'import { Icon } from "@iconify/react";',
        filename: 'test.tsx',
        errors: [
          {
            message: /Do not import from '@iconify\/react'/,
          },
          {
            message: /Do not import 'Icon'/,
          },
        ],
      }, // importing Icon from iconify (triggers 2 errors: import source + specifier)
    ],
  });
});
