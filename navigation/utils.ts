import { ContextName, Role } from './types';
import { contextCache, CacheKeyGenerator } from './cache';

// ===== SHARED UTILITIES =====

/**
 * Get the context name for a role (with caching)
 * Moved here to avoid circular dependencies between roles.ts and entities.ts
 */
export function getContextForRole(role: Role): ContextName {
  const cacheKey = CacheKeyGenerator.contextForRole(role.id);

  const cached = contextCache.get(cacheKey);
  if (cached) {
    return cached as ContextName;
  }

  const context = (role.context as ContextName) || role.id as ContextName || 'default';
  contextCache.set(cacheKey, context);
  return context;
}

/**
 * Clear context cache (useful for testing or when roles change)
 */
export function clearContextCache(): void {
  contextCache.clear();
}

/**
 * Validate that a context name is valid
 */
export function isValidContextName(context: string): context is ContextName {
  const validContexts: ContextName[] = [
    'default',
    'pilot',
    'maintenance',
    'flightclub_admin',
    'flightschool_admin',
    'aerodrome_admin',
    'platform_admin',
    'instructor'
  ];
  return validContexts.includes(context as ContextName);
}

/**
 * Safe context resolution with validation
 */
export function resolveContextForRole(role: Role): ContextName {
  const context = getContextForRole(role);

  if (!isValidContextName(context)) {
    console.warn(`Invalid context "${context}" for role "${role.id}", falling back to "default"`);
    return 'default';
  }

  return context;
}
