/**
 * @fileoverview ESLint rule to enforce markdown file placement policy
 * @description Disallows .md files anywhere except README.md in root and all .md files in /docs
 * @description Policy: Only README.md allowed in root, all .md files allowed in /docs, no .md files elsewhere
 * @author GA-X Team
 */

'use strict';

const path = require('path');

// Cache for path operations
const pathCache = new Map();

/**
 * Check if a file path violates the markdown placement policy
 * @param {string} filePath - The absolute path of the file being checked
 * @param {string} filename - The filename being checked
 * @returns {boolean} - true if the file violates the policy
 */
function violatesMarkdownPolicy(filePath, filename) {
  // Only check .md files
  if (!filename.endsWith('.md')) {
    return false;
  }

  // Cache path operations
  let pathParts;
  if (pathCache.has(filePath)) {
    pathParts = pathCache.get(filePath);
  } else {
    const relativePath = path.relative(process.cwd(), filePath);
    pathParts = relativePath.split(path.sep);
    pathCache.set(filePath, pathParts);
  }

  // Rule 1: README.md is allowed in root
  if (filename === 'README.md' && pathParts.length === 1) {
    return false;
  }

  // Rule 2: All .md files are allowed in /docs directory
  if (pathParts[0] === 'docs') {
    return false;
  }

  // Rule 3: Any other .md file anywhere else is not allowed
  return true;
}

module.exports = {
  'no-markdown-outside-docs': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce markdown file placement policy: only README.md in root and all .md files in /docs allowed',
        category: 'Best Practices',
        recommended: true,
      },
      schema: [], // no options
      messages: {
        markdownNotAllowed: 'Markdown files are not allowed here. Only README.md is allowed in root and all .md files are allowed in /docs directory.',
        moveToDocs: 'Move this markdown file to the /docs directory.',
      },
    },

    create: function (context) {
      return {
        Program: function (node) {
          const filename = context.getFilename();
          // Cache basename for performance
          const basename = path.basename(filename);

          // Check if this file violates the markdown policy
          if (violatesMarkdownPolicy(filename, basename)) {
            context.report({
              node,
              messageId: 'markdownNotAllowed',
            });
          }
        },
      };
    },
  },
};
