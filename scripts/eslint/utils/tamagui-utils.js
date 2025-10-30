// Utilities for extracting Tamagui color tokens from constants/theme.ts
const fs = require('fs');
const path = require('path');
const { extractBraceBlock } = require('./brace-counter');

/**
 * Centralized logger for ESLint utilities
 */
const logger = {
  warn: (message, ...args) => console.warn('ESLint Utils:', message, ...args),
};

/**
 * Extract color values from a string using regex patterns
 * Supports hex colors (#RRGGBB, #RGB), rgba(), rgb(), named colors, etc.
 */
function extractColorValues(text) {
  const colors = new Set();
  
  // Match hex colors: #RRGGBB or #RGB
  const hexRegex = /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/g;
  let match;
  while ((match = hexRegex.exec(text)) !== null) {
    const hex = match[0];
    // Normalize 3-digit hex to 6-digit
    if (hex.length === 4) {
      const r = hex[1];
      const g = hex[2];
      const b = hex[3];
      colors.add(`#${r}${r}${g}${g}${b}${b}`);
    } else {
      colors.add(hex.toUpperCase());
    }
  }
  
  // Match rgba() and rgb() colors
  const rgbaRegex = /rgba?\([^)]+\)/g;
  while ((match = rgbaRegex.exec(text)) !== null) {
    colors.add(match[0]);
  }
  
  // Match named colors (transparent, white, black, etc.)
  const namedColorRegex = /\b(transparent|white|black|red|green|blue|yellow|cyan|magenta)\b/gi;
  while ((match = namedColorRegex.exec(text)) !== null) {
    colors.add(match[0].toLowerCase());
  }
  
  return colors;
}

/**
 * Extract colors from tokens.color object
 * Matches: export const tokens = createTokens({ color: { ... } })
 */
function extractTokensColors(configContent) {
  const colors = new Set();
  
  // Find createTokens call with color property
  const tokensStartMatch = configContent.match(/color:\s*\{/);
  if (tokensStartMatch) {
    const colorBlock = extractBraceBlock(configContent, tokensStartMatch);
    if (colorBlock) {
      const extracted = extractColorValues(colorBlock);
      extracted.forEach(c => colors.add(c));
    }
  }
  
  return colors;
}

/**
 * Extract colors from the Colors export object
 * This is a backup source of color values
 */
function extractColorsExport(configContent) {
  const colors = new Set();
  
  // Find export const Colors = { ... }
  const colorsStartMatch = configContent.match(/export\s+const\s+Colors\s*=\s*\{/);
  if (colorsStartMatch) {
    const colorsBlock = extractBraceBlock(configContent, colorsStartMatch);
    if (colorsBlock) {
      const extracted = extractColorValues(colorsBlock);
      extracted.forEach(c => colors.add(c));
    }
  }
  
  return colors;
}

/**
 * Function to dynamically extract Tamagui color tokens from constants/theme.ts
 */
function getTamaguiColorTokens() {
  try {
    const configPath = path.join(process.cwd(), 'constants/theme.ts');
    
    // Check if file exists before attempting to read
    if (!fs.existsSync(configPath)) {
      return new Set();
    }
    
    const configContent = fs.readFileSync(configPath, 'utf8');
    const allColors = new Set();

    // Extract colors from tokens.color object (primary source)
    const tokensColors = extractTokensColors(configContent);
    tokensColors.forEach(c => allColors.add(c));

    // Extract colors from Colors export object (backup source)
    const colorsExport = extractColorsExport(configContent);
    colorsExport.forEach(c => allColors.add(c));

    return allColors;
  } catch (error) {
    logger.warn('Error reading constants/theme.ts:', error.message);
    return new Set();
  }
}

module.exports = {
  getTamaguiColorTokens,
};
