/**
 * @fileoverview Shared barrel file analysis utilities for ESLint rules
 * @description Provides barrel file parsing, symbol resolution, and import splitting
 *
 * Used by:
 * - enforce-import-conventions (nearest barrel detection, circular dependency prevention)
 * - no-barrel-imports-within-module (barrel import splitting)
 *
 * @author GA-X Team
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ============================================================================
// CACHING
// ============================================================================

const barrelExportsCache = new Map();
const barrelAnalysisCache = new Map();

/**
 * Barrel file analyzer - shared utility for all barrel-related operations
 */
class BarrelAnalyzer {
  /**
   * Get all symbols exported from a barrel file
   */
  static getExports(barrelFilePath) {
    if (barrelExportsCache.has(barrelFilePath)) {
      return barrelExportsCache.get(barrelFilePath);
    }

    try {
      if (!fs.existsSync(barrelFilePath)) {
        barrelExportsCache.set(barrelFilePath, new Set());
        return new Set();
      }

      const content = fs.readFileSync(barrelFilePath, 'utf8');
      const exports = new Set();

      const patterns = [/export\s*{\s*([^}]+)\s*}\s*from/g, /export\s*{\s*default\s+as\s+(\w+)\s*}\s*from/g, /export\s*type\s*{\s*([^}]+)\s*}\s*from/g];

      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const exportList = match[1];
          const symbols = exportList.split(',').map(s => {
            const parts = s.trim().split(/\s+as\s+/);
            return parts.length > 1 ? parts[1].trim() : parts[0].trim();
          });
          symbols.forEach(symbol => {
            if (symbol && symbol !== 'default') {
              exports.add(symbol);
            }
          });
        }
      }

      barrelExportsCache.set(barrelFilePath, exports);
      return exports;
    } catch (_error) {
      barrelExportsCache.set(barrelFilePath, new Set());
      return new Set();
    }
  }

  /**
   * Analyze barrel file to build export-to-source mapping
   */
  static analyzeBarrel(barrelFilePath) {
    if (barrelAnalysisCache.has(barrelFilePath)) {
      return barrelAnalysisCache.get(barrelFilePath);
    }

    try {
      const content = fs.readFileSync(barrelFilePath, 'utf8');
      const exportMap = new Map();

      const lines = content.split('\n');
      let currentBlock = '';

      for (const line of lines) {
        const trimmed = line.trim();
        currentBlock += trimmed;

        if (trimmed.includes('from') && (trimmed.includes('"') || trimmed.includes("'"))) {
          this._processExportStatement(currentBlock, barrelFilePath, exportMap);
          currentBlock = '';
        } else if (trimmed.endsWith(';')) {
          this._processExportStatement(currentBlock, barrelFilePath, exportMap);
          currentBlock = '';
        }
      }

      if (currentBlock.trim()) {
        this._processExportStatement(currentBlock, barrelFilePath, exportMap);
      }

      barrelAnalysisCache.set(barrelFilePath, exportMap);
      return exportMap;
    } catch (_error) {
      barrelAnalysisCache.set(barrelFilePath, new Map());
      return new Map();
    }
  }

  /**
   * Process a single export statement
   */
  static _processExportStatement(statement, barrelFilePath, exportMap) {
    if (!statement.includes('export') || !statement.includes('from')) {
      return;
    }

    const patterns = [
      /export\s*{\s*([^}]+)\s*}\s*from\s*['"]([^'"]+)['"]/g,
      /export\s*{\s*default\s+as\s+(\w+)\s*}\s*from\s*['"]([^'"]+)['"]/g,
      /export\s*type\s*{\s*([^}]+)\s*}\s*from\s*['"]([^'"]+)['"]/g,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(statement)) !== null) {
        const exports = match[1].split(',').map(exp => exp.trim());
        const importPath = match[2];

        for (const exportName of exports) {
          const cleanName = exportName.split(' as ')[0].trim();
          if (cleanName) {
            const fullPath = this._resolveImportInBarrel(importPath, barrelFilePath);
            if (fullPath) {
              exportMap.set(cleanName, fullPath);
            }
          }
        }
      }
    }
  }

  /**
   * Resolve import path within barrel context
   */
  static _resolveImportInBarrel(importPath, barrelFilePath) {
    try {
      const projectRoot = process.cwd();
      let basePath;

      if (importPath.startsWith('@/')) {
        basePath = path.join(projectRoot, importPath.replace('@/', ''));
      } else {
        basePath = path.resolve(path.dirname(barrelFilePath), importPath);
      }

      const possiblePaths = [basePath + '.tsx', basePath + '.ts', basePath, path.join(basePath, 'index.tsx'), path.join(basePath, 'index.ts')];

      for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
          return testPath;
        }
      }
    } catch (_error) {
      return null;
    }

    return null;
  }

  /**
   * Find nearest barrel file that exports all given symbols
   */
  static findNearestWithSymbols(importPath, symbols) {
    if (!importPath.startsWith('@/')) {
      return null;
    }

    const projectRoot = process.cwd();
    const relativePath = importPath.replace('@/', '');
    const parts = relativePath.split('/');

    // Work up from parent of imported file
    for (let i = parts.length - 1; i > 0; i--) {
      const parentPath = parts.slice(0, i).join('/');
      const barrelPath = path.join(projectRoot, parentPath, 'index.ts');

      if (fs.existsSync(barrelPath)) {
        const exports = this.getExports(barrelPath);
        const allAvailable = symbols.every(symbol => exports.has(symbol));

        if (allAvailable) {
          // Check if this is a configured barrel directory
          const config = this._getBarrelConfig();
          const isConfigured = config.directories.some(dir => {
            const cleanDir = dir.replace('/*', '');
            return parentPath === cleanDir || parentPath.startsWith(cleanDir + '/');
          });

          if (isConfigured) {
            return `@/${parentPath}`;
          }
        }
      }
    }

    return null;
  }

  /**
   * Split barrel import into direct imports
   */
  static splitToDirectImports(barrelPath, symbols, currentFile) {
    const exportMap = this.analyzeBarrel(barrelPath);
    const importGroups = new Map();

    // Group symbols by source file
    for (const symbol of symbols) {
      const sourceFile = exportMap.get(symbol);
      if (sourceFile && fs.existsSync(sourceFile)) {
        if (!importGroups.has(sourceFile)) {
          importGroups.set(sourceFile, []);
        }
        importGroups.get(sourceFile).push(symbol);
      }
    }

    // Generate import statements
    const imports = [];
    for (const [sourceFile, syms] of importGroups) {
      const relativePath = this._getRelativePath(currentFile, sourceFile);
      const symbolList = syms.length === 1 ? syms[0] : syms.sort().join(', ');
      imports.push(`import { ${symbolList} } from '${relativePath}';`);
    }

    return imports;
  }

  /**
   * Get relative path between files
   */
  static _getRelativePath(fromFile, toFile) {
    const fromDir = path.dirname(fromFile);
    const relativePath = path.relative(fromDir, toFile);
    const normalized = relativePath.replace(/\\/g, '/');
    const withoutExt = normalized.replace(/\.(ts|tsx|js|jsx)$/, '');

    if (!withoutExt.startsWith('.')) {
      return `./${withoutExt}`;
    }
    return withoutExt;
  }

  /**
   * Get barrel configuration
   */
  static _getBarrelConfig() {
    try {
      const configPath = path.join(process.cwd(), 'XConfig', 'barrels.config.js');
      if (fs.existsSync(configPath)) {
        return require(configPath);
      }
    } catch (_error) {
      // Ignore
    }
    return { directories: [] };
  }

  /**
   * Clear all caches (for testing)
   */
  static clearCache() {
    barrelExportsCache.clear();
    barrelAnalysisCache.clear();
  }
}

module.exports = { BarrelAnalyzer };
