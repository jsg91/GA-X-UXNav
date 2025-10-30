/**
 * Tamagui theme configuration for cross-platform styling
 * This replaces the previous theme system with Tamagui tokens
 */

import { createAnimations } from '@tamagui/animations-react-native';
import { createFont, createTamagui, createTokens } from 'tamagui';

import { COLOR_VALUES } from './color-values';
import { DARK_FALLBACKS, DARK_SHADOW_VARIANTS, LIGHT_FALLBACKS } from './theme-fallbacks';

// Re-export for backward compatibility
export { COLOR_VALUES } from './color-values';

const tintColorLight = '#007AFF'; // iOS blue
// Note: Dark theme uses white (#FFFFFF) as tint, defined directly in tokens

// Font weight constants for reuse
const FONT_WEIGHTS = [300, 400, 500, 600, 700, 800, 900] as const;
const ARIAL_FACE = { normal: 'Arial' } as const;

// Create Arial font for all text
const arialFont = createFont({
  family: 'Arial, sans-serif',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 15,
    6: 16,
    7: 18,
    8: 20,
    9: 24,
    10: 30,
    11: 36,
    12: 48,
    true: 16,
  },
  lineHeight: {
    1: 14,
    2: 16,
    3: 18,
    4: 20,
    5: 22,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 42,
    11: 48,
    12: 60,
    true: 24,
  },
  weight: {
    1: '300',
    2: '400',
    3: '500',
    4: '600',
    5: '700',
    6: '800',
    7: '900',
    true: '400',
  },
  letterSpacing: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    true: 0,
  },
  // Generate font faces programmatically (Fix #5)
  face: Object.fromEntries(FONT_WEIGHTS.map(w => [w, ARIAL_FACE])) as Record<number, { normal: string }>,
});

// Shared spacing scale (Fix #3: Consolidate space/size tokens)
const spacingScale = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  true: 16, // default padding
} as const;

export const tokens = createTokens({
  color: {
    // Fix #7: Use COLOR_VALUES constants - single source of truth
    ...COLOR_VALUES,
    // Tint colors (derived, not in COLOR_VALUES since they use variables)
    light_tint: tintColorLight,
    light_tabIconSelected: tintColorLight,
    dark_tint: '#FFFFFF',
    // Add missing tokens that themes reference
    tint: tintColorLight,
    color: COLOR_VALUES.light_text,
    borderColor: COLOR_VALUES.light_border,
    shadowColor: COLOR_VALUES.light_shadow,
    outlineColor: COLOR_VALUES.light_outlineColor,
  },
  // Fix #3: Use shared spacing scale for both space and size
  space: spacingScale,
  size: spacingScale,
  radius: {
    0: 0,
    1: 2,
    2: 4,
    3: 6,
    4: 8,
    5: 10,
    6: 12,
    7: 14,
    8: 16,
    9: 18,
    10: 20,
    true: 8,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
});

/**
 * Create a theme object from tokens with optional overrides
 * This DRY approach ensures themes are generated consistently from tokens
 */
function createThemeFromTokens(
  mode: 'light' | 'dark',
  tokensObj: typeof tokens,
  overrides?: Partial<Record<string, string>>
) {
  const prefix = mode === 'light' ? 'light_' : 'dark_';
  const tint = mode === 'light' ? tokensObj.color.tint : tokensObj.color.dark_tint;

  // Helper to safely get token value with fallback
  const getToken = (key: string, fallback: string): string => {
    const tokenKey = `${prefix}${key}` as keyof typeof tokensObj.color;
    const value = tokensObj.color[tokenKey];
    return (typeof value === 'string' ? value : fallback);
  };

  const fallbacks = mode === 'light' ? LIGHT_FALLBACKS : DARK_FALLBACKS;

  const baseTheme = {
    background: getToken('background', fallbacks.background),
    backgroundHover: getToken('background_hover', fallbacks.background_hover),
    backgroundPress: getToken('background_press', fallbacks.background_press),
    backgroundFocus: getToken('background_focus', fallbacks.background_focus),
    color: getToken('text', fallbacks.text),
    colorHover: tint,
    colorPress: tint,
    colorFocus: tint,
    borderColor: getToken('border', fallbacks.border),
    borderColorHover: getToken('border_hover', fallbacks.border_hover),
    borderColorPress: tint,
    borderColorFocus: tint,
    shadowColor: getToken('shadow', fallbacks.shadow),
    shadowColorHover: getToken('shadow', mode === 'light' ? fallbacks.shadow : DARK_SHADOW_VARIANTS.hover),
    shadowColorPress: getToken('shadow', mode === 'light' ? fallbacks.shadow : DARK_SHADOW_VARIANTS.press),
    shadowColorFocus: getToken('shadow', mode === 'light' ? fallbacks.shadow : DARK_SHADOW_VARIANTS.focus),
    outlineColor: getToken('outlineColor', fallbacks.outlineColor),
    outlineColorHover: getToken('outlineColor', fallbacks.outlineColor),
    outlineColorPress: tint,
    outlineColorFocus: tint,
  };

  // Apply mode-specific properties
  if (mode === 'dark') {
    return {
      ...baseTheme,
      backgroundSecondary: tokensObj.color.dark_background_secondary,
      // Fix #7: Use tokens instead of hardcoded values
      backgroundSecondaryHover: tokensObj.color.dark_background_secondary_hover || '#2A2A2A',
      backgroundSecondaryPress: tokensObj.color.dark_background_secondary_press || '#3A3A3A',
      backgroundSecondaryFocus: tokensObj.color.dark_background_secondary_focus || '#2A2A2A',
      colorSecondary: tokensObj.color.dark_text_secondary,
      colorTertiary: tokensObj.color.dark_text_tertiary,
      borderColorHover: tokensObj.color.dark_border_hover,
      borderColorPress: tokensObj.color.dark_border_hover,
      borderColorFocus: tokensObj.color.dark_border_hover,
      outlineColorPress: tokensObj.color.dark_text_secondary,
      ...overrides,
    };
  }

  // Light theme with secondary background
  return {
    ...baseTheme,
    backgroundSecondary: tokensObj.color.light_background_secondary || '#F5F5F5',
    ...overrides,
  };
}

// Create themes using the helper function
export const lightTheme = createThemeFromTokens('light', tokens);
export const darkTheme = createThemeFromTokens('dark', tokens);

// Create animations using react-native-reanimated
// Shared spring configuration for animations with same values
const sharedSpringConfig = {
  damping: 20,
  mass: 1.2,
  stiffness: 250,
};

// Fix #4: Remove duplicate animation config (slow and lazy were identical)
const slowAnimationConfig = {
  type: 'spring' as const,
  damping: 20,
  stiffness: 60,
};

const animations = createAnimations({
  quick: {
    type: 'spring',
    ...sharedSpringConfig,
  },
  fast: {
    type: 'spring',
    ...sharedSpringConfig,
  },
  medium: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: slowAnimationConfig,
  // Remove lazy as it was identical to slow - use 'slow' instead
});

// Create Tamagui config
export const tamaguiConfig = createTamagui({
  tokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  defaultTheme: 'light',
  animations,
  fonts: {
    heading: arialFont,
    body: arialFont,
    mono: arialFont,
  },
  media: {
    xs: { maxWidth: 660 },
    sm: { minWidth: 660, maxWidth: 800 },
    md: { minWidth: 800, maxWidth: 1020 },
    lg: { minWidth: 1020, maxWidth: 1280 },
    xl: { minWidth: 1280, maxWidth: 1420 },
    xxl: { minWidth: 1420 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
  shorthands: {
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    p: 'padding',
    m: 'margin',
    w: 'width',
    h: 'height',
    bg: 'backgroundColor',
    br: 'borderRadius',
    bw: 'borderWidth',
    bc: 'borderColor',
    f: 'flex',
    fs: 'fontSize',
    fw: 'fontWeight',
    lh: 'lineHeight',
    ta: 'textAlign',
    jc: 'justifyContent',
    ai: 'alignItems',
    ac: 'alignContent',
    as: 'alignSelf',
    fg: 'flexGrow',
    fsh: 'flexShrink',
    fb: 'flexBasis',
    fd: 'flexDirection',
    fwr: 'flexWrap',
    pos: 'position',
    t: 'top',
    r: 'right',
    b: 'bottom',
    l: 'left',
    z: 'zIndex',
    o: 'opacity',
    ov: 'overflow',
    pe: 'pointerEvents',
  },
});

// Make sure to call this to setup the themes
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

// Export types
export type AppConfig = typeof tamaguiConfig;
export type Tokens = typeof tokens;

// Fix #1: Derive Colors export from tokens instead of duplicating values
// Helper to safely get token value with fallback
const getTokenColor = (key: keyof typeof tokens.color, fallback: string): string => {
  const value = tokens.color[key];
  return typeof value === 'string' ? value : fallback;
};

// Export for backward compatibility - derive from tokens instead of duplicating
export const Colors = {
  light: {
    text: getTokenColor('light_text', '#000000'),
    textSecondary: getTokenColor('light_text', '#000000'), // No separate token, use same as text
    textTertiary: getTokenColor('light_text', '#000000'), // No separate token, use same as text
    background: getTokenColor('light_background', '#FFFFFF'),
    backgroundSecondary: getTokenColor('light_background_secondary', '#F5F5F5'),
    backgroundHover: getTokenColor('light_background_hover', '#f5f5f5'),
    tint: getTokenColor('light_tint', tintColorLight),
    icon: getTokenColor('light_icon', '#333333'),
    tabIconDefault: getTokenColor('light_tabIconDefault', '#666666'),
    tabIconSelected: getTokenColor('light_tabIconSelected', tintColorLight),
    border: getTokenColor('light_border', 'rgba(0, 0, 0, 0.1)'),
    shadow: getTokenColor('light_shadow', 'rgba(0, 0, 0, 0.1)'),
  },
  dark: {
    text: getTokenColor('dark_text', '#FFFFFF'),
    textSecondary: getTokenColor('dark_text_secondary', '#CCCCCC'),
    textTertiary: getTokenColor('dark_text_tertiary', '#808080'),
    background: getTokenColor('dark_background', '#000000'),
    backgroundSecondary: getTokenColor('dark_background_secondary', '#1A1A1A'),
    backgroundHover: getTokenColor('dark_background_hover', '#333333'),
    tint: getTokenColor('dark_tint', '#FFFFFF'),
    icon: getTokenColor('dark_icon', '#CCCCCC'),
    tabIconDefault: getTokenColor('dark_tabIconDefault', '#808080'),
    tabIconSelected: getTokenColor('dark_tabIconSelected', '#FFFFFF'),
    border: getTokenColor('dark_border', '#333333'),
    shadow: getTokenColor('dark_shadow', 'rgba(0, 0, 0, 0.5)'),
  },
};

export const Fonts = {
  family: 'Arial, sans-serif',
};
