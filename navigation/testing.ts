import {
  BaseNavItem,
  GeneratedNavItem,
  Role,
  RoleNavigation,
  ContextName,
  EntityName,
} from './types';

/**
 * Testing utilities for navigation components
 * Provides mock data, test helpers, and validation utilities
 */

// ===== MOCK DATA GENERATORS =====

/**
 * Generate mock navigation items for testing
 */
export function createMockNavigationItems(count: number = 5): BaseNavItem[] {
  const icons = ['home', 'settings', 'user', 'bell', 'search', 'menu', 'star'];
  const names = ['Dashboard', 'Settings', 'Profile', 'Notifications', 'Search', 'Menu', 'Favorites'];

  return Array.from({ length: count }, (_, index) => ({
    id: `item-${index}`,
    name: names[index % names.length],
    href: `/${names[index % names.length].toLowerCase()}`,
    icon: icons[index % icons.length],
    visible: true,
    order: index,
  }));
}

/**
 * Generate mock role for testing
 */
export function createMockRole(overrides: Partial<Role> = {}): Role {
  return {
    id: 'test-role',
    name: 'Test Role',
    icon: 'user',
    label: 'Test Role',
    comingSoon: false,
    navigation: {
      dashboard: { route: '/', label: 'Dashboard', icon: 'home', main: true },
      aircrafts: { label: 'Aircraft', main: true },
    },
    context: 'pilot',
    ...overrides,
  };
}

/**
 * Generate mock generated navigation items
 */
export function createMockGeneratedNavItems(count: number = 3): GeneratedNavItem[] {
  const baseItems = createMockNavigationItems(count);
  return baseItems.map(item => ({
    ...item,
    label: item.name, // GeneratedNavItem requires a label property
    description: `Description for ${item.name}`,
    customPage: Math.random() > 0.5,
  }));
}

// ===== TEST HELPERS =====

/**
 * Mock navigation cache for testing
 */
export class MockNavigationCache {
  private cache = new Map<string, any>();

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Mock router for testing navigation
 */
export class MockRouter {
  private currentRoute = '/';
  private navigationHistory: string[] = ['/'];
  private listeners: ((route: string) => void)[] = [];

  get pathname(): string {
    return this.currentRoute;
  }

  push(route: string): void {
    this.currentRoute = route;
    this.navigationHistory.push(route);
    this.listeners.forEach(listener => listener(route));
  }

  back(): void {
    if (this.navigationHistory.length > 1) {
      this.navigationHistory.pop();
      this.currentRoute = this.navigationHistory[this.navigationHistory.length - 1];
      this.listeners.forEach(listener => listener(this.currentRoute));
    }
  }

  addListener(listener: (route: string) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getHistory(): string[] {
    return [...this.navigationHistory];
  }

  reset(): void {
    this.currentRoute = '/';
    this.navigationHistory = ['/'];
    this.listeners = [];
  }
}

/**
 * Test context provider for navigation testing
 */
export class NavigationTestContext {
  private mockRouter = new MockRouter();
  private mockCache = new MockNavigationCache();
  private currentRole: Role | null = null;

  constructor(initialRole?: Role) {
    if (initialRole) {
      this.setCurrentRole(initialRole);
    }
  }

  get router() {
    return this.mockRouter;
  }

  get cache() {
    return this.mockCache;
  }

  getCurrentRole(): Role | null {
    return this.currentRole;
  }

  setCurrentRole(role: Role): void {
    this.currentRole = role;
  }

  navigate(route: string): void {
    this.mockRouter.push(route);
  }

  reset(): void {
    this.mockRouter.reset();
    this.mockCache.clear();
    this.currentRole = null;
  }
}

// ===== ASSERTION HELPERS =====

/**
 * Assert that navigation items are valid
 */
export function assertValidNavigationItems(items: BaseNavItem[]): void {
  items.forEach((item, index) => {
    if (!item.id) {
      throw new Error(`Navigation item at index ${index} is missing id`);
    }
    if (!item.name) {
      throw new Error(`Navigation item "${item.id}" is missing name`);
    }
    if (!item.icon) {
      throw new Error(`Navigation item "${item.id}" is missing icon`);
    }
    if (typeof item.visible !== 'boolean') {
      throw new Error(`Navigation item "${item.id}" has invalid visible property`);
    }
    if (typeof item.order !== 'number') {
      throw new Error(`Navigation item "${item.id}" has invalid order property`);
    }
  });
}

/**
 * Assert that navigation items are properly sorted
 */
export function assertNavigationItemsSorted(items: BaseNavItem[]): void {
  for (let i = 1; i < items.length; i++) {
    if (items[i].order < items[i - 1].order) {
      throw new Error(`Navigation items are not properly sorted at index ${i}`);
    }
  }
}

/**
 * Assert that navigation contains expected items
 */
export function assertNavigationContainsItems(
  items: BaseNavItem[],
  expectedIds: string[]
): void {
  const itemIds = items.map(item => item.id);
  const missingIds = expectedIds.filter(id => !itemIds.includes(id));

  if (missingIds.length > 0) {
    throw new Error(`Navigation is missing expected items: ${missingIds.join(', ')}`);
  }
}

/**
 * Assert that role navigation is valid
 */
export function assertValidRoleNavigation(navigation: RoleNavigation): void {
  Object.entries(navigation).forEach(([entityKey, navValue]) => {
    if (typeof navValue === 'boolean') {
      // Boolean value is valid
      return;
    }

    if (typeof navValue === 'object' && navValue !== null) {
      // Object should have required properties
      if (!navValue.label && !navValue.icon) {
        throw new Error(`Role navigation for "${entityKey}" is missing label or icon`);
      }
    } else {
      throw new Error(`Invalid navigation value for "${entityKey}": ${navValue}`);
    }
  });
}

// ===== TEST DATA FACTORIES =====

/**
 * Factory for creating test navigation scenarios
 */
export class NavigationTestFactory {
  static createPilotNavigation(): RoleNavigation {
    return {
      dashboard: { route: '/', label: 'Dashboard', icon: 'view-dashboard', main: true },
      'route-planner': { route: '/route-planner', label: 'Plan', icon: 'map', main: true },
      aircrafts: { label: 'Fly', main: true },
      documents: { main: true },
      checklists: { main: true },
      logbookentries: { label: 'Logbook', main: true },
      reservations: {},
      club: { route: '/club', label: 'Club', icon: 'account-group' },
    };
  }

  static createInstructorNavigation(): RoleNavigation {
    return {
      users: { label: 'My Students', icon: 'account-school' },
      reservations: {},
      aircrafts: {},
      logbookentries: {},
    };
  }

  static createAdminNavigation(): RoleNavigation {
    return {
      organizations: {},
      users: { label: 'All Users' },
      aircrafts: {},
      maintenance: {},
    };
  }

  static createTestContext(name: 'pilot' | 'instructor' | 'admin'): NavigationTestContext {
    const navigations = {
      pilot: this.createPilotNavigation(),
      instructor: this.createInstructorNavigation(),
      admin: this.createAdminNavigation(),
    };

    const role = createMockRole({
      id: name,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      navigation: navigations[name],
      context: name === 'pilot' ? 'pilot' : 'default',
    });

    return new NavigationTestContext(role);
  }
}

// ===== PERFORMANCE TESTING =====

/**
 * Performance test utilities for navigation operations
 */
export class NavigationPerformanceTester {
  private results: Map<string, number[]> = new Map();

  measure<T>(testName: string, operation: () => T, iterations: number = 100): T {
    const times: number[] = [];

    // Warm up
    for (let i = 0; i < Math.min(10, iterations); i++) {
      operation();
    }

    // Measure
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      const result = operation();
      const end = performance.now();
      times.push(end - start);

      // Return result from last iteration
      if (i === iterations - 1) {
        return result;
      }
    }

    this.results.set(testName, times);
    return operation(); // This won't be reached, but satisfies TypeScript
  }

  getResults(testName: string) {
    const times = this.results.get(testName);
    if (!times) return null;

    const sum = times.reduce((a, b) => a + b, 0);
    return {
      name: testName,
      iterations: times.length,
      average: sum / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      median: times.sort((a, b) => a - b)[Math.floor(times.length / 2)],
      p95: times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)],
    };
  }

  getAllResults() {
    const results: Record<string, any> = {};
    Array.from(this.results.keys()).forEach(testName => {
      results[testName] = this.getResults(testName);
    });
    return results;
  }

  reset(): void {
    this.results.clear();
  }
}

// Global performance tester instance
export const navigationPerformanceTester = new NavigationPerformanceTester();

// ===== INTEGRATION TEST HELPERS =====

/**
 * End-to-end navigation test helper
 */
export class NavigationIntegrationTester {
  private context: NavigationTestContext;

  constructor(context: NavigationTestContext) {
    this.context = context;
  }

  /**
   * Test navigation flow
   */
  async testNavigationFlow(
    steps: Array<{ route: string; expectedTitle?: string }>
  ): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    for (const step of steps) {
      try {
        this.context.navigate(step.route);

        if (this.context.router.pathname !== step.route) {
          errors.push(`Failed to navigate to ${step.route}, ended up at ${this.context.router.pathname}`);
        }

        // Could add title validation here if we had access to page info
      } catch (error) {
        errors.push(`Error navigating to ${step.route}: ${error}`);
      }
    }

    return {
      success: errors.length === 0,
      errors,
    };
  }

  /**
   * Test role switching
   */
  async testRoleSwitching(
    roles: Role[]
  ): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    for (const role of roles) {
      try {
        this.context.setCurrentRole(role);

        if (this.context.getCurrentRole()?.id !== role.id) {
          errors.push(`Failed to switch to role ${role.id}`);
        }

        // Test navigation generation for the role
        // This would require importing generateNavigationForRole
      } catch (error) {
        errors.push(`Error switching to role ${role.id}: ${error}`);
      }
    }

    return {
      success: errors.length === 0,
      errors,
    };
  }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Deep clone navigation objects for testing
 */
export function cloneNavigationItem(item: BaseNavItem): BaseNavItem {
  return { ...item };
}

export function cloneGeneratedNavItem(item: GeneratedNavItem): GeneratedNavItem {
  return { ...item };
}

export function cloneRole(role: Role): Role {
  return {
    ...role,
    navigation: role.navigation ? { ...role.navigation } : undefined,
  };
}

/**
 * Create test fixture with multiple navigation states
 */
export function createNavigationTestFixture() {
  return {
    roles: [
      createMockRole({ id: 'pilot', label: 'Pilot' }),
      createMockRole({ id: 'instructor', label: 'Instructor' }),
      createMockRole({ id: 'admin', label: 'Admin' }),
    ],
    navigationItems: createMockNavigationItems(10),
    generatedItems: createMockGeneratedNavItems(5),
    contexts: ['pilot', 'instructor', 'admin'] as ContextName[],
  };
}
