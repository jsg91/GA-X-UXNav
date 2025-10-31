import { BaseNavItem, HotkeyConfig, HotkeyGroup, HotkeysConfig } from './types';

// ===== ROUTE REGISTRY =====
/**
 * Centralized route registry for consistent route management
 * Eliminates duplicate route strings across the codebase
 */
export const ROUTE_REGISTRY = {
  // Core entity routes
  dashboard: '/',
  aircrafts: 'aircrafts',
  logbook: 'logbook',
  reservations: 'reservations',
  maintenance: 'maintenance',
  aerodromes: 'aerodromes',
  documents: 'documents',
  checklists: 'checklists',
  events: 'events',
  organizations: 'organizations',
  users: 'users',
  techlog: 'techlog',

  // Custom routes (pages)
  club: 'club',
  routePlanner: 'route-planner',
  findDpe: 'find-dpe',
  findAme: 'find-ame',
  training: 'training',
  members: 'members',
  instructors: 'instructors',
  courses: 'courses',
  fuel: 'fuel',
  services: 'services',
  movements: 'movements',
  parking: 'parking',
  inspections: 'inspections',
  parts: 'parts',
  'my-projects': 'my-projects',
  'build-log': 'build-log',
  products: 'products',
  orders: 'orders',
  reports: 'reports',
  examinations: 'examinations',
  candidates: 'candidates',
  'medical-exams': 'medical-exams',
  patients: 'patients',
  policies: 'policies',
  clients: 'clients',
  registrations: 'registrations',
  licenses: 'licenses',
  incidents: 'incidents',
  declarations: 'declarations',
  flights: 'flights',

  // Admin routes
  admin: 'admin',
  support: 'support',
  about: 'about',
  'feature-request': 'feature-request',
  invoicing: 'invoicing',
  'country-aips': 'country-aips',
  tips: 'tips',

  // Profile routes
  profile: 'profile',
  'licenses-permits': 'licenses-permits',
  settings: 'settings',
  subscription: 'subscription',
  payments: 'payments',
} as const;

// Type-safe route keys
export type RouteKey = keyof typeof ROUTE_REGISTRY;

// Type-safe route values
export type RouteValue = typeof ROUTE_REGISTRY[RouteKey];

/**
 * Get full route path with tabs prefix
 * Type-safe version that accepts RouteValue
 */
export function getFullRoute(routeName: RouteValue | string): string {
  // Already a full path
  if (typeof routeName === 'string' && routeName.startsWith('/')) {
    return routeName.startsWith('/(tabs)') ? routeName : `/(tabs)${routeName}`;
  }

  // Route name that needs prefix
  return `/(tabs)/${routeName}`;
}

/**
 * Safe route getter with validation
 */
export function getSafeRoute(routeKey: RouteKey): string {
  const routeValue = ROUTE_REGISTRY[routeKey];
  if (!routeValue) {
    console.warn(`Unknown route key: ${routeKey}`);
    return '/'; // Fallback to dashboard
  }
  return getFullRoute(routeValue);
}

// ===== NAVIGATION CONFIG =====
/**
 * Optimized navigation configuration with generated tab bar
 * Removes duplication between role navigation and static tab bar
 */
export const NAVIGATION_CONFIG = {
  // ===== PROFILE MENU ITEMS =====
  /**
   * User-specific screens accessible through profile menu
   */
  profileMenu: {
    items: [
      { id: 'profile', name: 'Profile', href: getFullRoute(ROUTE_REGISTRY.profile), icon: 'account', visible: true, order: 0 },
      { id: 'licenses-permits', name: 'Licenses & Permits', href: getFullRoute(ROUTE_REGISTRY['licenses-permits']), icon: 'certificate', visible: true, order: 1 },
      { id: 'settings', name: 'Settings', href: getFullRoute(ROUTE_REGISTRY.settings), icon: 'cog', visible: true, order: 2 },
      { id: 'subscription', name: 'Subscription', href: getFullRoute(ROUTE_REGISTRY.subscription), icon: 'credit-card', visible: true, order: 3 },
      { id: 'payments', name: 'Payments', href: getFullRoute(ROUTE_REGISTRY.payments), icon: 'credit-card', visible: true, order: 4 },
      { id: 'logout', name: 'Sign Out', href: null, icon: 'logout', visible: true, order: 5, userOnly: true },
    ] as const satisfies readonly BaseNavItem[],
  },

  // ===== HOTKEYS CONFIGURATION =====
  /**
   * Keyboard shortcuts configuration for web platform
   * Pre-computed for better performance
   */
  hotkeys: {
    // Navigation shortcuts (GitHub-style)
    navigation: {
      dashboard: { keys: ['g', 'd'], route: ROUTE_REGISTRY.dashboard, description: 'Go to Dashboard' },
      reservations: { keys: ['g', 'r'], route: getFullRoute(ROUTE_REGISTRY.reservations), description: 'Go to Reservations' },
      logbook: { keys: ['g', 'l'], route: getFullRoute(ROUTE_REGISTRY.logbook), description: 'Go to Logbook' },
      aircrafts: { keys: ['g', 'a'], route: getFullRoute(ROUTE_REGISTRY.aircrafts), description: 'Go to Aircraft' },
      aerodromes: { keys: ['g', 'e'], route: getFullRoute(ROUTE_REGISTRY.aerodromes), description: 'Go to Aerodromes' },
      maintenance: { keys: ['g', 'm'], route: getFullRoute(ROUTE_REGISTRY.maintenance), description: 'Go to Maintenance' },
      routePlanner: { keys: ['g', 'p'], route: getFullRoute(ROUTE_REGISTRY.routePlanner), description: 'Go to Route Planner' },
    } as HotkeyGroup,

    // Global actions
    actions: {
      focusSearch: { keys: ['cmd+k', 'ctrl+k', 'ctrl+f', '/'], description: 'Focus search field' },
      toggleAI: { keys: ['cmd+j', 'ctrl+j', 'shift+space'], description: 'Toggle AI Assistant' },
      newItem: { keys: ['n'], description: 'Create new item (context-aware)' },
      help: { keys: ['shift+?'], route: getFullRoute(ROUTE_REGISTRY.tips), description: 'Show keyboard shortcuts' },
      closeModals: { keys: ['escape'], description: 'Close modals and overlays' },
    } as HotkeyGroup,

    // Context-aware actions by route
    contextual: {
      [getFullRoute(ROUTE_REGISTRY.reservations)]: {
        newItem: { action: 'newReservation', description: 'New Reservation' }
      },
      [getFullRoute(ROUTE_REGISTRY.logbook)]: {
        newItem: { action: 'newLogEntry', description: 'New Log Entry' }
      },
      [getFullRoute(ROUTE_REGISTRY.aircrafts)]: {
        newItem: { action: 'newFlight', description: 'New Flight' }
      }
    }
  } as const satisfies HotkeysConfig,
} as const;

// ===== NAVIGATION ITEM GENERATION =====
/**
 * Generate tab bar items dynamically from role navigation
 * This eliminates duplication and ensures consistency
 */
export function generateTabBarItems(): BaseNavItem[] {
  const items: BaseNavItem[] = [];

  // Import here to avoid circular dependency
  const { ROLE_CONFIG } = require('./roles');

  // Get pilot role as base for navigation (most complete navigation)
  const pilotRole = ROLE_CONFIG.getRoleById('pilot');
  if (pilotRole?.navigation) {
    // Convert role navigation to tabBar format
    Object.entries(pilotRole.navigation).forEach(([entityKey, navConfig], index) => {
      if (navConfig && typeof navConfig === 'object' && 'main' in navConfig && navConfig.main) {
        // Main navigation items
        if ('customPage' in navConfig && navConfig.customPage) {
          items.push({
            id: entityKey,
            name: navConfig.label || entityKey,
            href: navConfig.route || getFullRoute(entityKey),
            icon: navConfig.icon || 'file',
            visible: true,
            order: index,
            smallScreen: true,
          });
        } else {
          // Entity-based items
          const routeName = entityKey === 'logbookentries' ? 'logbook' : entityKey;
          items.push({
            id: entityKey,
            name: navConfig.label || entityKey,
            href: getFullRoute(routeName),
            icon: navConfig.icon || 'file',
            visible: true,
            order: index,
            smallScreen: true,
          });
        }
      }
    });
  }

  // Add core navigation items that aren't in role navigation
  const coreItems: BaseNavItem[] = [
    { id: 'dashboard', name: 'Dashboard', href: ROUTE_REGISTRY.dashboard, icon: 'view-dashboard', visible: true, order: 0, smallScreen: true },
    { id: 'maintenance', name: 'Maintenance', href: getFullRoute(ROUTE_REGISTRY.maintenance), icon: 'wrench', visible: true, order: 5, largeScreen: true },
    { id: 'aerodromes', name: 'Aerodromes', href: getFullRoute(ROUTE_REGISTRY.aerodromes), icon: 'airport', visible: true, order: 7, largeScreen: true },
    { id: 'events', name: 'Events', href: getFullRoute(ROUTE_REGISTRY.events), icon: 'calendar-star', visible: true, order: 10, largeScreen: true },
    { id: 'menu', name: 'Menu', href: getFullRoute('menu'), icon: 'menu', visible: true, order: 11, smallScreen: true },
    { id: 'admin', name: 'Admin', href: getFullRoute(ROUTE_REGISTRY.admin), icon: 'cog', adminOnly: true, visible: false, order: 12, largeScreen: true },
    { id: 'support', name: 'Support', href: getFullRoute(ROUTE_REGISTRY.support), icon: 'help', visible: false, order: 13, largeScreen: true },
    { id: 'about', name: 'About', href: getFullRoute(ROUTE_REGISTRY.about), icon: 'info', visible: false, order: 14, largeScreen: true },
    { id: 'feature-request', name: 'Feature Request', href: getFullRoute(ROUTE_REGISTRY['feature-request']), icon: 'lightbulb', visible: false, order: 15, largeScreen: true },
    { id: 'invoicing', name: 'Invoicing', href: getFullRoute(ROUTE_REGISTRY.invoicing), icon: 'receipt', visible: false, order: 16, largeScreen: true },
    { id: 'checklists', name: 'Checklists', href: getFullRoute(ROUTE_REGISTRY.checklists), icon: 'checkbox-marked', visible: false, order: 17, largeScreen: true },
    { id: 'country-aips', name: 'Country AIPs', href: getFullRoute(ROUTE_REGISTRY['country-aips']), icon: 'earth', visible: false, order: 18, largeScreen: true },
    { id: 'organizations', name: 'Organizations', href: getFullRoute(ROUTE_REGISTRY.organizations), icon: 'office-building', visible: false, order: 19, largeScreen: true },
    { id: 'tips', name: 'Tips', href: getFullRoute(ROUTE_REGISTRY.tips), icon: 'lightbulb', visible: true, order: 20, smallScreen: true, largeScreen: true },
  ];

  // Merge and deduplicate
  const allItems = [...items, ...coreItems];
  const uniqueItems = allItems.filter((item, index, self) =>
    index === self.findIndex(i => i.id === item.id)
  );

  return uniqueItems.sort((a, b) => a.order - b.order);
}

// ===== CACHED TAB BAR =====
let cachedTabBar: BaseNavItem[] | null = null;

/**
 * Get cached tab bar items
 */
export function getTabBarItems(): BaseNavItem[] {
  if (!cachedTabBar) {
    cachedTabBar = generateTabBarItems();
  }
  return cachedTabBar;
}

// ===== LOOKUP MAPS FOR O(1) ACCESS =====
const TAB_BAR_MAP = new Map<BaseNavItem['id'], BaseNavItem>();
const PROFILE_MENU_MAP = new Map<BaseNavItem['id'], BaseNavItem>();

// Initialize maps on first access
function initializeMaps() {
  if (TAB_BAR_MAP.size === 0) {
    getTabBarItems().forEach(item => TAB_BAR_MAP.set(item.id, item));
  }
  if (PROFILE_MENU_MAP.size === 0) {
    NAVIGATION_CONFIG.profileMenu.items.forEach(item => PROFILE_MENU_MAP.set(item.id, item));
  }
}

/**
 * Get tab bar item by ID (O(1) lookup)
 */
export function getTabBarItem(id: string): BaseNavItem | undefined {
  initializeMaps();
  return TAB_BAR_MAP.get(id);
}

/**
 * Get profile menu item by ID (O(1) lookup)
 */
export function getProfileMenuItem(id: string): BaseNavItem | undefined {
  initializeMaps();
  return PROFILE_MENU_MAP.get(id);
}
