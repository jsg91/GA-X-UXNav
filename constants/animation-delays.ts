/**
 * Animation delay constants
 * Centralized delay values for consistent timing across animations and interactions
 */

/**
 * Delays in milliseconds for various animation and interaction timings
 */
export const ANIMATION_DELAYS = {
  /** Very short delay for immediate interactions (e.g., hover effects) */
  instant: 0,
  /** Short delay for smooth expansion (e.g., sidebar hover) */
  quick: 50,
  /** Standard delay for animations (e.g., scroll animations) */
  standard: 100,
  /** Medium delay for state transitions (e.g., sending message state) */
  medium: 150,
  /** Delay for blur operations (e.g., input blur) */
  blur: 200,
  /** Delay for search debouncing */
  searchDebounce: 300,
  /** Longer delay for async operations (e.g., AI response simulation) */
  async: 500,
  /** Long delay for user feedback (e.g., sidebar expansion after navigation) */
  feedback: 1000,
} as const;

