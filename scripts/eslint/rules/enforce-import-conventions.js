/**
 * @fileoverview Comprehensive import convention enforcement for GA-X project
 * @description Consolidates all import-related rules with minimal, DRY, performant code
 *
 * ## Import Philosophy
 *
 * 1. **PATH STYLE**: Cross-directory → absolute (@/), same-directory → relative (./)
 * 2. **BARREL USAGE**: External → barrel, internal → direct, use nearest barrel
 * 3. **CIRCULAR DEPS**: Split barrel imports within same module
 * 4. **DEEP IMPORTS**: Auto-detect and fix to nearest barrel
 *
 * ## Examples
 *
 * ```javascript
 * // ❌ Deep import → ✅ Nearest barrel
 * import { DataListView } from '@/components/common/ui/layout/lists/DataListView';
 * import { DataListView } from '@/components/common/ui';
 *
 * // ❌ Relative cross-directory → ✅ Absolute
 * import { Button } from '../../../components/Button';
 * import { Button } from '@/components/Button';
 *
 * // ❌ Barrel within module → ✅ Direct imports
 * import { Input } from '@/components/common/ui/';
 * import { Input } from './Input';
 * ```
 *
 * @author GA-X Team
 */

'use strict';

const path = require('path');
const { ESLintGlobalCache, ImportFilter } = require('../utils/eslint-utils');
const { BarrelAnalyzer } = require('../utils/barrel-analyzer');

// ============================================================================
// CONFIGURATION & UTILITIES
// ============================================================================

const getConfig = () => ESLintGlobalCache.getBarrelConfig();
const normalizePath = p => ESLintGlobalCache.normalizePath(p);

/**
 * Directory utilities for barrel detection
 */
class DirectoryUtils {
  static getInternalRoot(filePath) {
    const normalized = filePath.replace(/\\/g, '/');
    const dirs = getConfig().directories || [];

    for (const dir of dirs) {
      const basePath = dir.replace('/*', '');
      if (normalized.startsWith(basePath + '/')) {
        // For wildcard directories (e.g., 'components/features/*'), return the first subdirectory
        // For non-wildcard directories (e.g., 'components/common/ui'), return the base path itself
        if (dir.endsWith('/*')) {
          const match = normalized.match(new RegExp(`^${basePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/([^/]+)`));
          return match ? `${basePath}/${match[1]}` : dir;
        } else {
          // Non-wildcard: all files under this directory are in the same module
          return basePath;
        }
      }
    }
    return null;
  }

  static areInSameDirectory(path1, path2) {
    const root1 = this.getInternalRoot(path1);
    const root2 = this.getInternalRoot(path2);
    return root1 && root1 === root2;
  }

  static isInBarrelDirectory(filePath) {
    return this.getInternalRoot(filePath) !== null;
  }
}

/**
 * Path resolution utilities
 */
class PathResolver {
  static toAbsoluteImport(filePath) {
    const projectRoot = process.cwd();
    let importPath = filePath.replace(/\.(ts|tsx|js|jsx)$/i, '');

    if (path.basename(importPath) === 'index') {
      importPath = path.dirname(importPath);
    }

    const relativeToRoot = path.relative(projectRoot, importPath);

    return `@/${relativeToRoot.replace(/\\/g, '/')}`;
  }

  static resolveImportPath(importPath, currentFile) {
    if (importPath.startsWith('@/')) {
      return path.join(process.cwd(), importPath.slice(2));
    }
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      return path.resolve(path.dirname(currentFile), importPath);
    }
    return null;
  }

  static resolveBarrelPath(importSource, currentFile) {
    const basePath = this.resolveImportPath(importSource, currentFile);
    if (!basePath) return null;

    const { existsSync, statSync } = require('fs');
    const possiblePaths = [path.join(basePath, 'index.ts'), path.join(basePath, 'index.tsx'), basePath + '.ts', basePath + '.tsx'];

    for (const testPath of possiblePaths) {
      try {
        if (existsSync(testPath) && statSync(testPath).isFile()) {
          return testPath;
        }
      } catch (_e) {
        continue;
      }
    }
    return null;
  }
}

// ============================================================================
// IMPORT CHECKERS (One class per concern)
// ============================================================================

/**
 * Check 1: Nearest Barrel Detection
 * Prevents deep imports when parent barrel exports the symbol
 */
class NearestBarrelChecker {
  static check(importPath, symbols) {
    if (!this.isDeepImport(importPath)) return null;

    const nearestBarrel = BarrelAnalyzer.findNearestWithSymbols(importPath, symbols);
    if (nearestBarrel && nearestBarrel !== importPath) {
      return {
        message: `Import from nearest barrel file. Use '${nearestBarrel}' instead of '${importPath}'`,
        fix: (fixer, node) => fixer.replaceText(node.source, `'${nearestBarrel}'`),
      };
    }
    return null;
  }

  static isDeepImport(importPath) {
    return importPath.startsWith('@/') && importPath.replace('@/', '').split('/').length >= 4;
  }
}

/**
 * Check 2: Circular Dependency Prevention
 * Splits barrel imports within same module to direct imports
 */
class CircularDependencyChecker {
  static check(importPath, symbols, currentFile, options) {
    if (!ImportFilter.isBarrelImport(importPath) || options.allowBarrelImports) {
      return null;
    }

    const projectRoot = process.cwd();
    const currentRelative = path.relative(projectRoot, normalizePath(currentFile)).replace(/\\/g, '/');
    const importResolved = PathResolver.resolveImportPath(importPath, currentFile);

    if (!importResolved) return null;

    const importRelative = path.relative(projectRoot, importResolved).replace(/\\/g, '/');

    if (!DirectoryUtils.areInSameDirectory(currentRelative, importRelative)) {
      return null;
    }

    const barrelPath = PathResolver.resolveBarrelPath(importPath, currentFile);
    if (!barrelPath) return null;

    const directImports = BarrelAnalyzer.splitToDirectImports(barrelPath, symbols, currentFile);
    if (directImports.length > 0) {
      return {
        message: 'Barrel import within same module can cause circular dependencies. Use direct imports instead.',
        fix: (fixer, node) => fixer.replaceTextRange(node.range, directImports.join('\n')),
      };
    }
    return null;
  }
}

/**
 * Check 3: Path Style Enforcement
 * Standardizes import paths based on module boundaries:
 * - Same module (barrel directory): Use relative paths
 * - Cross-module: Use absolute paths
 */
class PathStyleChecker {
  static check(importPath, currentFile, options) {
    if (options.allowRelativePaths) {
      return null;
    }

    const resolved = PathResolver.resolveImportPath(importPath, currentFile);
    if (!resolved) return null;

    const projectRoot = process.cwd();
    const currentRelative = path.relative(projectRoot, normalizePath(currentFile)).replace(/\\/g, '/');
    const importRelative = path.relative(projectRoot, resolved).replace(/\\/g, '/');

    const currentIsInBarrel = DirectoryUtils.isInBarrelDirectory(currentRelative);
    const importIsInBarrel = DirectoryUtils.isInBarrelDirectory(importRelative);
    const sameModule = DirectoryUtils.areInSameDirectory(currentRelative, importRelative);

    // CASE 1: Both files are in the same barrel module
    // → Should use RELATIVE imports (avoid circular dependencies)
    if (currentIsInBarrel && sameModule) {
      // Calculate the correct relative path
      const relativePath = path.relative(path.dirname(currentFile), resolved);
      const normalizedRelative = relativePath.replace(/\\/g, '/');
      const correctPath = normalizedRelative.startsWith('.') ? normalizedRelative : `./${normalizedRelative}`;

      // Check if current import is absolute or needs correction
      if (importPath.startsWith('@/')) {
        // Absolute import within same module - convert to relative
        return {
          message: `Imports within the same module should use direct relative paths to avoid circular dependencies. Use '${correctPath}' instead of '${importPath}'`,
          fix: (fixer, node) => fixer.replaceText(node.source, `'${correctPath}'`),
        };
      }

      // For relative imports, check if they're already optimal (no need to change)
      // Already using relative imports within same module - OK
      return null;
    }

    // CASE 2: Importing from a barrel directory from outside
    // → Should use ABSOLUTE imports
    if (importIsInBarrel && !sameModule) {
      if (!importPath.startsWith('@/')) {
        const replacement = PathResolver.toAbsoluteImport(resolved);
        return {
          message: `Imports from barrel directories must use absolute paths. Use '${replacement}' instead of '${importPath}'`,
          fix: (fixer, node) => fixer.replaceText(node.source, `'${replacement}'`),
        };
      }
      // Already using absolute imports - OK
      return null;
    }

    // CASE 3: Cross-directory imports (not involving barrels, or from barrel to non-barrel)
    // → Should use ABSOLUTE imports
    if (importPath.includes('..')) {
      const replacement = PathResolver.toAbsoluteImport(resolved);
      return {
        message: `Relative import must use absolute path when importing from different internal directories. Use '${replacement}' instead of '${importPath}'`,
        fix: (fixer, node) => fixer.replaceText(node.source, `'${replacement}'`),
      };
    }

    return null;
  }
}

// ============================================================================
// MAIN RULE
// ============================================================================

module.exports = {
  'enforce-import-conventions': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Comprehensive import convention enforcement: path style, barrel usage, circular dependency prevention, and nearest barrel detection',
        category: 'Best Practices',
        recommended: true,
      },
      fixable: 'code',
      schema: [
        {
          type: 'object',
          properties: {
            allowRelativePaths: { type: 'boolean', default: false },
            allowBarrelImports: { type: 'boolean', default: false },
          },
          additionalProperties: false,
        },
      ],
    },

    create(context) {
      const options = context.options[0] || {};
      const currentFile = context.getFilename();
      const currentFilePhysical = context.getPhysicalFilename?.() || currentFile;

      return {
        ImportDeclaration(node) {
          const importPath = node.source.value;

          // Early return for external imports (performance optimization)
          if (!ImportFilter.shouldProcessImport(importPath)) {
            return;
          }

          // Extract imported symbols
          const symbols = node.specifiers.filter(spec => spec.type === 'ImportSpecifier').map(spec => spec.imported.name);

          if (symbols.length === 0) {
            return;
          }

          // Run checks in priority order, return on first match (early return optimization)
          const checks = [
            () => NearestBarrelChecker.check(importPath, symbols),
            () => CircularDependencyChecker.check(importPath, symbols, currentFilePhysical, options),
            () => PathStyleChecker.check(importPath, currentFilePhysical, options),
          ];

          for (const check of checks) {
            const result = check();
            if (result) {
              context.report({
                node,
                message: result.message,
                fix: fixer => result.fix(fixer, node),
              });
              return; // Early return after first match
            }
          }
        },
      };
    },
  },
};
