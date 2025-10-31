import { CACHE_CONFIG, NAVIGATION_CONSTANTS } from './constants';

/**
 * Cache entry with metadata
 */
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  size: number; // Estimated size in bytes
}

/**
 * Cache statistics
 */
interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  sets: number;
  size: number;
  entries: number;
}

/**
 * Advanced cache with TTL, size limits, and LRU eviction
 */
export class NavigationCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    sets: 0,
    size: 0,
    entries: 0,
  };

  private readonly config: {
    maxSize: number;
    defaultTTL: number;
    enableStats: boolean;
  };

  constructor(config: Partial<typeof CACHE_CONFIG['navigationItems']> = {}) {
    this.config = {
      maxSize: config.maxSize || CACHE_CONFIG.navigationItems.maxSize,
      defaultTTL: config.ttl || CACHE_CONFIG.navigationItems.ttl,
      enableStats: true,
    };

    // Periodic cleanup
    if (typeof globalThis !== 'undefined' && globalThis.setInterval) {
      setInterval(() => this.cleanup(), 60000); // Clean up every minute
    }
  }

  /**
   * Get value from cache
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      if (this.config.enableStats) this.stats.misses++;
      return undefined;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > this.config.defaultTTL) {
      this.cache.delete(key);
      if (this.config.enableStats) {
        this.stats.misses++;
        this.stats.evictions++;
      }
      return undefined;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    if (this.config.enableStats) this.stats.hits++;
    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const entrySize = this.estimateSize(value);

    // Check if we need to evict entries
    if (this.stats.size + entrySize > this.config.maxSize) {
      this.evictEntries(entrySize);
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: now,
      accessCount: 0,
      lastAccessed: now,
      size: entrySize,
    };

    // Remove existing entry if present
    const existing = this.cache.get(key);
    if (existing) {
      this.stats.size -= existing.size;
    } else {
      this.stats.entries++;
    }

    this.cache.set(key, entry);
    this.stats.size += entrySize;

    if (this.config.enableStats) this.stats.sets++;

    // Set custom TTL if provided
    if (ttl && ttl !== this.config.defaultTTL) {
      setTimeout(() => this.delete(key), ttl);
    }
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check TTL
    if (Date.now() - entry.timestamp > this.config.defaultTTL) {
      this.cache.delete(key);
      if (this.config.enableStats) this.stats.evictions++;
      return false;
    }

    return true;
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.cache.delete(key);
      this.stats.size -= entry.size;
      this.stats.entries--;
      if (this.config.enableStats) this.stats.evictions++;
      return true;
    }
    return false;
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    this.stats.entries = 0;
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get cache hit rate
   */
  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    return total > 0 ? this.stats.hits / total : 0;
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all entries with metadata
   */
  entries(): Array<[string, CacheEntry<T>]> {
    return Array.from(this.cache.entries());
  }

  /**
   * Estimate size of a value in bytes
   */
  private estimateSize(value: any): number {
    try {
      // Rough estimation based on JSON string length
      const jsonString = JSON.stringify(value);
      return jsonString.length * 2; // UTF-16 characters
    } catch {
      // Fallback for non-serializable objects
      return 1024; // 1KB estimate
    }
  }

  /**
   * Evict entries using LRU (Least Recently Used) strategy
   */
  private evictEntries(requiredSpace: number): void {
    if (this.cache.size === 0) return;

    // Sort entries by last access time (oldest first)
    const entries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.lastAccessed - b.lastAccessed
    );

    let freedSpace = 0;
    let evictions = 0;

    for (const [key, entry] of entries) {
      if (this.stats.size - freedSpace + requiredSpace <= this.config.maxSize) {
        break;
      }

      this.cache.delete(key);
      freedSpace += entry.size;
      evictions++;
    }

    this.stats.size -= freedSpace;
    this.stats.entries -= evictions;
    if (this.config.enableStats) {
      this.stats.evictions += evictions;
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    // Use Array.from to avoid iterator issues
    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > this.config.defaultTTL) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => {
      this.delete(key);
    });
  }
}

// ===== GLOBAL CACHE INSTANCES =====

/**
 * Global navigation cache instance
 */
export const navigationCache = new NavigationCache<any>({
  maxSize: CACHE_CONFIG.navigationItems.maxSize,
  ttl: CACHE_CONFIG.navigationItems.ttl,
});

/**
 * Context resolution cache (longer TTL)
 */
export const contextCache = new NavigationCache<string>({
  maxSize: CACHE_CONFIG.contextResolution.maxSize,
  ttl: CACHE_CONFIG.contextResolution.ttl,
});

/**
 * Cache manager for coordinating multiple caches
 */
export class CacheManager {
  private caches = new Map<string, NavigationCache>();

  /**
   * Get all registered caches (for internal use)
   */
  getAllCaches(): Map<string, NavigationCache> {
    return this.caches;
  }

  register(name: string, cache: NavigationCache): void {
    this.caches.set(name, cache);
  }

  get(name: string): NavigationCache | undefined {
    return this.caches.get(name);
  }

  clearAll(): void {
    Array.from(this.caches.values()).forEach(cache => {
      cache.clear();
    });
  }

  getAllStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {};
    Array.from(this.caches.entries()).forEach(([name, cache]) => {
      stats[name] = cache.getStats();
    });
    return stats;
  }

  getTotalMemoryUsage(): number {
    return Array.from(this.caches.values()).reduce((total, cache) => {
      return total + cache.getStats().size;
    }, 0);
  }
}

// Global cache manager
export const cacheManager = new CacheManager();

// Register default caches
cacheManager.register('navigation', navigationCache);
cacheManager.register('context', contextCache);

// ===== CACHE UTILITIES =====

/**
 * Cache key generator for consistent keys
 */
export class CacheKeyGenerator {
  static navigationForRole(roleId: string, context?: string): string {
    return `nav:${roleId}:${context || 'default'}`;
  }

  static contextForRole(roleId: string): string {
    return `ctx:${roleId}`;
  }

  static pageInfo(routeId: string): string {
    return `page:${routeId}`;
  }

  static entityRoute(entityName: string): string {
    return `entity:${entityName}`;
  }
}

/**
 * Cache invalidation helpers
 */
export class CacheInvalidator {
  static invalidateRoleNavigation(roleId: string): void {
    // Remove all navigation caches for this role
    const keysToDelete: string[] = [];
    for (const key of navigationCache.keys()) {
      if (key.startsWith(`nav:${roleId}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => navigationCache.delete(key));
  }

  static invalidateContextResolution(roleId: string): void {
    contextCache.delete(CacheKeyGenerator.contextForRole(roleId));
  }

  static invalidateAll(): void {
    cacheManager.clearAll();
  }

  static invalidateByPattern(pattern: RegExp): void {
    Array.from(cacheManager.getAllCaches().values()).forEach(cache => {
      const keysToDelete = cache.keys().filter(key => pattern.test(key));
      keysToDelete.forEach(key => cache.delete(key));
    });
  }
}

/**
 * Memory usage monitor
 */
export class MemoryMonitor {
  private static samples: number[] = [];
  private static maxSamples = 10;

  static recordSample(): void {
    const usage = cacheManager.getTotalMemoryUsage();
    this.samples.push(usage);

    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
  }

  static getAverageUsage(): number {
    if (this.samples.length === 0) return 0;
    return this.samples.reduce((sum, sample) => sum + sample, 0) / this.samples.length;
  }

  static getPeakUsage(): number {
    return this.samples.length > 0 ? Math.max(...this.samples) : 0;
  }

  static isMemoryPressure(): boolean {
    const average = this.getAverageUsage();
    const threshold = NAVIGATION_CONSTANTS.CACHE_MAX_SIZE * 0.8; // 80% of max
    return average > threshold;
  }

  static getStats() {
    return {
      current: cacheManager.getTotalMemoryUsage(),
      average: this.getAverageUsage(),
      peak: this.getPeakUsage(),
      isUnderPressure: this.isMemoryPressure(),
      samples: this.samples.length,
    };
  }
}
