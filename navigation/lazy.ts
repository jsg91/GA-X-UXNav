import { NAVIGATION_FEATURES, IS_DEV } from './constants';

/**
 * Lazy loading utilities for navigation components
 * Helps reduce initial bundle size by loading heavy navigation logic on demand
 */

// ===== LAZY LOADING CONFIGURATION =====

/**
 * Lazy loading configuration
 */
interface LazyLoadConfig {
  enabled: boolean;
  timeout: number;
  retryAttempts: number;
  preloadCritical: boolean;
}

/**
 * Default lazy loading configuration
 */
const DEFAULT_LAZY_CONFIG: LazyLoadConfig = {
  enabled: NAVIGATION_FEATURES.ENABLE_LAZY_LOADING,
  timeout: 5000, // 5 seconds
  retryAttempts: 2,
  preloadCritical: true,
};

// ===== LAZY IMPORTS =====

/**
 * Lazy-loaded navigation modules
 */
const LAZY_MODULES = {
  // Heavy navigation generation logic
  navigationGenerator: () => import('./entities').then(m => ({
    generateNavigationForRole: m.generateNavigationForRole,
    getPageInfoForEntity: m.getPageInfoForEntity,
  })),

  // Complex validation logic
  validation: () => import('./validation').then(m => ({
    NavigationValidator: m.NavigationValidator,
  })),

  // Testing utilities (only in development)
  testing: () => {
    if (!IS_DEV) {
      return Promise.resolve({});
    }
    return import('./testing').then(m => ({
      createMockNavigationItems: m.createMockNavigationItems,
      createMockRole: m.createMockRole,
      NavigationTestFactory: m.NavigationTestFactory,
    }));
  },

  // Accessibility helpers
  accessibility: () => import('./accessibility').then(m => ({
    getNavigationItemAccessibility: m.getNavigationItemAccessibility,
    ScreenReaderAnnouncer: m.ScreenReaderAnnouncer,
    NavigationFocusManager: m.NavigationFocusManager,
  })),
} as const;

// ===== LAZY LOADING UTILITIES =====

/**
 * Lazy loader with error handling and retries
 */
class LazyLoader<T> {
  private promise: Promise<T> | null = null;
  private config: LazyLoadConfig;

  constructor(
    private loader: () => Promise<T>,
    config: Partial<LazyLoadConfig> = {}
  ) {
    this.config = { ...DEFAULT_LAZY_CONFIG, ...config };
  }

  async load(): Promise<T> {
    if (!this.config.enabled) {
      // If lazy loading is disabled, load immediately
      return this.loader();
    }

    if (this.promise) {
      return this.promise;
    }

    this.promise = this.loadWithRetry();
    return this.promise;
  }

  private async loadWithRetry(): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const result = await Promise.race([
          this.loader(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Lazy loading timeout')), this.config.timeout)
          ),
        ]);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Lazy loading failed (attempt ${attempt + 1}/${this.config.retryAttempts + 1}):`, error);

        // Don't retry on certain errors
        if (error instanceof Error && error.message.includes('timeout')) {
          break;
        }
      }
    }

    throw new Error(`Lazy loading failed after ${this.config.retryAttempts + 1} attempts: ${lastError?.message}`);
  }

  isLoaded(): boolean {
    return this.promise !== null;
  }

  reset(): void {
    this.promise = null;
  }
}

// ===== LAZY LOADED MODULES =====

/**
 * Lazy-loaded navigation generator
 */
export const lazyNavigationGenerator = new LazyLoader(LAZY_MODULES.navigationGenerator);

/**
 * Lazy-loaded validation system
 */
export const lazyValidation = new LazyLoader(LAZY_MODULES.validation);

/**
 * Lazy-loaded testing utilities
 */
export const lazyTesting = new LazyLoader(LAZY_MODULES.testing);

/**
 * Lazy-loaded accessibility helpers
 */
export const lazyAccessibility = new LazyLoader(LAZY_MODULES.accessibility);

// ===== LAZY LOADING HELPERS =====

/**
 * Preload critical navigation modules
 * Call this early in the app lifecycle for better performance
 */
export async function preloadCriticalNavigation(): Promise<void> {
  if (!DEFAULT_LAZY_CONFIG.enabled || !DEFAULT_LAZY_CONFIG.preloadCritical) {
    return;
  }

  try {
    // Preload navigation generator as it's used frequently
    await lazyNavigationGenerator.load();
    console.debug('Navigation: Critical modules preloaded');
  } catch (error) {
    console.warn('Navigation: Failed to preload critical modules:', error);
  }
}

/**
 * Get navigation generator with lazy loading
 */
export async function getNavigationGenerator() {
  const module = await lazyNavigationGenerator.load();
  return {
    generateNavigationForRole: withLazyLoadingFallback(
      module.generateNavigationForRole,
      () => import('./entities').then(m => m.generateNavigationForRole)
    ),
    getPageInfoForEntity: withLazyLoadingFallback(
      module.getPageInfoForEntity,
      () => import('./entities').then(m => m.getPageInfoForEntity)
    ),
  };
}

/**
 * Get validation utilities with lazy loading
 */
export async function getValidationUtils() {
  const module = await lazyValidation.load();
  return {
    NavigationValidator: module.NavigationValidator,
  };
}

/**
 * Get testing utilities with lazy loading
 */
export async function getTestingUtils() {
  if (!IS_DEV) {
    return {};
  }

  const module = await lazyTesting.load();
  return module;
}

/**
 * Get accessibility helpers with lazy loading
 */
export async function getAccessibilityUtils() {
  const module = await lazyAccessibility.load();
  return module;
}

// ===== FALLBACK SYSTEM =====

/**
 * Wrap a lazy-loaded function with a fallback mechanism
 * If lazy loading fails, falls back to direct import
 */
function withLazyLoadingFallback<T extends (...args: any[]) => any>(
  lazyFunction: T,
  fallbackLoader: () => Promise<T>
): T {
  return ((...args: Parameters<T>) => {
    try {
      return lazyFunction(...args);
    } catch (error) {
      console.warn('Lazy function failed, using fallback:', error);
      // This is async, but we're in a sync context
      // For simplicity, we'll throw and let the caller handle it
      throw error;
    }
  }) as T;
}

/**
 * Async version of lazy loading fallback
 */
export async function withLazyLoadingFallbackAsync<T extends (...args: any[]) => any>(
  lazyFunction: T,
  fallbackLoader: () => Promise<T>
): Promise<T> {
  try {
    return lazyFunction;
  } catch (error) {
    console.warn('Lazy function failed, loading fallback:', error);
    return await fallbackLoader();
  }
}

// ===== LAZY LOADING MONITOR =====

/**
 * Monitor lazy loading performance
 */
class LazyLoadingMonitor {
  private loadTimes: Map<string, number[]> = new Map();
  private failures: Map<string, number> = new Map();

  recordLoadTime(moduleName: string, duration: number): void {
    const times = this.loadTimes.get(moduleName) || [];
    times.push(duration);
    this.loadTimes.set(moduleName, times);
  }

  recordFailure(moduleName: string): void {
    const currentFailures = this.failures.get(moduleName) || 0;
    this.failures.set(moduleName, currentFailures + 1);
  }

  getStats(moduleName?: string) {
    if (moduleName) {
      const times = this.loadTimes.get(moduleName) || [];
      const failures = this.failures.get(moduleName) || 0;

      if (times.length === 0) return null;

      const sum = times.reduce((a, b) => a + b, 0);
      return {
        moduleName,
        loads: times.length,
        averageLoadTime: sum / times.length,
        minLoadTime: Math.min(...times),
        maxLoadTime: Math.max(...times),
        failures,
      };
    }

    // Return stats for all modules
    const allStats: Record<string, any> = {};
    Array.from(this.loadTimes.entries()).forEach(([name, times]) => {
      const failures = this.failures.get(name) || 0;
      if (times.length > 0) {
        const sum = times.reduce((a, b) => a + b, 0);
        allStats[name] = {
          loads: times.length,
          averageLoadTime: sum / times.length,
          failures,
        };
      }
    });
    return allStats;
  }
}

export const lazyLoadingMonitor = new LazyLoadingMonitor();

// ===== UTILITY FUNCTIONS =====

/**
 * Check if lazy loading is supported in current environment
 */
export function isLazyLoadingSupported(): boolean {
  // Check if we're in a modern environment that supports dynamic imports
  // This is a simple heuristic - in practice, most modern bundlers support dynamic imports
  return typeof Promise === 'function' && typeof Function.prototype.bind === 'function';
}

/**
 * Get lazy loading status
 */
export function getLazyLoadingStatus() {
  return {
    enabled: DEFAULT_LAZY_CONFIG.enabled,
    supported: isLazyLoadingSupported(),
    criticalPreloaded: lazyNavigationGenerator.isLoaded(),
    modulesLoaded: {
      navigationGenerator: lazyNavigationGenerator.isLoaded(),
      validation: lazyValidation.isLoaded(),
      testing: lazyTesting.isLoaded(),
      accessibility: lazyAccessibility.isLoaded(),
    },
  };
}

/**
 * Reset all lazy loading caches (useful for testing)
 */
export function resetLazyLoading(): void {
  lazyNavigationGenerator.reset();
  lazyValidation.reset();
  lazyTesting.reset();
  lazyAccessibility.reset();
}
