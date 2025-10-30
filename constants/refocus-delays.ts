/**
 * Refocus delay constants
 * Delays for multiple refocus attempts to ensure input focus works across platforms
 */

/**
 * Default delays for refocus attempts (in milliseconds)
 * Uses requestAnimationFrame for first attempt, then setTimeout for subsequent attempts
 */
export const REFOCUS_DELAYS = [0, 10, 50, 150] as const;

