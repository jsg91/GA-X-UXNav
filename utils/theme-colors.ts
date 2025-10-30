/**
 * Theme color mapping utilities
 * Provides consistent color key mappings for themed components
 */

/**
 * Text color key mapping based on level
 */
export const TEXT_COLOR_MAP = {
  primary: 'text',
  secondary: 'textSecondary',
  tertiary: 'textTertiary',
} as const;

/**
 * Background color key mapping based on variant
 */
export const BG_COLOR_MAP = {
  primary: 'background',
  secondary: 'backgroundSecondary',
} as const;

/**
 * Get the color key for text based on level
 */
export function getTextColorKey(level: keyof typeof TEXT_COLOR_MAP): string {
  return TEXT_COLOR_MAP[level];
}

/**
 * Get the color key for background based on variant
 */
export function getBackgroundColorKey(variant: keyof typeof BG_COLOR_MAP): string {
  return BG_COLOR_MAP[variant];
}

