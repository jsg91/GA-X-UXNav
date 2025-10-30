/**
 * Interactive color utilities
 * Centralized color values for hover, press, and interactive states
 */

/**
 * Color values for interactive button states
 * Used for hover, press, and focus effects across components
 */
export const INTERACTIVE_COLORS = {
  // Generic hover/press states (dark overlay)
  hover: 'rgba(0, 0, 0, 0.05)',
  press: 'rgba(0, 0, 0, 0.1)',
  
  // Tint-based interactive states (blue overlay)
  tintHover: 'rgba(0, 122, 255, 0.08)',
  tintPress: 'rgba(0, 122, 255, 0.12)',
  tintBackground: 'rgba(0, 122, 255, 0.1)',
  tintBorder: 'rgba(0, 122, 255, 0.3)',
  tintBorderHover: 'rgba(0, 122, 255, 0.5)',
  tintBackgroundHover: 'rgba(0, 122, 255, 0.15)',
  tintBackgroundPress: 'rgba(0, 122, 255, 0.2)',
  
  // Search bar interactive states
  searchBackground: 'rgba(0, 0, 0, 0.03)',
  searchBackgroundHover: 'rgba(0, 0, 0, 0.06)',
  searchBackgroundPress: 'rgba(0, 0, 0, 0.08)',
  searchBorder: 'rgba(0, 0, 0, 0.1)',
  searchBorderFocus: 'rgba(0, 122, 255, 0.5)',
  searchBorderHover: 'rgba(0, 122, 255, 0.3)',
  
  // Modal overlay
  modalOverlay: 'rgba(0, 0, 0, 0.4)',
  
  // Group header background
  groupHeaderBackground: 'rgba(0, 0, 0, 0.02)',
  groupHeaderBorder: 'rgba(0, 0, 0, 0.08)',
} as const;

/**
 * Destructive/danger colors for logout and critical actions
 */
export const DESTRUCTIVE_COLORS = {
  light: '#FF3B30',
  dark: '#FF453A',
} as const;

/**
 * Get destructive color based on theme
 */
export function getDestructiveColor(isDark: boolean): string {
  return isDark ? DESTRUCTIVE_COLORS.dark : DESTRUCTIVE_COLORS.light;
}

/**
 * Get theme-aware tint background color
 * In dark mode, uses white/gray. In light mode, uses blue.
 */
export function getTintBackground(isDark: boolean): string {
  return isDark ? 'rgba(255, 255, 255, 0.1)' : INTERACTIVE_COLORS.tintBackground;
}

/**
 * Get theme-aware tint border color
 * In dark mode, uses white/gray. In light mode, uses blue.
 */
export function getTintBorder(isDark: boolean): string {
  return isDark ? 'rgba(255, 255, 255, 0.3)' : INTERACTIVE_COLORS.tintBorder;
}

/**
 * Get theme-aware tint background hover color
 */
export function getTintBackgroundHover(isDark: boolean): string {
  return isDark ? 'rgba(255, 255, 255, 0.15)' : INTERACTIVE_COLORS.tintBackgroundHover;
}

/**
 * Get theme-aware tint border hover color
 */
export function getTintBorderHover(isDark: boolean): string {
  return isDark ? 'rgba(255, 255, 255, 0.5)' : INTERACTIVE_COLORS.tintBorderHover;
}

/**
 * Get theme-aware tint background press color
 */
export function getTintBackgroundPress(isDark: boolean): string {
  return isDark ? 'rgba(255, 255, 255, 0.2)' : INTERACTIVE_COLORS.tintBackgroundPress;
}

