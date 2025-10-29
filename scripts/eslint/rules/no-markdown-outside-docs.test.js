/**
 * @fileoverview Tests for no-markdown-outside-docs ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./no-markdown-outside-docs');

const ruleTester = createRuleTester();

describe('no-markdown-outside-docs', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'no-markdown-outside-docs' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in no-markdown-outside-docs.js');
  }

  ruleTester.run('no-markdown-outside-docs', ruleToTest, {
    valid: [
      {
        code: '// Regular comment',
        filename: 'README.md',
      }, // README.md in root is allowed
      {
        code: '// Documentation',
        filename: 'docs/guide.md',
      }, // .md files in docs are allowed
      {
        code: '// Regular comment',
        filename: 'src/component.tsx',
      }, // regular code file (not .md)
    ],
    invalid: [
      {
        code: '// Documentation',
        filename: 'components/guide.md',
        errors: [
          {
            message: /Markdown files are not allowed here/,
          },
        ],
      }, // .md file outside docs
    ],
  });
});
