/**
 * Z-index constants
 * Centralized z-index values for consistent layering across components
 * Lower values appear behind higher values
 */

/**
 * Z-index values for different UI layers
 * Organized from lowest (background) to highest (overlay)
 */
export const Z_INDEX = {
  /** Base layer (background content) */
  base: 0,
  /** Sidebar navigation layer */
  sidebar: 1000,
  /** Search dropdown layer (above sidebar) */
  searchDropdown: 1001,
  /** AI modal overlay layer (highest) */
  aiModalOverlay: 9998,
} as const;

