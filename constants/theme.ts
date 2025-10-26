/**
 * Tamagui theme configuration for cross-platform styling
 * This replaces the previous theme system with Tamagui tokens
 */

import { createTamagui, createTokens } from 'tamagui';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const tokens = createTokens({
  color: {
    // Light theme colors
    light_text: '#11181C',
    light_background: '#fff',
    light_tint: tintColorLight,
    light_icon: '#687076',
    light_tabIconDefault: '#687076',
    light_tabIconSelected: tintColorLight,
    light_border: 'rgba(0, 0, 0, 0.1)',
    light_shadow: 'rgba(0, 0, 0, 0.1)',
    // Dark theme colors
    dark_text: '#ECEDEE',
    dark_background: '#151718',
    dark_tint: tintColorDark,
    dark_icon: '#9BA1A6',
    dark_tabIconDefault: '#9BA1A6',
    dark_tabIconSelected: tintColorDark,
    dark_border: 'rgba(255, 255, 255, 0.1)',
    dark_shadow: 'rgba(0, 0, 0, 0.3)',
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
  font: {
    sans: 'Arial, sans-serif',
    mono: 'Arial, monospace',
  },
  fontSize: {
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
  fontWeight: {
    1: '300',
    2: '400',
    3: '500',
    4: '600',
    5: '700',
    6: '800',
    7: '900',
    true: '400',
  },
  lineHeight: {
    1: 11,
    2: 12,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 42,
    11: 48,
    12: 60,
    true: 24,
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
  colorHover: tokens.color.light_tint,
  colorPress: tokens.color.light_tint,
  colorFocus: tokens.color.light_tint,
  borderColor: tokens.color.light_border,
  borderColorHover: tokens.color.light_border,
  borderColorPress: tokens.color.light_tint,
  borderColorFocus: tokens.color.light_tint,
  shadowColor: tokens.color.light_shadow,
  shadowColorHover: tokens.color.light_shadow,
  shadowColorPress: tokens.color.light_shadow,
  shadowColorFocus: tokens.color.light_shadow,
};

export const darkTheme = {
  background: tokens.color.dark_background,
  backgroundHover: '#2a2a2a',
  backgroundPress: '#3a3a3a',
  backgroundFocus: '#2f2f2f',
  color: tokens.color.dark_text,
  colorHover: tokens.color.dark_tint,
  colorPress: tokens.color.dark_tint,
  colorFocus: tokens.color.dark_tint,
  borderColor: tokens.color.dark_border,
  borderColorHover: tokens.color.dark_border,
  borderColorPress: tokens.color.dark_tint,
  borderColorFocus: tokens.color.dark_tint,
  shadowColor: tokens.color.dark_shadow,
  shadowColorHover: tokens.color.dark_shadow,
  shadowColorPress: tokens.color.dark_shadow,
  shadowColorFocus: tokens.color.dark_shadow,
};

// Create Tamagui config
export const tamaguiConfig = createTamagui({
  tokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  defaultTheme: 'light',
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
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = tokens.font.sans;
