// ===== NAVIGATION CONSTANTS =====

// Global declarations for React Native environment
declare const __DEV__: boolean | undefined;

// Development mode detection (fallback for environments where __DEV__ is not defined)
const IS_DEV = typeof __DEV__ !== 'undefined' ? __DEV__ : (process.env.NODE_ENV || 'development') === 'development';

// Export for use in other modules
export { IS_DEV };

/**
 * Navigation system constants and default values
 * Centralizes magic numbers and configuration values
 */

// Performance thresholds
export const NAVIGATION_CONSTANTS = {
  // Performance monitoring
  SLOW_OPERATION_THRESHOLD_MS: 10,
  CACHE_MAX_SIZE: 100,

  // Navigation item defaults
  DEFAULT_NAV_ORDER: 0,
  DEFAULT_ICON: 'circle',

  // Route prefixes
  TABS_PREFIX: '/(tabs)/',

  // Cache TTL (in milliseconds)
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes

  // Validation limits
  MAX_NAVIGATION_ITEMS: 1000,
  MAX_CACHE_ENTRIES: 500,

  // Animation delays
  ANIMATION_DELAYS: {
    quick: 100,
    standard: 300,
    feedback: 500,
  } as const,
} as const;

// Default navigation item properties
export const NAVIGATION_DEFAULTS = {
  baseNavItem: {
    visible: true,
    order: NAVIGATION_CONSTANTS.DEFAULT_NAV_ORDER,
    icon: NAVIGATION_CONSTANTS.DEFAULT_ICON,
  } as const,

  role: {
    comingSoon: false,
    context: 'default' as const,
  } as const,

  contextConfig: {
    pages: {},
  } as const,
} as const;

// Error messages
export const NAVIGATION_ERRORS = {
  INVALID_ROUTE: 'Invalid route provided',
  ROUTE_NOT_FOUND: 'Route not found in registry',
  ROLE_NOT_FOUND: 'Role not found',
  CONTEXT_INVALID: 'Invalid context name',
  NAVIGATION_GENERATION_FAILED: 'Failed to generate navigation',
  CACHE_ERROR: 'Cache operation failed',
} as const;

// Accessibility labels and hints
export const NAVIGATION_ACCESSIBILITY = {
  navigationLabel: 'Main navigation',
  currentPageLabel: 'Current page',
  navigationHint: 'Use arrow keys to navigate',
  roleSelectorLabel: 'Select user role',
  menuButtonLabel: 'Open navigation menu',
} as const;

// Feature flags (for gradual rollout of features)
export const NAVIGATION_FEATURES = {
  ENABLE_PERFORMANCE_MONITORING: IS_DEV,
  ENABLE_NAVIGATION_CACHE: true,
  ENABLE_LAZY_LOADING: false, // Disabled by default for initial load performance
  ENABLE_RUNTIME_VALIDATION: IS_DEV,
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  navigationItems: {
    ttl: NAVIGATION_CONSTANTS.CACHE_TTL_MS,
    maxSize: NAVIGATION_CONSTANTS.MAX_CACHE_ENTRIES,
  },
  contextResolution: {
    ttl: NAVIGATION_CONSTANTS.CACHE_TTL_MS * 2, // Longer TTL for context
    maxSize: NAVIGATION_CONSTANTS.MAX_CACHE_ENTRIES,
  },
} as const;
