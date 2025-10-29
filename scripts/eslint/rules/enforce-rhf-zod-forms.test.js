/**
 * @fileoverview Tests for enforce-rhf-zod-forms ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./enforce-rhf-zod-forms');

const ruleTester = createRuleTester();

describe('enforce-rhf-zod-forms', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'enforce-rhf-zod-forms' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in enforce-rhf-zod-forms.js');
  }

  ruleTester.run('enforce-rhf-zod-forms', ruleToTest, {
    valid: [
      {
        code: 'import { FormModal } from "@/components/common/ui/forms";\nconst MyForm = () => <FormModal />;',
        filename: 'test.tsx',
      }, // using FormModal
      {
        code: 'import { useZodForm } from "@/hooks/forms";\nconst form = useZodForm();',
        filename: 'test.tsx',
      }, // using useZodForm
    ],
    invalid: [
      {
        code: 'const MyForm = () => <ConfigurableFormModal />;',
        filename: 'test.tsx',
        errors: [
          {
            message: /Use FormModal with Zod schema instead of ConfigurableFormModal/,
          },
        ],
      }, // using deprecated ConfigurableFormModal
    ],
  });
});
