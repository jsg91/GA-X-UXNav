// Base navigation item interface
interface BaseNavItem {
  id: string;
  name: string;
  href: string | null;
  icon: string;
  visible: boolean;
  order: number;
  adminOnly?: boolean;
  userOnly?: boolean;
}

// Role definitions
export interface Role {
  id: string;
  name: string;
  icon: string;
  label: string;
  visible: boolean;
  permissionRequired?: boolean;
}

export const ROLE_CONFIG = {
  roles: [
    { id: 'pilot', name: 'Pilot', icon: 'airplane', label: 'Pilots', visible: true },
    { id: 'instructor', name: 'Instructor', icon: 'school', label: 'Instructors', visible: true },
    { id: 'flightschool-admin', name: 'Flight School Admin', icon: 'school', label: 'Flightschool-Admin', visible: true },
    { id: 'flightclub-admin', name: 'Flight Club Admin', icon: 'account-group', label: 'Flightclub-Admin', visible: true },
    { id: 'aerodrome-admin', name: 'Aerodrome Admin', icon: 'airport', label: 'Aerodrome-Admin', visible: true },
    { id: 'maintenance', name: 'Maintenance', icon: 'wrench', label: 'Maintenance (inventory, marketplace, + admin, permission based)', visible: true },
    { id: 'caa', name: 'CAA', icon: 'shield-check', label: 'CAA (all together, permission based)', visible: true, permissionRequired: true },
    { id: 'customs', name: 'Customs', icon: 'passport', label: 'Customs (all together, permission based)', visible: true, permissionRequired: true },
    { id: 'admin', name: 'Admin', icon: 'cog', label: 'Admin (platform)', visible: true, permissionRequired: true },
  ] as const satisfies readonly Role[],
};

export const NAVIGATION_CONFIG = {
    // ===== APP STORE/FEATURE CATALOG =====
    /**
     * Feature catalog organized by sections - used for "app store" functionality
     * This represents available features/apps organized by category
     */
    appCatalog: {
      sections: [
        {
          title: 'Main',
          items: [
            { icon: 'group', title: 'Club', route: '/(tabs)/club', available: true },
            { icon: 'receipt', route: '/(tabs)/invoicing', title: 'Invoicing', available: true },
            { icon: 'description', title: 'Documents', available: true, route: '/(tabs)/documents' },
            { icon: 'memory', title: 'Todos', available: false },
            { icon: 'memory', title: 'Stats', available: false },
            { icon: 'business', title: 'Organizations', route: '/(tabs)/organizations', available: true },
            { icon: 'event', title: 'Events', route: '/(tabs)/events', available: true },
            { icon: 'storefront', title: 'Marketplace', available: false },
            { icon: 'group', title: "Aviator's Community", available: false },
          ] as const,
        },
        {
          title: 'Flight planning',
          items: [
            { icon: 'map', title: 'Route Planner', route: '/(tabs)/route-planner', available: true },
            { icon: 'public', title: 'Country AIPs', route: '/(tabs)/country-aips', available: true },
          ] as const,
        },
        {
          title: 'Flying',
          items: [
            { icon: 'map', title: 'Weather', available: false },
            { icon: 'map', title: 'Briefing', available: false },
            { icon: 'map', title: 'Performance Tools', subtitle: 'W&B Calculator', available: false },
            { icon: 'map', title: 'Route Planner', route: '/(tabs)/route-planner', available: true },
            { icon: 'map', title: 'Debriefing', available: false },
            { icon: 'place', title: 'Aerodromes', route: '/(tabs)/aerodromes', available: true },
            { icon: 'check-box', title: 'Checklists', route: '/(tabs)/checklists', available: true },
            { icon: 'public', title: 'Country AIPs', route: '/(tabs)/country-aips', available: true },
            { icon: 'person-add', title: 'Virtual Co-Pilot', available: false },
          ] as const,
        },
        {
          title: 'Operations',
          items: [
            { icon: 'event', title: 'Reservations', route: '/(tabs)/reservations', available: true },
            { icon: 'assignment', title: 'Techlog', route: '/(tabs)/techlog', available: true },
            { icon: 'verified', title: 'Customs', available: false },
            { icon: 'radio', title: 'PPR', available: false },
            { icon: 'share', title: 'Equipment sharing', available: false },
            { icon: 'business', title: 'Hangar management', available: false },
          ] as const,
        },
        {
          title: 'Aircraft management',
          items: [
            { icon: 'flight', title: 'Aircrafts', route: '/(tabs)/aircrafts', available: true },
            { icon: 'book', title: 'Logbook', route: '/(tabs)/logbook', available: true },
            { icon: 'business', title: 'Aircraft Manufacturers', available: false },
            { icon: 'build', title: 'Maintenance Organizations', available: false },
            { icon: 'build', title: 'Maintenance', route: '/(tabs)/maintenance', available: true },
            { icon: 'calculate', title: 'FlightClub Accounting', available: false },
            { icon: 'verified', title: 'Insurance Providers', available: false },
            { icon: 'memory', title: 'Systems Vendors', available: false },
            { icon: 'memory', title: 'Decentralized parts management', available: false },
          ] as const,
        },
        {
          title: 'Aerodrome',
          items: [
            { icon: 'place', title: 'Aerodromes', route: '/(tabs)/aerodromes', available: true },
            { icon: 'flight', title: 'Aerodrome Management', available: false },
            { icon: 'flight', title: 'Aerodrome Invoicing', available: false },
            { icon: 'flight', title: 'Aerodrome Accounting', available: false },
          ] as const,
        },
        {
          title: 'Training & safety',
          items: [
            { icon: 'school', title: 'Flight Schools', available: false },
            { icon: 'person', title: 'Instructors', available: false },
            { icon: 'school', title: 'Virtual Instructor', available: false },
            { icon: 'warning', title: 'Occurrence reporting', available: false },
            { icon: 'warning', title: 'Accident Reports', available: false },
            { icon: 'business', title: 'Civil Aviation Authorities', available: false },
            { icon: 'person', title: 'Designated Pilot Examiner (DPE)', available: false },
            { icon: 'local-hospital', title: 'Aviation Medical Examiner (AME)', available: false },
          ] as const,
        },
        {
          title: 'Platform',
          items: [
            { icon: 'lightbulb', title: 'Feature Request', route: '/(tabs)/feature-request', available: true },
            { icon: 'help', title: 'Support', route: '/(tabs)/support', available: true },
            { icon: 'info', title: 'About GA-X', route: '/(tabs)/about', available: true },
          ] as const,
        },
      ] as const,
    },
  
    // ===== ACTUAL NAVIGATION ITEMS =====
    /**
     * Bottom tab bar navigation configuration - actual tabs that exist in the app
     */
    tabBar: {
      items: [
        { id: 'dashboard', name: 'Dashboard', href: '/(tabs)/', icon: 'view-dashboard', visible: true, order: 0 },
        { id: 'reservations', name: 'Reservations', href: '/(tabs)/reservations', icon: 'calendar-check', visible: true, order: 1 },
        { id: 'aircrafts', name: 'Aircrafts', href: '/(tabs)/aircrafts', icon: 'airplane-edit', visible: true, order: 2 },
        { id: 'logbook', name: 'Logbook', href: '/(tabs)/logbook', icon: 'book', visible: true, order: 3 },
        { id: 'maintenance', name: 'Maintenance', href: '/(tabs)/maintenance', icon: 'wrench', visible: true, order: 5 },
        { id: 'club', name: 'Club', href: '/(tabs)/club', icon: 'account-group', visible: true, order: 6 },
        { id: 'aerodromes', name: 'Aerodromes', href: '/(tabs)/aerodromes', icon: 'airport', visible: true, order: 7 },
        { id: 'route-planner', name: 'Route Planner', href: '/(tabs)/route-planner', icon: 'map', visible: true, order: 8 },
        { id: 'documents', name: 'Documents', href: '/(tabs)/documents', icon: 'file-document-multiple', visible: true, order: 9 },
        { id: 'events', name: 'Events', href: '/(tabs)/events', icon: 'stadium-variant', visible: true, order: 10 },
        { id: 'menu', name: 'Menu', href: '/(tabs)/menu', icon: 'menu', visible: true, order: 11 },
        { id: 'admin', name: 'Admin', href: '/(tabs)/admin', icon: 'cog', adminOnly: true, visible: false, order: 12 },
        { id: 'support', name: 'Support', href: '/(tabs)/support', icon: 'help', visible: false, order: 13 },
        { id: 'about', name: 'About', href: '/(tabs)/about', icon: 'info', visible: false, order: 14 },
        { id: 'feature-request', name: 'Feature Request', href: '/(tabs)/feature-request', icon: 'lightbulb', visible: false, order: 15 },
        { id: 'invoicing', name: 'Invoicing', href: '/(tabs)/invoicing', icon: 'receipt', visible: false, order: 16 },
        { id: 'checklists', name: 'Checklists', href: '/(tabs)/checklists', icon: 'check-box', visible: false, order: 17 },
        { id: 'country-aips', name: 'Country AIPs', href: '/(tabs)/country-aips', icon: 'public', visible: false, order: 18 },
        { id: 'organizations', name: 'Organizations', href: '/(tabs)/organizations', icon: 'business', visible: false, order: 19 },
      ] as const satisfies readonly BaseNavItem[],
    },
  
    // ===== PROFILE MENU ITEMS =====
    /**
     * User-specific screens accessible through profile menu
     */
    profileMenu: {
      items: [
        { id: 'profile', name: 'Profile', href: '/(tabs)/profile', icon: 'account', visible: true, order: 0 },
        { id: 'licenses-permits', name: 'Licenses & Permits', href: '/(tabs)/licenses-permits', icon: 'certificate', visible: true, order: 1 },
        { id: 'settings', name: 'Settings', href: '/(tabs)/settings', icon: 'cog', visible: true, order: 2 },
        { id: 'subscription', name: 'Subscription', href: '/(tabs)/subscription', icon: 'credit-card', visible: true, order: 3 },
        { id: 'payments', name: 'Payments', href: '/(tabs)/payments', icon: 'credit-card', visible: true, order: 4 },
        { id: 'logout', name: 'Sign Out', href: null, icon: 'logout', visible: true, order: 5, userOnly: true },
      ] as const satisfies readonly BaseNavItem[],
    },
  } as const;