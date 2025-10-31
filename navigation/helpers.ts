import { BaseNavItem, PageInfo, Role } from './types';
import { NAVIGATION_CONSTANTS, NAVIGATION_DEFAULTS, NAVIGATION_ERRORS, IS_DEV } from './constants';

// ===== OPTIMIZED HELPER FUNCTIONS =====

/**
 * Generate a page description from a page name
 * Centralized description formatting
 */
function getPageDescription(name: string): string {
  return `${name} page`;
}

/**
 * Get page information for a navigation item from NAVIGATION_CONFIG
 * Optimized with O(1) lookups using Maps instead of array searches
 */
export function getPageInfoFromNavConfig(routeId: string): PageInfo | null {
  try {
    // Import here to avoid circular dependency
    const { getTabBarItem, getProfileMenuItem } = require('./config');

    // Validate input
    if (!routeId || typeof routeId !== 'string') {
      console.warn('Invalid routeId provided to getPageInfoFromNavConfig:', routeId);
      return null;
    }

    // Special routes for top nav buttons (O(1) lookup)
    const specialRoutes: Record<string, PageInfo> = {
      notifications: {
        title: 'Notifications',
        icon: 'bell',
        description: 'View your notifications'
      },
      messages: {
        title: 'Messages',
        icon: 'message-text',
        description: 'View your messages'
      },
      news: {
        title: 'Aviation News',
        icon: 'newspaper',
        description: 'Latest aviation news, weather updates, and regulatory changes'
      }
    };

    if (routeId in specialRoutes) {
      return specialRoutes[routeId as keyof typeof specialRoutes];
    }

    // O(1) lookups using Maps
    const tabItem = getTabBarItem(routeId);
    if (tabItem) {
      return {
        title: tabItem.name,
        icon: tabItem.icon,
        description: getPageDescription(tabItem.name)
      };
    }

    const profileItem = getProfileMenuItem(routeId);
    if (profileItem) {
      return {
        title: profileItem.name,
        icon: profileItem.icon,
        description: getPageDescription(profileItem.name)
      };
    }

    return null;
  } catch (error) {
    console.error('Error in getPageInfoFromNavConfig:', error);
    return null;
  }
}

/**
 * Filter navigation items by visibility
 * @param items - Array of navigation items (supports readonly arrays)
 * @returns Filtered array of visible items
 */
export function filterVisibleItems<T extends { visible: boolean }>(items: readonly T[] | T[]): T[] {
  return (items.filter(item => item.visible) as T[]);
}

/**
 * Extract href from a navigation item
 * Handles both GeneratedNavItem (always has href as string) and legacy BaseNavItem types
 */
export function getItemHref(item: { href?: string | null }): string | null {
  return item.href || null;
}

/**
 * Check if a navigation tab is currently active based on href and pathname
 * @param href - The href path of the navigation item (e.g., '/(tabs)/logbook')
 * @param pathname - The current pathname from the router
 * @returns true if the tab is active, false otherwise
 */
export function isTabActive(href: string | null | undefined, pathname: string): boolean {
  if (!href) return false;
  // Handle root path
  if (href === '/(tabs)/' && pathname === '/') return true;
  // Exact match first
  if (href === pathname) return true;
  // For tab paths, check if pathname starts with the route (more precise than includes)
  // Only process if href starts with the route prefix
  if (href.startsWith('/(tabs)/')) {
    const routeWithoutPrefix = href.replace('/(tabs)/', '');
    if (routeWithoutPrefix && pathname.startsWith(`/${routeWithoutPrefix}`)) {
      // Ensure we're matching a complete route segment, not part of another route
      // Check the character after the route to ensure it's a valid separator
      const nextChar = pathname[routeWithoutPrefix.length + 1];
      return !nextChar || nextChar === '/' || nextChar === '?';
    }
  }
  return false;
}

/**
 * Navigation validation utilities
 */

/**
 * Check if an item is a valid navigation item
 */
export function isValidBaseNavItem(item: any): item is BaseNavItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.icon === 'string' &&
    typeof item.visible === 'boolean' &&
    typeof item.order === 'number'
  );
}

/**
 * Safe navigation item access with fallbacks
 */
export function safeGetNavigationItem(
  items: BaseNavItem[],
  id: string,
  fallback?: Partial<BaseNavItem>
): BaseNavItem | null {
  const item = items.find(item => item.id === id);
  if (item) return item;

  if (fallback) {
    return {
      id: fallback.id || id,
      name: fallback.name || id,
      href: fallback.href || null,
      icon: fallback.icon || 'help-circle',
      visible: fallback.visible ?? false,
      order: fallback.order ?? 999,
      ...fallback
    };
  }

  return null;
}

/**
 * Create a navigation item with defaults
 */
export function createNavigationItem(
  id: string,
  overrides: Partial<BaseNavItem> = {}
): BaseNavItem {
  return {
    id,
    name: overrides.name || id,
    href: overrides.href || null,
    icon: overrides.icon || NAVIGATION_CONSTANTS.DEFAULT_ICON,
    visible: overrides.visible ?? NAVIGATION_DEFAULTS.baseNavItem.visible,
    order: overrides.order ?? NAVIGATION_DEFAULTS.baseNavItem.order,
    ...overrides
  };
}

/**
 * Validate navigation configuration
 */
export function validateNavigationConfig() {
  const { getTabBarItems, NAVIGATION_CONFIG } = require('./config');

  const tabBarItems = getTabBarItems();
  const profileMenuItems = NAVIGATION_CONFIG.profileMenu.items;

  // Check for duplicate IDs
  const allIds = [...tabBarItems.map(item => item.id), ...profileMenuItems.map(item => item.id)];
  const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index);

  if (duplicates.length > 0) {
    console.warn('Duplicate navigation item IDs found:', duplicates);
  }

  // Validate item structure
  const invalidItems = [
    ...tabBarItems.filter(item => !isValidBaseNavItem(item)),
    ...profileMenuItems.filter(item => !isValidBaseNavItem(item))
  ];

  if (invalidItems.length > 0) {
    console.error('Invalid navigation items found:', invalidItems);
  }

  return {
    isValid: duplicates.length === 0 && invalidItems.length === 0,
    duplicates,
    invalidItems
  };
}

/**
 * Simple performance monitoring for development
 * Only active in development mode
 */
class NavigationPerformanceMonitor {
  private static instance: NavigationPerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private enabled = IS_DEV; // Only enabled in development

  static getInstance(): NavigationPerformanceMonitor {
    if (!NavigationPerformanceMonitor.instance) {
      NavigationPerformanceMonitor.instance = new NavigationPerformanceMonitor();
    }
    return NavigationPerformanceMonitor.instance;
  }

  measure<T>(operation: string, fn: () => T): T {
    if (!this.enabled) return fn();

    const start = performance.now();
    try {
      return fn();
    } finally {
      const duration = performance.now() - start;
      if (duration > 10) { // Only log slow operations (>10ms)
        console.debug(`Navigation: ${operation} took ${duration.toFixed(2)}ms`);
      }
    }
  }

  // Simple metrics for critical operations
  getMetrics(operation: string) {
    if (!this.enabled) return null;
    const measurements = this.metrics.get(operation) || [];
    if (measurements.length === 0) return null;

    const sum = measurements.reduce((a, b) => a + b, 0);
    return {
      count: measurements.length,
      average: sum / measurements.length,
      max: Math.max(...measurements),
    };
  }
}

/**
 * Optional performance monitoring wrapper
 * Only active in development builds
 */
export function withPerformanceMonitoring<T extends (...args: any[]) => any>(
  fn: T,
  operationName: string
): T {
  if (!IS_DEV) return fn; // Return original function in production

  const monitor = NavigationPerformanceMonitor.getInstance();
  return ((...args: Parameters<T>) => {
    return monitor.measure(operationName, () => fn(...args));
  }) as T;
}

// ===== ERROR BOUNDARIES & RECOVERY =====

/**
 * Navigation error types for better error handling
 */
export enum NavigationErrorType {
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_DATA = 'MISSING_DATA',
  GENERATION_FAILED = 'GENERATION_FAILED',
  CACHE_ERROR = 'CACHE_ERROR',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

/**
 * Navigation error class for structured error handling
 */
export class NavigationError extends Error {
  constructor(
    public type: NavigationErrorType,
    message: string,
    public originalError?: Error,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'NavigationError';
  }
}

/**
 * Error boundary wrapper for navigation operations
 * Provides fallback behavior when navigation operations fail
 */
export function withNavigationErrorBoundary<T>(
  operation: () => T,
  fallback: T,
  operationName: string
): T {
  try {
    return operation();
  } catch (error) {
    console.error(`Navigation error in ${operationName}:`, error);

    // Log structured error for monitoring
    const navError = error instanceof NavigationError ? error : new NavigationError(
      NavigationErrorType.GENERATION_FAILED,
      `Navigation operation "${operationName}" failed`,
      error as Error,
      { operationName, timestamp: Date.now() }
    );

    // In development, re-throw for debugging
    if (IS_DEV) {
      throw navError;
    }

    // In production, return fallback and continue
    return fallback;
  }
}

/**
 * Safe navigation operation wrapper with retry logic
 */
export function withRetry<T>(
  operation: () => T,
  maxRetries: number = 2,
  fallback: T
): T {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Navigation operation failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error);

      // Don't retry on validation errors
      if (error instanceof NavigationError &&
          error.type === NavigationErrorType.INVALID_INPUT) {
        break;
      }
    }
  }

  // All retries failed, return fallback
  console.error('Navigation operation failed after all retries, using fallback');
  return fallback;
}

/**
 * Recovery mechanisms for common navigation failures
 */
export const NavigationRecovery = {
  /**
   * Get fallback navigation items when generation fails
   */
  getFallbackNavigation(): BaseNavItem[] {
    return [
      createNavigationItem('dashboard', {
        name: 'Dashboard',
        href: '/',
        icon: 'view-dashboard',
        order: 0,
      }),
      createNavigationItem('settings', {
        name: 'Settings',
        href: '/settings',
        icon: 'cog',
        order: 1,
      }),
    ];
  },

  /**
   * Get fallback page info when lookup fails
   */
  getFallbackPageInfo(routeId: string): PageInfo {
    return {
      title: routeId,
      icon: NAVIGATION_CONSTANTS.DEFAULT_ICON,
      description: `Page: ${routeId}`,
    };
  },

  /**
   * Validate and sanitize navigation input
   */
  sanitizeInput(input: any, type: 'string' | 'object' | 'array'): any {
    if (type === 'string') {
      return typeof input === 'string' ? input.trim() : '';
    }
    if (type === 'object') {
      return (typeof input === 'object' && input !== null) ? input : {};
    }
    if (type === 'array') {
      return Array.isArray(input) ? input : [];
    }
    return input;
  },
};

/**
 * Circuit breaker for navigation operations
 * Prevents cascading failures by temporarily disabling problematic operations
 */
export class NavigationCircuitBreaker {
  private failures = new Map<string, number>();
  private lastFailureTime = new Map<string, number>();
  private readonly FAILURE_THRESHOLD = NAVIGATION_CONSTANTS.CACHE_MAX_SIZE / 10; // 10% of cache size
  private readonly RECOVERY_TIMEOUT_MS = 30000; // 30 seconds

  isOpen(operationId: string): boolean {
    const failures = this.failures.get(operationId) || 0;
    const lastFailure = this.lastFailureTime.get(operationId) || 0;
    const timeSinceLastFailure = Date.now() - lastFailure;

    // Circuit is open if we've had too many failures recently
    if (failures >= this.FAILURE_THRESHOLD && timeSinceLastFailure < this.RECOVERY_TIMEOUT_MS) {
      return true;
    }

    // Reset if enough time has passed
    if (timeSinceLastFailure >= this.RECOVERY_TIMEOUT_MS) {
      this.failures.delete(operationId);
      this.lastFailureTime.delete(operationId);
    }

    return false;
  }

  recordFailure(operationId: string): void {
    const currentFailures = this.failures.get(operationId) || 0;
    this.failures.set(operationId, currentFailures + 1);
    this.lastFailureTime.set(operationId, Date.now());
  }

  recordSuccess(operationId: string): void {
    // Reset on success
    this.failures.delete(operationId);
    this.lastFailureTime.delete(operationId);
  }
}

// Global circuit breaker instance
export const navigationCircuitBreaker = new NavigationCircuitBreaker();
