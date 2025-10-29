/**
 * ESLint Rule: require-test-describe-blocks
 * Enforces that test files have proper describe blocks
 */

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require describe blocks in test files',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingDescribe: 'Test files must have at least one describe block',
      emptyDescribe: 'describe block "{{ describeName }}" is empty - add test cases',
      missingIt: 'describe block must contain at least one test case (it/test)',
    },
    schema: [],
  },

  create(context) {
    // Cache filename and check if it's a test file (O(1) Set lookup)
    const filename = context.getFilename();
    const isTestFile = filename.includes('.test.') || filename.includes('.spec.');

    // Only check test files
    if (!isTestFile) {
      return {};
    }

    let hasDescribe = false;
    const describeStack = []; // Stack to track nested describe blocks

    return {
      CallExpression(node) {
        // Cache callee for performance
        const callee = node.callee;
        if (!callee || callee.type !== 'Identifier') return;

        const calleeName = callee.name;

        // Check for describe blocks
        if (calleeName === 'describe') {
          hasDescribe = true;
          const describeName = node.arguments[0]?.value || 'unknown';
          describeStack.push({
            node,
            name: describeName,
            hasTests: false,
          });
        }
        // Check for it/test blocks
        else if ((calleeName === 'it' || calleeName === 'test') && describeStack.length > 0) {
          // Mark all describe blocks in the current stack as having tests (optimized)
          for (let i = 0; i < describeStack.length; i++) {
            describeStack[i].hasTests = true;
          }
        }
      },

      'Program:exit'(node) {
        // Check if file has at least one describe block
        if (!hasDescribe) {
          context.report({
            node,
            messageId: 'missingDescribe',
          });
        }

        // Check if describe blocks have tests (optimized forEach)
        for (const block of describeStack) {
          if (!block.hasTests) {
            context.report({
              node: block.node,
              messageId: 'emptyDescribe',
              data: {
                describeName: block.name,
              },
            });
          }
        }
      },
    };
  },
};

module.exports = { requireTestDescribeBlocksRule: rule };
