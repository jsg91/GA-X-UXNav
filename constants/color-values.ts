/**
 * Color value constants - SINGLE SOURCE OF TRUTH
 * 
 * Fix #7: All color values are defined here and used throughout the theme system
 * This file has no dependencies to avoid circular dependency issues
 */

// Fix #7: Define all color values as constants - single source of truth
// These constants are used in both tokens and fallbacks to eliminate duplication
export const COLOR_VALUES = {
  // Light theme colors
  light_text: '#000000',
  light_background: '#FFFFFF',
  light_background_secondary: '#F5F5F5',
  light_background_hover: '#f5f5f5',
  light_background_press: '#e5e5e5',
  light_background_focus: '#f0f0f0',
  light_icon: '#333333',
  light_tabIconDefault: '#666666',
  light_border: 'rgba(0, 0, 0, 0.1)',
  light_border_hover: 'rgba(0, 0, 0, 0.1)',
  light_shadow: 'rgba(0, 0, 0, 0.1)',
  light_outlineColor: 'rgba(0, 123, 255, 0.5)',
  // Dark theme colors
  dark_text: '#FFFFFF',
  dark_text_secondary: '#CCCCCC',
  dark_text_tertiary: '#808080',
  dark_background: '#000000',
  dark_background_secondary: '#1A1A1A',
  dark_background_hover: '#333333',
  dark_background_press: '#4D4D4D',
  dark_background_focus: '#333333',
  dark_background_secondary_hover: '#2A2A2A',
  dark_background_secondary_press: '#3A3A3A',
  dark_background_secondary_focus: '#2A2A2A',
  dark_icon: '#CCCCCC',
  dark_tabIconDefault: '#808080',
  dark_tabIconSelected: '#FFFFFF',
  dark_border: '#333333',
  dark_border_hover: '#666666',
  dark_shadow: 'rgba(0, 0, 0, 0.5)',
  dark_shadow_hover: 'rgba(0, 0, 0, 0.6)',
  dark_shadow_press: 'rgba(0, 0, 0, 0.7)',
  dark_shadow_focus: 'rgba(0, 0, 0, 0.6)',
  dark_outlineColor: '#808080',
} as const;

