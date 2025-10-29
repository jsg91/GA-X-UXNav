/**
 * @fileoverview ESLint rule to detect and warn about deep barrel files (index.ts) that are deeper than configured directories
 * @description Run the custom cleanup script: npm run barrels
 * @description This script will automatically delete any index.ts files found in subdirectories deeper than the configured directories
 * @description Uses centralized configuration from XConfig/barrels.config.js
 *
 * Deep Barrel Detection Rules:
 * - Warns about barrel files (index.ts) in deeply nested directories
 * - Enforces maximum directory depth limits (≤3 levels recommended)
 * - Maintains clean import hierarchies and prevents performance issues
 * - Works with barrel generation script to maintain consistent structure
 *
 * Performance Impact:
 * - Deep barrel structures can slow down bundling and development
 * - Complex import resolution affects IDE performance and autocomplete
 * - Nested barrels can create maintenance overhead
 * - Limits help maintain predictable import patterns
 *
 * Configuration: XConfig/barrels.config.js defines the maximum allowed depth
 *
 * @author GA-X Team
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { ESLintGlobalCache } = require('../utils/eslint-utils');

/**
 * Expands wildcard directory patterns for cleanup
 */
function expandDirectoriesForCleanup(directories) {
  const expanded = [];

  directories.forEach(dir => {
    if (dir.endsWith('/*')) {
      // Handle wildcard pattern like 'components/features/*'
      const baseDir = dir.slice(0, -2); // Remove '/*'
      if (fs.existsSync(baseDir)) {
        const items = fs.readdirSync(baseDir);
        items.forEach(item => {
          const fullPath = path.join(baseDir, item);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            expanded.push(fullPath);
          }
        });
      }
    } else {
      // Regular directory
      expanded.push(dir);
    }
  });

  return expanded;
}

/**
 * Get the barrel generation configuration using shared cache
 */
function getBarrelConfig() {
  const config = ESLintGlobalCache.getBarrelConfig();

  // Expand wildcard directories for both ESLint rule and cleanup
  if (config.directories) {
    config.expandedDirectories = expandDirectoriesForCleanup(config.directories);
  }

  return config;
}

/**
 * Check if a directory path is within any of the configured directory trees using shared cache
 */
function isWithinConfiguredDirectoryTree(dirPath, allowedDirectories) {
  return ESLintGlobalCache.isInBarrelDirectory(dirPath, allowedDirectories);
}

/**
 * Check if a directory path is within the allowed depth for barrel files (exact match only) using shared cache
 */
function isAllowedBarrelDirectory(dirPath, allowedDirectories) {
  // Resolve both paths to absolute paths before normalizing/comparing
  const resolvedDirPath = path.resolve(dirPath);
  const normalizedPath = ESLintGlobalCache.normalizePath(resolvedDirPath);

  for (const allowedDir of allowedDirectories) {
    const normalizedAllowedDir = ESLintGlobalCache.normalizePath(path.resolve(allowedDir));

    // Only allow barrel files in the exact configured directories (not subdirectories)
    if (normalizedPath === normalizedAllowedDir) {
      return true;
    }
  }

  return false;
}

module.exports = {
  'no-deep-barrels': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Detect barrel files (index.ts) that are deeper than configured directories',
        category: 'Best Practices',
        recommended: true,
      },
      schema: [], // no options
    },

    create: function (context) {
      // Get the barrel generation configuration
      const config = getBarrelConfig();

      // Expand wildcard directories for proper checking (same as cleanup function)
      const allowedDirectories = config.expandedDirectories || config.directories || [];

      // If no directories are configured, don't do anything
      if (allowedDirectories.length === 0) {
        return {};
      }

      return {
        Program: function (node) {
          const filename = context.getFilename();

          // Only process index.ts files
          if (!filename.endsWith('index.ts')) {
            return;
          }

          // Cache path operations
          const dirPath = path.dirname(filename);

          // Only check barrel files that are within the configured directory trees
          if (!isWithinConfiguredDirectoryTree(dirPath, allowedDirectories)) {
            return;
          }

          // Check if this barrel file is in an allowed location (exact match only, not subdirectory)
          if (!isAllowedBarrelDirectory(dirPath, allowedDirectories)) {
            context.report({
              node,
              message: `Barrel file (index.ts) is deeper than barrels generator generates. Use --fix to fix it.`,
            });
          }
        },

        // Also check for deep import paths in export statements
        ExportNamedDeclaration: function (node) {
          if (!node.source) return; // Only check re-exports

          const importPath = node.source.value;

          // Check if the import path is too deep (more than 1 level)
          const pathParts = importPath.split('/').filter(part => part && part !== '.' && part !== '..');

          // Count directory depth (exclude the filename)
          let directoryDepth = pathParts.length;
          if (pathParts.length > 0 && !pathParts[pathParts.length - 1].includes('.')) {
            // If the last part doesn't contain a dot, it's a directory, so count all parts as directories
            directoryDepth = pathParts.length;
          } else if (pathParts.length > 1) {
            // If the last part contains a dot, it's a file, so subtract 1 for directory depth
            directoryDepth = pathParts.length - 1;
          }

          // If more than 1 level deep, check if this is a legitimate barrel file export
          if (directoryDepth > 1) {
            const filename = context.getFilename();

            // ONLY check actual barrel files (index.ts), not all files in barrel directories
            if (!filename.endsWith('index.ts')) {
              return; // Not a barrel file, skip this check
            }

            const dirPath = path.dirname(filename);

            // Only check files that are within configured barrel directories
            if (!isWithinConfiguredDirectoryTree(dirPath, allowedDirectories)) {
              return; // Not in a barrel directory, skip this check
            }

            // For barrel files in configured directories, check if the import is reasonable
            const isAbsoluteImport = importPath.startsWith('@/');
            const isRelativeImport = importPath.startsWith('./') || importPath.startsWith('../');

            if (isAbsoluteImport) {
              // Check if the absolute import is within the same barrel directory tree
              const importPathWithoutAlias = importPath.replace('@/', '');
              const projectRoot = process.cwd();
              const importAbsolutePath = path.resolve(projectRoot, importPathWithoutAlias);
              const absoluteBarrelDir = path.resolve(dirPath);
              const relativeImportPath = path.relative(absoluteBarrelDir, importAbsolutePath);

              // Allow if within barrel directory tree (up to 3 levels deep)
              if (!relativeImportPath.startsWith('../') && !path.isAbsolute(relativeImportPath) && directoryDepth <= 3) {
                return; // Allow reasonable imports within barrel tree
              }

              // Also allow cross-module imports to lib/, services/, types/, etc.
              if (
                importPath.startsWith('@/lib/') ||
                importPath.startsWith('@/services/') ||
                importPath.startsWith('@/types/') ||
                importPath.startsWith('@/constants/') ||
                importPath.startsWith('@/hooks/') ||
                importPath.startsWith('@/contexts/')
              ) {
                return; // Allow legitimate cross-module imports
              }
            } else if (isRelativeImport) {
              // For relative imports, check if they're within the barrel directory tree and reasonable depth
              const absoluteBarrelDir = path.resolve(dirPath);
              const importAbsolutePath = path.resolve(path.dirname(filename), importPath);
              const relativeImportPath = path.relative(absoluteBarrelDir, importAbsolutePath);

              // Allow if within barrel directory tree and not too deep (max 3 levels)
              if (!relativeImportPath.startsWith('../') && !path.isAbsolute(relativeImportPath) && directoryDepth <= 3) {
                return; // Allow reasonable relative imports within barrel tree
              }
            }

            // Flag truly deep exports (outside barrel directory or excessively nested)
            context.report({
              node,
              message: `Barrel files should not export from deeply nested paths. Found: ${importPath}`,
            });
          }
        },
      };
    },
  },

  // Export the cleanup function for use as a script
  cleanDeepBarrels: function () {
    const fs = require('fs');
    const path = require('path');

    console.log('🧹 Cleaning up deep barrel files...');

    // Get the barrel generation configuration
    const config = getBarrelConfig();
    const allowedDirectories = config.expandedDirectories || config.directories || [];

    if (allowedDirectories.length === 0) {
      console.log('No directories configured for barrel generation. Nothing to clean.');
      return;
    }

    console.log(`Allowed directories: ${allowedDirectories.join(', ')}`);

    let totalDeleted = 0;
    let totalProcessed = 0;

    // Process each allowed directory
    for (const allowedDir of allowedDirectories) {
      const resolvedAllowedDir = path.resolve(allowedDir);

      if (!fs.existsSync(resolvedAllowedDir)) {
        console.log(`Directory ${allowedDir} does not exist, skipping...`);
        continue;
      }

      console.log(`\n📁 Processing directory: ${allowedDir}`);

      // Find all index.ts files in this directory tree
      function findIndexTsFiles(startPath) {
        const indexFiles = [];

        function traverseDirectory(currentPath) {
          try {
            const items = fs.readdirSync(currentPath);

            for (const item of items) {
              const fullPath = path.join(currentPath, item);
              const stat = fs.statSync(fullPath);

              if (stat.isDirectory()) {
                // Skip excluded directories from config
                const relativePath = path.relative('.', fullPath);
                const shouldSkip = (config.excludePatterns || []).some(pattern => new RegExp(pattern.replace(/\*\*/g, '.*')).test(relativePath));

                if (!shouldSkip) {
                  traverseDirectory(fullPath);
                }
              } else if (item === 'index.ts' && stat.isFile()) {
                indexFiles.push(fullPath);
              }
            }
          } catch (_error) {
            // Skip directories that can't be read
          }
        }

        try {
          traverseDirectory(startPath);
        } catch (error) {
          console.error('Error traversing directory:', startPath, error.message);
        }

        return indexFiles;
      }

      const indexFiles = findIndexTsFiles(resolvedAllowedDir);
      totalProcessed += indexFiles.length;

      for (const indexFile of indexFiles) {
        const dirPath = path.dirname(indexFile);

        // Only check barrel files that are within the configured directory trees
        if (!isWithinConfiguredDirectoryTree(dirPath, allowedDirectories)) {
          continue;
        }

        // Check if this barrel file is in an allowed location (exact match only)
        if (!isAllowedBarrelDirectory(dirPath, allowedDirectories)) {
          console.log(`  ❌ Deep barrel found: ${path.relative(process.cwd(), indexFile)}`);
          try {
            fs.unlinkSync(indexFile);
            console.log(`    ✅ Deleted`);
            totalDeleted++;
          } catch (error) {
            console.error(`    ❌ Failed to delete:`, error.message);
          }
        }
      }
    }

    console.log(`\n✅ Cleanup complete!`);
    console.log(`   Processed: ${totalProcessed} barrel files`);
    console.log(`   Deleted: ${totalDeleted} deep barrel files`);
  },
};

// Run the cleanup if this script is executed directly
if (require.main === module) {
  module.exports.cleanDeepBarrels();
}
