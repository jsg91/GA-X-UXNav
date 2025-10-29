// Utilities for extracting Tamagui color tokens from XConfig/tamagui.config.ts
const fs = require('fs');
const path = require('path');

/**
 * Centralized logger for ESLint utilities
 */
const logger = {
  warn: (message, ...args) => console.warn('ESLint Utils:', message, ...args),
};

/**
 * Function to dynamically extract Tamagui color tokens
 */
function getTamaguiColorTokens() {
  try {
    const configPath = path.join(process.cwd(), 'XConfig/tamagui.config.ts');
    const configContent = fs.readFileSync(configPath, 'utf8');

    const allColors = [];

    // Extract base color tokens
    const baseColorRegex = /color:\s*{([^}]*)}/s;
    const baseMatch = configContent.match(baseColorRegex);

    if (baseMatch) {
      const colorBlock = baseMatch[1];
      const colorRegex = /(\w+):\s*'([^']+)'|"([^"]+)"/g;

      let colorMatch;
      while ((colorMatch = colorRegex.exec(colorBlock)) !== null) {
        const colorValue = colorMatch[2] || colorMatch[3];
        if (colorValue && colorValue.match(/^#[0-9A-Fa-f]{6}$/i)) {
          allColors.push(colorValue);
        }
      }
    }

    // Extract theme-specific colors from light and dark themes
    const lightThemeRegex = /light:\s*{([^}]*)}/s;
    const darkThemeRegex = /dark:\s*{([^}]*)}/s;

    const lightMatch = configContent.match(lightThemeRegex);
    const darkMatch = configContent.match(darkThemeRegex);

    if (lightMatch) {
      const themeColors = extractThemeColors(lightMatch[1]);
      allColors.push(...themeColors);
    }

    if (darkMatch) {
      const themeColors = extractThemeColors(darkMatch[1]);
      allColors.push(...themeColors);
    }

    // Remove duplicates and return Set for better performance
    return new Set(allColors);
  } catch (error) {
    logger.warn('Error reading XConfig/tamagui.config.ts:', error.message);
    return new Set();
  }
}

/**
 * Helper function to extract color values from theme objects
 */
function extractThemeColors(themeBlock) {
  const colors = [];
  const colorRegex = /(\w+):\s*'([^']+)'|"([^"]+)"/g;

  let colorMatch;
  while ((colorMatch = colorRegex.exec(themeBlock)) !== null) {
    const colorValue = colorMatch[2] || colorMatch[3];
    if (colorValue && colorValue.match(/^#[0-9A-Fa-f]{6}$/i)) {
      colors.push(colorValue);
    }
  }

  return colors;
}

module.exports = {
  getTamaguiColorTokens,
};
