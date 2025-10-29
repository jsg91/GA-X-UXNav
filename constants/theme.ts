/**
 * Tamagui theme configuration for cross-platform styling
 * This replaces the previous theme system with Tamagui tokens
 */

import { createAnimations } from '@tamagui/animations-react-native';
import { createFont, createTamagui, createTokens } from 'tamagui';

const tintColorLight = '#007AFF'; // iOS blue
const tintColorDark = '#0A84FF';  // iOS blue dark variant

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
  face: {
    300: { normal: 'Arial' },
    400: { normal: 'Arial' },
    500: { normal: 'Arial' },
    600: { normal: 'Arial' },
    700: { normal: 'Arial' },
    800: { normal: 'Arial' },
    900: { normal: 'Arial' },
  },
});

export const tokens = createTokens({
  color: {
    // Light theme colors
    light_text: '#000000',
    light_background: '#FFFFFF',
    light_tint: tintColorLight,
    light_icon: '#333333',
    light_tabIconDefault: '#666666',
    light_tabIconSelected: tintColorLight,
    light_border: 'rgba(0, 0, 0, 0.1)',
    light_shadow: 'rgba(0, 0, 0, 0.1)',
    light_outlineColor: 'rgba(0, 123, 255, 0.5)',
    // Dark theme colors - improved palette
    dark_text: '#F8F9FA', // Off-white for primary text
    dark_text_secondary: '#E9ECEF', // Lighter gray for secondary text
    dark_text_tertiary: '#ADB5BD', // Medium gray for tertiary text
    dark_background: '#0F1419', // Dark blue-gray background (instead of pure black)
    dark_background_secondary: '#1A1F23', // Slightly lighter for cards/containers
    dark_background_hover: '#1F2529', // For hover states
    dark_tint: tintColorDark,
    dark_icon: '#E9ECEF', // Lighter icons for better visibility
    dark_tabIconDefault: '#ADB5BD', // Medium gray for unselected tabs
    dark_tabIconSelected: tintColorDark,
    dark_border: 'rgba(255, 255, 255, 0.08)', // Subtle borders
    dark_border_hover: 'rgba(255, 255, 255, 0.12)', // Slightly more visible on hover
    dark_shadow: 'rgba(0, 0, 0, 0.4)', // Stronger shadows for depth
    dark_outlineColor: 'rgba(0, 123, 255, 0.7)',
    // Add missing tokens that themes reference
    tint: tintColorLight,
    color: '#000000',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    outlineColor: 'rgba(0, 123, 255, 0.5)',
  },
  space: {
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
  },
  size: {
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
    true: 16,
  },
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


// Create themes
export const lightTheme = {
  background: tokens.color.light_background,
  backgroundHover: '#f5f5f5',
  backgroundPress: '#e5e5e5',
  backgroundFocus: '#f0f0f0',
  color: tokens.color.light_text,
  colorHover: tokens.color.tint,
  colorPress: tokens.color.tint,
  colorFocus: tokens.color.tint,
  borderColor: tokens.color.light_border,
  borderColorHover: tokens.color.light_border,
  borderColorPress: tokens.color.tint,
  borderColorFocus: tokens.color.tint,
  shadowColor: tokens.color.light_shadow,
  shadowColorHover: tokens.color.light_shadow,
  shadowColorPress: tokens.color.light_shadow,
  shadowColorFocus: tokens.color.light_shadow,
  outlineColor: tokens.color.light_outlineColor,
  outlineColorHover: tokens.color.light_outlineColor,
  outlineColorPress: tokens.color.tint,
  outlineColorFocus: tokens.color.tint,
};

export const darkTheme = {
  background: tokens.color.dark_background,
  backgroundHover: tokens.color.dark_background_hover,
  backgroundPress: '#252B30', // Even lighter press state
  backgroundFocus: '#1F2529', // Consistent with hover
  backgroundSecondary: tokens.color.dark_background_secondary,
  backgroundSecondaryHover: '#20252A',
  backgroundSecondaryPress: '#272C31',
  backgroundSecondaryFocus: '#22272C',
  color: tokens.color.dark_text,
  colorSecondary: tokens.color.dark_text_secondary,
  colorTertiary: tokens.color.dark_text_tertiary,
  colorHover: tokens.color.dark_text_secondary,
  colorPress: tokens.color.tint,
  colorFocus: tokens.color.dark_text_secondary,
  borderColor: tokens.color.dark_border,
  borderColorHover: tokens.color.dark_border_hover,
  borderColorPress: tokens.color.tint,
  borderColorFocus: tokens.color.dark_border_hover,
  shadowColor: tokens.color.dark_shadow,
  shadowColorHover: 'rgba(0, 0, 0, 0.5)',
  shadowColorPress: 'rgba(0, 0, 0, 0.6)',
  shadowColorFocus: 'rgba(0, 0, 0, 0.5)',
  outlineColor: tokens.color.dark_outlineColor,
  outlineColorHover: tokens.color.dark_outlineColor,
  outlineColorPress: tokens.color.tint,
  outlineColorFocus: tokens.color.dark_outlineColor,
};

// Create animations using react-native-reanimated
const animations = createAnimations({
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  fast: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
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

// Export for backward compatibility - return plain strings
export const Colors = {
  light: {
    text: '#000000',
    textSecondary: '#000000',
    textTertiary: '#000000',
    background: '#FFFFFF',
    backgroundSecondary: '#FFFFFF',
    backgroundHover: '#FFFFFF',
    tint: tintColorLight,
    icon: '#333333',
    tabIconDefault: '#666666',
    tabIconSelected: tintColorLight,
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    text: '#F8F9FA',
    textSecondary: '#E9ECEF',
    textTertiary: '#ADB5BD',
    background: '#0F1419',
    backgroundSecondary: '#1A1F23',
    backgroundHover: '#1F2529',
    tint: tintColorDark,
    icon: '#E9ECEF',
    tabIconDefault: '#ADB5BD',
    tabIconSelected: tintColorDark,
    border: 'rgba(255, 255, 255, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
};

export const Fonts = {
  family: 'Arial, sans-serif',
};
