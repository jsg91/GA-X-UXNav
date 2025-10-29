/**
 * ESLint Rule: filename-naming-convention
 * Enforces proper naming conventions for all files (test files and source files)
 */

const path = require('path');
const { filenameNamingPatterns } = require('../configs/naming-conventions');

// Use centralized naming patterns from naming-conventions.js
const namingPatterns = filenameNamingPatterns;

// Cache for path-based computations to avoid repeated operations
const pathComputationCache = new Map();

// Pre-compute common path patterns for faster matching (cross-platform)
const pathPatterns = {
  testsDir: /__tests__/,
  integrationDir: /__tests__[/\\]integration|integration/,
  unitDir: /__tests__[/\\]unit|unit/,
  componentsDir: /__tests__[/\\]components|components/,
  libDir: /([/\\]|^)lib[/\\]/,
  servicesDir: /([/\\]|^)lib[/\\]services/,
  infrastructureDir: /([/\\]|^)lib[/\\]infrastructure/,
  domainDir: /([/\\]|^)lib[/\\]domain/,
  utilsDir: /([/\\]|^)lib[/\\]utils/,
  componentsPath: /([/\\]|^)components[/\\]/,
  componentsUiPath: /([/\\]|^)components[/\\]ui/,
  hooksDir: /([/\\]|^)hooks/,
  contextsDir: /([/\\]|^)contexts/,
  appTabsDir: /([/\\]|^)app[/\\]\([^)]+\)/,
  typesDir: /([/\\]|^)types|([/\\]|^)lib[/\\]types/,
  constantsDir: /([/\\]|^)constants|([/\\]|^)lib[/\\]constants/,
  infrastructurePath: /infrastructure/,
};

/**
 * Determine the expected naming convention for a file based on its location and characteristics (optimized)
 */
function getExpectedNamingConvention(filename, basename, dirname) {
  // Skip validation for auto-generated barrel files
  if (basename === 'index.ts' || basename === 'index.tsx') {
    return null;
  }

  // Cache path computations
  const cacheKey = `naming:${filename}:${basename}:${dirname}`;
  if (pathComputationCache.has(cacheKey)) {
    return pathComputationCache.get(cacheKey);
  }

  const relativePath = path.relative(process.cwd(), filename);

  let result = null;

  // Test files in __tests__ directory - any file in __tests__ should be treated as a test file
  if (pathPatterns.testsDir.test(relativePath)) {
    if (pathPatterns.integrationDir.test(relativePath)) {
      result = { pattern: '*.integration.test.tsx', description: '*.integration.test.tsx or *.integration.test.ts' };
    } else {
      result = { pattern: '*.test.tsx', description: '*.test.ts or *.test.tsx' };
    }
  }

  // Source files naming conventions (using optimized pattern matching)

  // Components: PascalCase (only if not already determined to be a test file)
  if (!result && pathPatterns.componentsPath.test(relativePath) && (basename.endsWith('.tsx') || basename.endsWith('.ts'))) {
    result = { pattern: 'PascalCase', description: 'PascalCase (e.g., AircraftItem.tsx)' };
  }
  // Hooks: camelCase starting with 'use'
  else if (
    !result &&
    (pathPatterns.hooksDir.test(relativePath) || (pathPatterns.libDir.test(relativePath) && relativePath.includes('/hooks'))) &&
    (basename.endsWith('.tsx') || basename.endsWith('.ts'))
  ) {
    result = { pattern: 'camelCase with use prefix', description: 'camelCase starting with "use" (e.g., useAuth.ts)' };
  }
  // Prevent 'use' prefix outside of hooks directory (only for use + capital letter)
  else if (
    !result &&
    /^use[A-Z]/.test(basename.replace(/\.(tsx?|jsx?)$/, '')) &&
    !pathPatterns.hooksDir.test(relativePath) &&
    !(pathPatterns.libDir.test(relativePath) && relativePath.includes('/hooks'))
  ) {
    result = { pattern: 'no-use-prefix-outside-hooks', description: 'Files starting with "use" must be in hooks/ directory' };
  }
  // Services: camelCase ending with 'Service'
  else if (
    !result &&
    (pathPatterns.servicesDir.test(relativePath) || (pathPatterns.libDir.test(relativePath) && relativePath.includes('/services'))) &&
    (basename.endsWith('.tsx') || basename.endsWith('.ts'))
  ) {
    result = { pattern: 'camelCase ending with Service', description: 'camelCase ending with "Service" (e.g., aircraftService.ts)' };
  }
  // Types: PascalCase.types.ts (except database entities and feature types which use lowercase/camelCase)
  else if (!result && pathPatterns.typesDir.test(relativePath) && (basename.endsWith('.tsx') || basename.endsWith('.ts'))) {
    // Database entity files and feature types use lowercase naming (matching table/domain names)
    // Normalize path separators for cross-platform compatibility
    const normalizedPath = relativePath.replace(/\\/g, '/');
    if (pathPatterns.libDir.test(relativePath) && normalizedPath.includes('/types') && (normalizedPath.includes('database/entities') || normalizedPath.includes('features/'))) {
      result = { pattern: 'lowercase.types.ts', description: 'lowercase with .types.ts suffix (e.g., users.types.ts)' };
    } else {
      // Regular type files use camelCase or PascalCase with .types.ts suffix
      result = { pattern: 'camelCase.types.ts', description: 'camelCase or PascalCase with .types.ts suffix (e.g., formManager.types.ts)' };
    }
  }
  // Utils: camelCase ending with 'Utils' or just camelCase
  else if (
    !result &&
    (pathPatterns.utilsDir.test(relativePath) || (pathPatterns.libDir.test(relativePath) && relativePath.includes('/utils'))) &&
    (basename.endsWith('.tsx') || basename.endsWith('.ts'))
  ) {
    result = { pattern: 'camelCase', description: 'camelCase (e.g., validationUtils.ts)' };
  }
  // Constants: SCREAMING_SNAKE_CASE
  else if (
    !result &&
    (pathPatterns.constantsDir.test(relativePath) || (pathPatterns.libDir.test(relativePath) && relativePath.includes('/constants'))) &&
    (basename.endsWith('.tsx') || basename.endsWith('.ts'))
  ) {
    result = { pattern: 'SCREAMING_SNAKE_CASE', description: 'SCREAMING_SNAKE_CASE (e.g., API_ENDPOINTS.ts)' };
  }
  // Infrastructure files: camelCase
  else if (!result && pathPatterns.infrastructurePath.test(relativePath) && (basename.endsWith('.tsx') || basename.endsWith('.ts'))) {
    result = { pattern: 'camelCase', description: 'camelCase (e.g., networkUtils.ts)' };
  }

  if (result) {
    pathComputationCache.set(cacheKey, result);
  }

  return result;
}

// Create lookup table for pattern validation to avoid switch statement overhead
const patternValidators = {
  '*.integration.test.tsx': basename => basename.endsWith('.integration.test.tsx') || basename.endsWith('.integration.test.ts'),
  '*.test.tsx': basename => basename.endsWith('.test.ts') || basename.endsWith('.test.tsx'),
  lowercase: nameWithoutExt => namingPatterns.lowercase.test(nameWithoutExt),
  PascalCase: nameWithoutExt => namingPatterns.PascalCase.test(nameWithoutExt),
  'lowercase.types.ts': basename => {
    // Must end with .types.ts or .types.tsx
    if (!basename.endsWith('.types.ts') && !basename.endsWith('.types.tsx')) {
      return false;
    }
    // Extract name before .types.ts and check if it's lowercase
    const nameWithoutTypesSuffix = basename.replace(/\.types\.(ts|tsx)$/, '');
    return namingPatterns.lowercase.test(nameWithoutTypesSuffix);
  },
  'camelCase.types.ts': basename => {
    // Must end with .types.ts or .types.tsx
    if (!basename.endsWith('.types.ts') && !basename.endsWith('.types.tsx')) {
      return false;
    }
    // Extract name before .types.ts and check if it's camelCase or PascalCase
    const nameWithoutTypesSuffix = basename.replace(/\.types\.(ts|tsx)$/, '');
    return namingPatterns.camelCase.test(nameWithoutTypesSuffix) || namingPatterns.PascalCase.test(nameWithoutTypesSuffix);
  },
  'PascalCase.types.ts': basename => {
    // Must end with .types.ts or .types.tsx
    if (!basename.endsWith('.types.ts') && !basename.endsWith('.types.tsx')) {
      return false;
    }
    // Extract name before .types.ts and check if it's PascalCase
    const nameWithoutTypesSuffix = basename.replace(/\.types\.(ts|tsx)$/, '');
    return namingPatterns.PascalCase.test(nameWithoutTypesSuffix);
  },
  'camelCase with use prefix': nameWithoutExt => namingPatterns.camelCaseWithUse.test(nameWithoutExt),
  'no-use-prefix-outside-hooks': () => false, // This pattern should always be invalid outside hooks
  'camelCase ending with Service': nameWithoutExt => namingPatterns.camelCaseEndingWithService.test(nameWithoutExt),
  camelCase: nameWithoutExt => namingPatterns.camelCase.test(nameWithoutExt),
  SCREAMING_SNAKE_CASE: nameWithoutExt => namingPatterns.SCREAMING_SNAKE_CASE.test(nameWithoutExt),
};

/**
 * Check if a filename matches the expected naming pattern (optimized with lookup table)
 */
function validateNamingConvention(basename, expected) {
  if (!expected) return { valid: true };

  // Strip platform suffixes (.ios, .android) before file extension for proper naming validation
  const nameWithoutPlatformSuffix = basename.replace(/\.(ios|android)(\.tsx?|\.jsx?)$/, '');
  const nameWithoutExt = nameWithoutPlatformSuffix.replace(/\.(tsx?|jsx?)$/, '');

  // Use lookup table for O(1) access instead of switch statement
  const validator = patternValidators[expected.pattern];
  if (validator) {
    // For test files and .types.ts files, pass the full basename
    // For other patterns, pass the name without extension
    const needsFullBasename =
      expected.pattern === 'PascalCase.types.ts' ||
      expected.pattern === 'lowercase.types.ts' ||
      expected.pattern === 'camelCase.types.ts' ||
      expected.pattern === '*.test.tsx' ||
      expected.pattern === '*.integration.test.tsx';
    const isValid = needsFullBasename ? validator(basename) : validator(nameWithoutExt);

    return {
      valid: isValid,
      expected: expected.description,
    };
  }

  return { valid: true };
}

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce filename naming conventions for all files',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      wrongNaming: 'Files must use {{ expectedNaming }} naming pattern. Found: {{ currentName }}',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();
    const basename = path.basename(filename);
    const dirname = path.dirname(filename);

    // Determine expected naming convention
    const expected = getExpectedNamingConvention(filename, basename, dirname);

    // If no specific convention applies, skip validation
    if (!expected) {
      return {};
    }

    // Validate the naming convention
    const validation = validateNamingConvention(basename, expected);

    if (!validation.valid) {
      return {
        Program(node) {
          context.report({
            node,
            messageId: 'wrongNaming',
            data: {
              expectedNaming: validation.expected,
              currentName: basename,
            },
          });
        },
      };
    }

    return {};
  },
};

module.exports = { filenameNamingConventionRule: rule };
