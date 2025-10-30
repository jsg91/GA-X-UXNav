/**
 * Shadow style constants
 * Centralized shadow configurations for consistent styling across components
 */

/**
 * Standard shadow configuration for modal panels
 * Used for dropdown menus, profile menu, role switcher, etc.
 */
export const MODAL_PANEL_SHADOW = {
  shadowColor: '$shadowColor',
  shadowOffset: { width: 2, height: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 10,
} as const;

/**
 * Shadow configuration for sidebar navigation
 */
export const SIDEBAR_SHADOW = {
  shadowColor: '$shadowColor',
  shadowOffset: { width: 1, height: 0 },
  shadowOpacity: 0.15,
  shadowRadius: 2,
} as const;

/**
 * Shadow configuration for bottom navigation bar
 */
export const BOTTOM_NAV_SHADOW = {
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: -1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
} as const;

/**
 * Shadow configuration for AI modal (responsive)
 */
export const AI_MODAL_SHADOW = {
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.25,
  shadowRadius: 10,
} as const;

/**
 * Shadow configuration for badges and small UI elements
 * Fix #7: Use token reference instead of hardcoded color
 */
export const BADGE_SHADOW = {
  shadowColor: '$shadowColor', // Use token instead of hardcoded rgba
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
} as const;

/**
 * Shadow configuration for search dropdown
 */
export const SEARCH_DROPDOWN_SHADOW = {
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
} as const;
