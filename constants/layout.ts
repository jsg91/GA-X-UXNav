/**
 * Layout constants
 * Centralized layout dimensions and breakpoints used across components
 */

/**
 * Standard header height used throughout the app
 */
export const HEADER_HEIGHT = 56;

/**
 * Standard header padding (matches Tamagui $3 = 12px)
 */
export const HEADER_PADDING = 12;

/**
 * Breakpoint for showing sidebar vs bottom navigation
 * Below this width, bottom navigation is shown; above, sidebar is shown
 */
export const SIDEBAR_BREAKPOINT = 768;

/**
 * Sidebar width when expanded
 */
export const SIDEBAR_EXPANDED_WIDTH = 240;

/**
 * Sidebar width when collapsed
 */
export const SIDEBAR_COLLAPSED_WIDTH = 72;

/**
 * Default panel margin from header (used for dropdowns/modals)
 */
export const PANEL_HEADER_MARGIN = 20;

/**
 * Default panel minimum height fallback (used when windowHeight is 0)
 */
export const PANEL_MIN_HEIGHT_FALLBACK = 600;

/**
 * Standard menu item minimum height
 */
export const MENU_ITEM_MIN_HEIGHT = 45;

/**
 * Standard icon sizes used in navigation components
 */
export const ICON_SIZES = {
  small: 18,
  medium: 20,
  large: 22,
  xlarge: 24,
} as const;

/**
 * Modal panel dimensions
 * Standard sizes for dropdown menus, modals, and side panels
 */
export const MODAL_PANEL_DIMENSIONS = {
  maxWidth: 380,
  minWidth: 280,
  maxHeightSearch: 320,
} as const;

/**
 * AI modal dimensions (responsive)
 */
export const AI_MODAL_DIMENSIONS = {
  maxWidthSidebar: 400,
  minWidthSidebar: 300,
  minHeight: 400,
  minHeightKeyboard: 200,
  minAvailableHeight: 200, // Minimum height for available space calculations
} as const;

