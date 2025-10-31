/**
 * # Navigation System
 *
 * A comprehensive, type-safe navigation system for React Native applications.
 * Provides role-based navigation, context-aware UI, caching, validation, and accessibility support.
 *
 * ## Features
 *
 * - **Role-Based Navigation**: Different navigation based on user roles (pilot, instructor, admin, etc.)
 * - **Context Awareness**: Navigation adapts based on user context and current page
 * - **Type Safety**: Full TypeScript support with comprehensive type definitions
 * - **Performance**: Advanced caching with TTL and LRU eviction
 * - **Accessibility**: Built-in ARIA support and keyboard navigation
 * - **Validation**: Runtime validation with detailed error reporting
 * - **Error Recovery**: Circuit breakers and fallback mechanisms
 * - **Testing**: Comprehensive testing utilities and mock data
 * - **Lazy Loading**: Bundle size optimization with on-demand loading
 *
 * ## Quick Start
 *
 * ```typescript
 * import {
 *   ROLE_CONFIG,
 *   generateNavigationForRole,
 *   getPageInfoFromNavConfig
 * } from '@/navigation';
 *
 * // Get navigation for a pilot role
 * const pilotRole = ROLE_CONFIG.getRoleById('pilot');
 * const navigationItems = generateNavigationForRole(pilotRole);
 *
 * // Get page info for current route
 * const pageInfo = getPageInfoFromNavConfig('aircrafts');
 * ```
 *
 * ## Architecture
 *
 * The navigation system is organized into focused modules:
 *
 * - **types.ts**: Type definitions and interfaces
 * - **roles.ts**: Role configuration and context management
 * - **entities.ts**: Entity schemas and navigation generation
 * - **config.ts**: Navigation configuration and route management
 * - **helpers.ts**: Utility functions and error handling
 * - **utils.ts**: Shared utilities and context resolution
 * - **cache.ts**: Advanced caching system
 * - **validation.ts**: Runtime validation and error checking
 * - **accessibility.ts**: Accessibility helpers and ARIA support
 * - **testing.ts**: Testing utilities and mock data
 * - **lazy.ts**: Lazy loading and bundle optimization
 * - **constants.ts**: Configuration constants and defaults
 *
 * ## Error Handling
 *
 * The navigation system includes comprehensive error handling:
 *
 * ```typescript
 * import { withNavigationErrorBoundary } from '@/navigation';
 *
 * const safeNavigation = withNavigationErrorBoundary(
 *   () => generateNavigationForRole(role),
 *   [], // fallback empty array
 *   'navigation-generation'
 * );
 * ```
 *
 * ## Performance
 *
 * Navigation operations are cached and optimized:
 *
 * ```typescript
 * import { navigationCache, CacheInvalidator } from '@/navigation';
 *
 * // Cache is automatic, but you can manually invalidate
 * CacheInvalidator.invalidateRoleNavigation('pilot');
 * ```
 *
 * ## Testing
 *
 * Comprehensive testing utilities are provided:
 *
 * ```typescript
 * import { createMockRole, NavigationTestFactory } from '@/navigation';
 *
 * const mockRole = createMockRole({ id: 'test-pilot' });
 * const testContext = NavigationTestFactory.createTestContext('pilot');
 * ```
 *
 * ## Accessibility
 *
 * Built-in accessibility support:
 *
 * ```typescript
 * import { getNavigationItemAccessibility, ScreenReaderAnnouncer } from '@/navigation';
 *
 * const accessibility = getNavigationItemAccessibility(item, isActive);
 * ScreenReaderAnnouncer.announce('Navigation updated');
 * ```
 */

// ===== NAVIGATION MODULE EXPORTS =====

// ===== TYPES AND INTERFACES =====
/**
 * Core type definitions for the navigation system
 *
 * @see {@link BaseNavItem} - Basic navigation item structure
 * @see {@link Role} - User role configuration
 * @see {@link GeneratedNavItem} - Runtime navigation items
 * @see {@link ContextName} - Available navigation contexts
 * @see {@link EntityName} - Supported entity types
 */
export type {
  BaseNavItem,
  Role,
  RoleGroup,
  RoleNavigation,
  RoleNavigationItem,
  RoleNavigationValue,
  ContextName,
  EntityName,
  ContextPageConfig,
  ContextConfig,
  EntityDisplay,
  XUISchemaDefinition,
  GeneratedNavItem,
  HotkeyConfig,
  HotkeyGroup,
  HotkeysConfig,
  PageInfo,
} from './types';

// ===== SHARED UTILITIES =====
/**
 * Core utilities for context resolution and validation
 *
 * @see {@link getContextForRole} - Get context for a role with caching
 * @see {@link resolveContextForRole} - Safe context resolution with validation
 * @see {@link clearContextCache} - Clear context resolution cache
 */
export {
  getContextForRole,
  clearContextCache,
  isValidContextName,
  resolveContextForRole,
} from './utils';

// ===== ROLE CONFIGURATION =====
/**
 * Role-based navigation configuration and management
 *
 * @see {@link ROLE_CONFIG} - Complete role configuration system
 * @example
 * ```typescript
 * const pilotRole = ROLE_CONFIG.getRoleById('pilot');
 * const basicRoles = ROLE_CONFIG.getBasicRoles();
 * ```
 */
export {
  ROLE_CONFIG,
} from './roles';

// ===== ENTITY SCHEMAS AND NAVIGATION =====
/**
 * Entity schemas and dynamic navigation generation
 *
 * @see {@link XUISCHEMA_REGISTRY} - Entity display and context configurations
 * @see {@link generateNavigationForRole} - Generate navigation items for a role
 * @example
 * ```typescript
 * const navigation = generateNavigationForRole(pilotRole);
 * const aircraftSchema = XUISCHEMA_REGISTRY.aircrafts;
 * ```
 */
export {
  XUISCHEMA_REGISTRY,
  generateNavigationForRole,
  getRouteNameForEntity,
  getEntityNameForRoute,
  getPageInfoForEntity,
  isValidNavigationItem,
} from './entities';

// ===== NAVIGATION CONFIGURATION =====
/**
 * Navigation configuration, routing, and tab management
 *
 * @see {@link NAVIGATION_CONFIG} - Complete navigation configuration
 * @see {@link ROUTE_REGISTRY} - Centralized route definitions
 * @see {@link RouteKey} - Type for route registry keys
 * @see {@link RouteValue} - Type for route registry values
 * @example
 * ```typescript
 * const tabBarItems = getTabBarItems();
 * const aircraftRoute = getSafeRoute('aircrafts' as RouteKey);
 * ```
 */
export {
  NAVIGATION_CONFIG,
  ROUTE_REGISTRY,
  RouteKey,
  RouteValue,
  getFullRoute,
  getSafeRoute,
  generateTabBarItems,
  getTabBarItems,
  getTabBarItem,
  getProfileMenuItem,
} from './config';

// ===== UTILITY FUNCTIONS =====
/**
 * Navigation utility functions and error handling
 *
 * @see {@link getPageInfoFromNavConfig} - Get page information for routes
 * @see {@link withNavigationErrorBoundary} - Error boundary wrapper
 * @example
 * ```typescript
 * const pageInfo = getPageInfoFromNavConfig('aircrafts');
 * const safeNav = withNavigationErrorBoundary(
 *   () => generateNavigationForRole(role),
 *   [],
 *   'nav-generation'
 * );
 * ```
 */
export {
  getPageInfoFromNavConfig,
  filterVisibleItems,
  getItemHref,
  isTabActive,
  isValidBaseNavItem,
  safeGetNavigationItem,
  createNavigationItem,
  validateNavigationConfig,
  withPerformanceMonitoring,
  withNavigationErrorBoundary,
  withRetry,
  NavigationRecovery,
  NavigationError,
  NavigationErrorType,
  navigationCircuitBreaker,
} from './helpers';

// ===== CACHING SYSTEM =====
/**
 * Advanced caching system with TTL and LRU eviction
 *
 * @see {@link navigationCache} - Main navigation cache
 * @see {@link CacheInvalidator} - Cache management utilities
 * @example
 * ```typescript
 * // Cache is automatic, but you can manage it
 * CacheInvalidator.invalidateRoleNavigation('pilot');
 * const stats = navigationCache.getStats();
 * ```
 */
export {
  navigationCache,
  contextCache,
  cacheManager,
  CacheKeyGenerator,
  CacheInvalidator,
  MemoryMonitor,
} from './cache';

// ===== VALIDATION SYSTEM =====
/**
 * Comprehensive runtime validation and error checking
 *
 * @see {@link NavigationValidator} - Complete validation system
 * @example
 * ```typescript
 * const result = NavigationValidator.validateAll();
 * if (!result.isValid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export {
  NavigationValidator,
  assertValidNavigation,
  assertValidRole,
  getValidationSummary,
} from './validation';

// ===== ACCESSIBILITY HELPERS =====
/**
 * Accessibility utilities for navigation components
 *
 * @see {@link getNavigationItemAccessibility} - ARIA properties for nav items
 * @see {@link ScreenReaderAnnouncer} - Screen reader announcements
 * @example
 * ```typescript
 * const accessibility = getNavigationItemAccessibility(item, isActive);
 * ScreenReaderAnnouncer.announce('Navigation updated');
 * ```
 */
export {
  getNavigationItemAccessibility,
  getNavigationContainerAccessibility,
  getKeyboardNavigationConfig,
  handleKeyboardNavigation,
  AccessibilityIdGenerator,
  ScreenReaderAnnouncer,
  NavigationFocusManager,
  detectHighContrastMode,
  prefersReducedMotion,
  generateNavigationSummary,
} from './accessibility';

// ===== TESTING UTILITIES =====
/**
 * Testing utilities and mock data (development only)
 *
 * @see {@link createMockRole} - Create mock role for testing
 * @see {@link NavigationTestFactory} - Test scenario factories
 * @example
 * ```typescript
 * const mockRole = createMockRole({ id: 'test-pilot' });
 * const testContext = NavigationTestFactory.createTestContext('pilot');
 * ```
 */
export {
  createMockNavigationItems,
  createMockRole,
  createMockGeneratedNavItems,
  MockNavigationCache,
  MockRouter,
  NavigationTestContext,
  assertValidNavigationItems,
  assertNavigationItemsSorted,
  assertNavigationContainsItems,
  assertValidRoleNavigation,
  NavigationTestFactory,
  NavigationPerformanceTester,
  NavigationIntegrationTester,
  cloneNavigationItem,
  cloneGeneratedNavItem,
  cloneRole,
  createNavigationTestFixture,
  navigationPerformanceTester,
} from './testing';

// ===== LAZY LOADING =====
/**
 * Lazy loading utilities for bundle optimization
 *
 * @see {@link preloadCriticalNavigation} - Preload critical navigation modules
 * @example
 * ```typescript
 * // Preload critical modules early in app lifecycle
 * preloadCriticalNavigation();
 *
 * // Load modules on demand
 * const navGen = await getNavigationGenerator();
 * ```
 */
export {
  preloadCriticalNavigation,
  getNavigationGenerator,
  getValidationUtils,
  getTestingUtils,
  getAccessibilityUtils,
  getLazyLoadingStatus,
  resetLazyLoading,
  withLazyLoadingFallbackAsync,
} from './lazy';

// ===== CONSTANTS =====
/**
 * Navigation constants and configuration values
 *
 * @see {@link NAVIGATION_CONSTANTS} - Magic numbers and defaults
 * @see {@link NAVIGATION_DEFAULTS} - Default configuration values
 */
export {
  NAVIGATION_CONSTANTS,
  NAVIGATION_DEFAULTS,
  NAVIGATION_ERRORS,
  NAVIGATION_ACCESSIBILITY,
  NAVIGATION_FEATURES,
  CACHE_CONFIG,
} from './constants';

// ===== LEGACY COMPATIBILITY EXPORTS =====
/**
 * Legacy exports for backward compatibility during migration
 * These will be removed once all components are updated
 */

// Re-export buildRoute from utils for backward compatibility
export { buildRoute } from '@/utils/navigation';
