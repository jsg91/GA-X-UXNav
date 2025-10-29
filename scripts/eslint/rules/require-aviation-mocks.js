/**
 * ESLint Rule: require-aviation-mocks
 * Enforces use of aviation-specific mock factories instead of manual data
 */

// Module-level patterns for better performance
const manualMockPatterns = [
  { pattern: /registration:\s*['"`]N\d+/, factory: 'createMockAircraft' },
  { pattern: /type:\s*['"`](Cessna|Boeing|Airbus)/, factory: 'createMockAircraft' },
  { pattern: /license_number:\s*['"`](ATP|CPL|PPL)/, factory: 'createMockUser' },
  { pattern: /role:\s*['"`](pilot|instructor|admin)/, factory: 'createMockUser' },
  { pattern: /departure_aerodrome:\s*['"`][A-Z]{4}/, factory: 'createMockFlight' },
  { pattern: /aircraft_count:\s*\d+/, factory: 'createMockClub' },
];

// Pattern to detect general mock data objects (objects with properties that look like test data)
// This should match simple objects like { id: 1 } or { name: 'test' }
const generalMockPattern = /{\s*\w+\s*:\s*[^}]+\s*}/;

const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require use of aviation mock factories in tests',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      useAviationFactory: 'Use {{ factoryName }} instead of creating manual mock data',
      importMockFactory: 'Import mock factory from __tests__/utils/test-utils or __tests__/utils/api-mocks',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Only check test files (check for .test., .spec., or __tests__ directory)
    if (!filename.includes('.test.') && !filename.includes('.spec.') && !filename.includes('__tests__')) {
      return {};
    }

    // Cache imports list once per file
    let importsCache = null;
    function getImports() {
      if (!importsCache) {
        importsCache = context
          .getSourceCode()
          .ast.body.filter(n => n.type === 'ImportDeclaration')
          .flatMap(n => n.specifiers.map(s => s.imported?.name || s.local.name));
      }
      return importsCache;
    }

    return {
      ObjectExpression(node) {
        const sourceCode = context.getSourceCode();
        const objectText = sourceCode.getText(node);

        // Skip empty objects
        if (objectText.trim() === '{}') {
          return;
        }

        // Check specific aviation patterns first
        let matchedFactory = null;
        for (const { pattern, factory } of manualMockPatterns) {
          if (pattern.test(objectText)) {
            matchedFactory = factory;
            break;
          }
        }

        // If no specific pattern matched, check for general mock data
        // Only check objects that are being assigned to variables (not inline objects in JSX, etc.)
        if (!matchedFactory) {
          // Check if this object is part of a variable declaration
          const parent = node.parent;
          const isVariableDeclaration = parent && parent.type === 'VariableDeclarator';

          if (isVariableDeclaration && generalMockPattern.test(objectText)) {
            matchedFactory = 'createMockData'; // Generic factory name
          }
        }

        // Report if we found a match and factory is not imported
        if (matchedFactory) {
          const imports = getImports();
          if (!imports.includes(matchedFactory)) {
            context.report({
              node,
              messageId: 'useAviationFactory',
              data: {
                factoryName: matchedFactory,
              },
            });
          }
        }
      },
    };
  },
};

module.exports = { requireAviationMocksRule: rule };
