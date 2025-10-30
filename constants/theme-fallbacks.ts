/**
 * Theme fallback values
 * Centralized fallback color values for theme creation
 * 
 * Fix #7: These now derive from COLOR_VALUES in color-values.ts - TRUE single source of truth
 * They are used as emergency fallbacks when tokens are not available
 * In practice, tokens should always exist, so these are rarely used
 */

import { COLOR_VALUES } from './color-values';

// Helper to safely get color value with fallback
const getColorValue = (key: keyof typeof COLOR_VALUES, fallback: string): string => {
  return COLOR_VALUES[key] || fallback;
};

// Fix #7: Derive fallbacks from COLOR_VALUES - no duplication!
export const LIGHT_FALLBACKS = {
  background: getColorValue('light_background', '#FFFFFF'),
  background_hover: getColorValue('light_background_hover', '#f5f5f5'),
  background_press: getColorValue('light_background_press', '#e5e5e5'),
  background_focus: getColorValue('light_background_focus', '#f0f0f0'),
  text: getColorValue('light_text', '#000000'),
  border: getColorValue('light_border', 'rgba(0, 0, 0, 0.1)'),
  border_hover: getColorValue('light_border_hover', 'rgba(0, 0, 0, 0.1)'),
  shadow: getColorValue('light_shadow', 'rgba(0, 0, 0, 0.1)'),
  outlineColor: getColorValue('light_outlineColor', 'rgba(0, 123, 255, 0.5)'),
} as const;

export const DARK_FALLBACKS = {
  background: getColorValue('dark_background', '#000000'),
  background_hover: getColorValue('dark_background_hover', '#333333'),
  background_press: getColorValue('dark_background_press', '#4D4D4D'),
  background_focus: getColorValue('dark_background_focus', '#333333'),
  text: getColorValue('dark_text', '#FFFFFF'),
  border: getColorValue('dark_border', '#333333'),
  border_hover: getColorValue('dark_border_hover', '#666666'),
  shadow: getColorValue('dark_shadow', 'rgba(0, 0, 0, 0.5)'),
  outlineColor: getColorValue('dark_outlineColor', '#808080'),
} as const;

// Additional shadow variants for dark theme - derive from COLOR_VALUES
export const DARK_SHADOW_VARIANTS = {
  hover: getColorValue('dark_shadow_hover', 'rgba(0, 0, 0, 0.6)'),
  press: getColorValue('dark_shadow_press', 'rgba(0, 0, 0, 0.7)'),
  focus: getColorValue('dark_shadow_focus', 'rgba(0, 0, 0, 0.6)'),
} as const;

