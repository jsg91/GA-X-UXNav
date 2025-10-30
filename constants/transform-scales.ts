/**
 * Transform scale constants
 * Centralized scale values for consistent hover and press interactions
 */

/**
 * Scale values for interactive transformations
 * Used for hover, press, and focus feedback effects
 */
export const TRANSFORM_SCALES = {
  /** Scale up on hover (subtle feedback) */
  hover: 1.02,
  /** Scale down on press (click feedback) */
  press: 0.98,
  /** Initial scale for entrance animations */
  initial: 0.95,
  /** Default/normal scale */
  normal: 1,
} as const;

