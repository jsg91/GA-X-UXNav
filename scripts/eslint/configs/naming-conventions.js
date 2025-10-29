/**
 * Naming Convention Rules - Optimized for AI Understanding and TypeScript/React Best Practices
 *
 * This configuration enforces industry-standard naming conventions while accounting for
 * database compatibility (Supabase/PostgreSQL snake_case fields) and React patterns.
 *
 * Key principles:
 * - camelCase: variables, functions, object properties
 * - PascalCase: types, interfaces, classes, React components
 * - UPPER_CASE: true constants (numbers, config strings)
 * - snake_case: ONLY for database fields in type definitions
 */

// ============================================================================
// FILENAME NAMING PATTERNS - Used by test-file-naming-convention.js rule
// ============================================================================

const filenameNamingPatterns = {
  lowercase: /^[a-z][a-z0-9]*$/,
  PascalCase: /^[A-Z][a-zA-Z0-9]*$/,
  camelCaseWithUse: /^use[A-Za-z][a-zA-Z0-9]*$/,
  camelCaseEndingWithService: /^[a-z][a-zA-Z0-9]*Service$/,
  camelCase: /^[a-z][a-zA-Z0-9]*$/,
  SCREAMING_SNAKE_CASE: /^[A-Z][A-Z0-9_]*$/,
};

// ============================================================================
// CODE IDENTIFIER NAMING RULES - ESLint TypeScript naming conventions
// ============================================================================

module.exports = {
  filenameNamingPatterns,

  namingConventionRules: [
    'error',

    // ============================================================================
    // VARIABLES - Allow flexible formats, block only snake_case
    // ============================================================================

    // All variables: Allow camelCase, PascalCase (components), and UPPER_CASE (constants)
    // This allows the codebase's natural patterns to work correctly
    {
      selector: 'variable',
      format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      leadingUnderscore: 'allow',
      trailingUnderscore: 'forbid',
      custom: {
        regex: '^[a-z]+_[a-z_]+$', // Block snake_case
        match: false,
      },
    },

    // ============================================================================
    // FUNCTIONS - Allow both camelCase and PascalCase
    // ============================================================================

    // Functions: Allow both camelCase (regular) and PascalCase (React components)
    {
      selector: 'function',
      format: ['camelCase', 'PascalCase'],
      leadingUnderscore: 'allow',
      custom: {
        regex: '^[a-z]+_[a-z_]+$', // Block snake_case
        match: false,
      },
    },

    // ============================================================================
    // TYPES, INTERFACES, ENUMS
    // ============================================================================

    // Types and Interfaces: PascalCase
    {
      selector: 'typeLike',
      format: ['PascalCase'],
    },

    // Type parameters: Single uppercase letter or PascalCase
    {
      selector: 'typeParameter',
      format: ['PascalCase'],
      custom: {
        regex: '^[A-Z]$|^T[A-Z][a-z]',
        match: true,
      },
    },

    // Enums: PascalCase
    {
      selector: 'enum',
      format: ['PascalCase'],
    },

    // Enum members: SCREAMING_SNAKE_CASE
    {
      selector: 'enumMember',
      format: ['UPPER_CASE'],
    },

    // ============================================================================
    // CLASS MEMBERS
    // ============================================================================

    // Class names: PascalCase
    {
      selector: 'class',
      format: ['PascalCase'],
    },

    // Class properties: camelCase
    {
      selector: 'classProperty',
      format: ['camelCase'],
      leadingUnderscore: 'allow',
    },

    // Class methods: camelCase
    {
      selector: 'classMethod',
      format: ['camelCase'],
    },

    // Static class properties: SCREAMING_SNAKE_CASE or PascalCase
    {
      selector: 'classProperty',
      modifiers: ['static'],
      format: ['UPPER_CASE', 'PascalCase'],
    },

    // ============================================================================
    // OBJECT PROPERTIES - Flexible to support DB fields and various patterns
    // ============================================================================

    // Object properties: Allow camelCase, PascalCase, snake_case
    // This is intentionally flexible because:
    // 1. Database fields use snake_case (created_at, user_id, etc.)
    // 2. Some object properties reference components (PascalCase)
    // 3. Regular properties use camelCase
    // 4. API responses may use various formats
    {
      selector: 'property',
      format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
      leadingUnderscore: 'allow',
    },

    // Object literal properties with quotes: allow any format (for external APIs, HTTP headers, etc.)
    {
      selector: 'property',
      format: null,
      modifiers: ['requiresQuotes'],
    },

    // ============================================================================
    // PARAMETERS - Allow camelCase and PascalCase
    // ============================================================================

    // Function parameters: camelCase or PascalCase (for component props)
    {
      selector: 'parameter',
      format: ['camelCase', 'PascalCase'],
      leadingUnderscore: 'allow',
      custom: {
        regex: '^[a-z]+_[a-z_]+$', // Block snake_case
        match: false,
      },
    },

    // ============================================================================
    // METHODS
    // ============================================================================

    // Object methods: camelCase
    {
      selector: 'method',
      format: ['camelCase'],
    },

    // ============================================================================
    // IMPORTS
    // ============================================================================

    // Default imports: PascalCase or camelCase
    {
      selector: 'import',
      format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
    },
  ],
};
