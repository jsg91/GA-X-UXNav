/**
 * Opacity constants
 * Centralized opacity values for consistent visual hierarchy
 */

/**
 * Opacity values for different UI elements and states
 */
export const OPACITY = {
  /** Fully opaque (active/selected states) */
  full: 1,
  /** Slightly transparent (subtle elements) */
  subtle: 0.8,
  /** Medium transparency (secondary elements) */
  medium: 0.7,
  /** More transparent (tertiary/inactive elements) */
  light: 0.6,
  /** Very transparent (disabled/placeholder elements) */
  veryLight: 0.5,
  /** Semi-transparent (background overlays) */
  semiTransparent: 0.4,
  /** Mostly transparent (hover indicators) */
  faded: 0.3,
  /** Almost transparent */
  veryFaded: 0.2,
  /** Nearly invisible */
  almostInvisible: 0.1,
  /** Completely transparent */
  transparent: 0,
} as const;

