/**
 * @fileoverview Tests for no-deep-barrels ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./no-deep-barrels');

const ruleTester = createRuleTester();

describe('no-deep-barrels', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'no-deep-barrels' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in no-deep-barrels.js');
  }

  ruleTester.run('no-deep-barrels', ruleToTest, {
    valid: [
      {
        code: 'export { Component } from "./Component";',
        filename: 'test.tsx',
      }, // direct export (not a barrel file)
      {
        code: 'export { Component } from "./forms/fields/Component";',
        filename: 'components/common/ui/index.ts', // legitimate barrel file export
      },
      {
        code: 'export { Component } from "./layout/lists/Component";',
        filename: 'components/common/ui/index.ts', // legitimate barrel file export (2 levels)
      },
      {
        code: 'export { Component } from "./layout/lists/items/Component";',
        filename: 'components/common/ui/index.ts', // legitimate barrel file export (3 levels)
      },
      {
        code: 'export { Component } from "@/lib/types/configurableFormModal";',
        filename: 'components/common/ui/layout/modals/ConfigurableFormModal.tsx', // legitimate @/ import to lib/
      },
      {
        code: 'export { Component } from "@/components/features/dashboard/tiles/AirportInfoTile";',
        filename: 'components/features/dashboard/DashboardSections.tsx', // legitimate @/ import within components/
      },
      {
        code: 'export { Component } from "@/services/documentService";',
        filename: 'components/common/ui/index.ts', // legitimate @/ import to services/
      },
      {
        code: 'export { Component } from "@/types/database/entities/users";',
        filename: 'components/common/ui/index.ts', // legitimate @/ import to types/
      },
      {
        code: 'export { Component } from "../types/core/utilities/logger.types";',
        filename: 'lib/infrastructure/logger.ts', // file not in barrel directory, rule doesn't apply
      },
      {
        code: 'export { Component } from "@/lib/types";',
        filename: 'some/other/file.ts', // file not in barrel directory, rule doesn't apply
      },
    ],
    invalid: [
      // Test deep export path detection (main functionality)
      {
        code: 'export { Component } from "./nested/deep/Component";',
        filename: 'components/common/ui/index.ts', // Use barrel file to test rule
        errors: [
          {
            message: /Barrel files should not export from deeply nested paths/,
          },
        ],
      },
      {
        code: 'export { Component } from "./very/deep/nested/Component";',
        filename: 'components/common/ui/index.ts', // Too deep even for barrel file (4 levels)
        errors: [
          {
            message: /Barrel files should not export from deeply nested paths/,
          },
        ],
      },
      {
        code: 'export { Component } from "./outside/barrel/Component";',
        filename: 'components/common/ui/index.ts', // Outside barrel directory
        errors: [
          {
            message: /Barrel files should not export from deeply nested paths/,
          },
        ],
      },
      {
        code: 'export { Component } from "@/some/external/module";',
        filename: 'components/common/ui/index.ts', // @/ import from outside barrel tree
        errors: [
          {
            message: /Barrel files should not export from deeply nested paths/,
          },
        ],
      },
      {
        code: 'export { Component } from "../../../../outside/barrel/Component";',
        filename: 'components/common/ui/index.ts', // ../ import going outside barrel tree from barrel file
        errors: [
          {
            message: /Barrel files should not export from deeply nested paths/,
          },
        ],
      },
    ],
  });
});
