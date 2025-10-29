/**
 * @fileoverview Tests for test-file-naming-convention ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const { filenameNamingConventionRule } = require('./test-file-naming-convention');

const ruleTester = createRuleTester();

describe('test-file-naming-convention', () => {
  ruleTester.run('test-file-naming-convention', filenameNamingConventionRule, {
    valid: [
      // Test files
      {
        code: 'describe("test", () => {});',
        filename: '__tests__/components/Button.test.tsx',
      }, // correct naming for component test
      {
        code: 'describe("test", () => {});',
        filename: '__tests__/unit/utils.test.ts',
      }, // correct naming for unit test
      {
        code: 'describe("test", () => {});',
        filename: '__tests__/integration/api.integration.test.tsx',
      }, // correct naming for integration test

      // Type files with .types.ts suffix
      {
        code: 'export type Aircraft = { id: string; };',
        filename: 'lib/types/features/aircraft/aircraft.types.ts',
      }, // correct lowercase.types.ts for feature types
      {
        code: 'export type DocumentsBusiness = { id: string; };',
        filename: 'lib/types/features/documents/documents.types.ts',
      }, // correct lowercase.types.ts for feature types
      {
        code: 'export type UserRoles = { id: string; };',
        filename: 'lib/types/business/services/userRoles.types.ts',
      }, // correct camelCase.types.ts for business types
      {
        code: 'export type FormManager = { id: string; };',
        filename: 'lib/types/core/forms/formManager.types.ts',
      }, // correct camelCase.types.ts for core types

      // Database entity files with .types.ts suffix (lowercase)
      {
        code: 'export type Aircraft = { id: string; };',
        filename: 'lib/xdbschema/definitions/entities/aircrafts.xdbschema.ts',
      }, // correct schema files for xdbschema entities
      {
        code: 'export type UsersRow = { id: string; };',
        filename: 'lib/types/database/entities/users.types.ts',
      }, // correct lowercase.types.ts for database entities

      // Hooks files with 'use' prefix (should be valid in hooks directory)
      {
        code: 'export const useAuth = () => {};',
        filename: 'hooks/useAuth.ts',
      }, // valid: use prefix in hooks directory
      {
        code: 'export const useFormValidation = () => {};',
        filename: 'hooks/forms/useFormValidation.ts',
      }, // valid: use prefix in hooks subdirectory
      {
        code: 'export const useAuth = () => {};',
        filename: 'lib/hooks/useAuth.ts',
      }, // valid: use prefix in lib/hooks directory
    ],
    invalid: [
      // Test file errors
      {
        code: 'describe("test", () => {});',
        filename: '__tests__/componentTest.tsx',
        errors: [
          {
            message: /Files must use \*\.test\.ts or \*\.test\.tsx naming pattern/,
          },
        ],
      }, // incorrect naming - Test suffix
      {
        code: 'describe("test", () => {});',
        filename: '__tests__/component.tests.ts',
        errors: [
          {
            message: /Files must use \*\.test\.ts or \*\.test\.tsx naming pattern/,
          },
        ],
      }, // incorrect naming - .tests instead of .test

      // Type file errors
      {
        code: 'export type Aircraft = { id: string; };',
        filename: 'lib/types/features/aircraft/Aircraft.ts',
        errors: [
          {
            message: /Files must use lowercase with \.types\.ts suffix \(e\.g\., users\.types\.ts\) naming pattern/,
          },
        ],
      }, // missing .types.ts suffix for feature types
      {
        code: 'export type Aircraft = { id: string; };',
        filename: 'lib/types/features/aircraft/Aircraft.types.ts',
        errors: [
          {
            message: /Files must use lowercase with \.types\.ts suffix \(e\.g\., users\.types\.ts\) naming pattern/,
          },
        ],
      }, // PascalCase instead of lowercase for feature types
      {
        code: 'export type DocumentsBusiness = { id: string; };',
        filename: 'lib/types/features/documents/documents-business.types.ts',
        errors: [
          {
            message: /Files must use lowercase with \.types\.ts suffix \(e\.g\., users\.types\.ts\) naming pattern/,
          },
        ],
      }, // kebab-case instead of lowercase for feature types
      {
        code: 'export type FormManager = { id: string; };',
        filename: 'lib/types/core/forms/form-manager.types.ts',
        errors: [
          {
            message: /Files must use camelCase or PascalCase with \.types\.ts suffix \(e\.g\., formManager\.types\.ts\) naming pattern/,
          },
        ],
      }, // kebab-case instead of camelCase for core types

      // Files with 'use' + capital letter prefix outside hooks directory (should be invalid)
      {
        code: 'export const useFormValidation = () => {};',
        filename: 'lib/types/useFormValidation.ts',
        errors: [
          {
            message: /Files starting with "use" must be in hooks\/ directory/,
          },
        ],
      }, // use + capital letter outside hooks - lib/types
      {
        code: 'export const useAuth = () => {};',
        filename: 'lib/services/useAuth.ts',
        errors: [
          {
            message: /Files starting with "use" must be in hooks\/ directory/,
          },
        ],
      }, // use + capital letter outside hooks - lib/services
      {
        code: 'export const useApi = () => {};',
        filename: 'lib/utils/useApi.ts',
        errors: [
          {
            message: /Files starting with "use" must be in hooks\/ directory/,
          },
        ],
      }, // use + capital letter outside hooks - lib/utils
    ],
  });
});
