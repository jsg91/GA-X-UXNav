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
  smallScreen?: boolean; // Only show on small screens (bottom nav)
  largeScreen?: boolean; // Only show on large screens (sidebar)
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

// Hierarchical group structure
export interface RoleGroup {
  name: string;
  icon: string;
  roles: Role[];
}

export const ROLE_CONFIG = {
  groups: [
    {
      name: 'Flying & Training',
      icon: 'airplane-takeoff',
      roles: [
        { id: 'pilot', name: 'Pilot', icon: 'airplane', label: 'Pilots', visible: true },
        { id: 'instructor', name: 'Instructor', icon: 'school', label: 'Instructors', visible: true },
        { id: 'ground-instructor', name: 'Ground Instructor', icon: 'teach', label: 'Ground Instructors', visible: true },
        { id: 'student', name: 'Student', icon: 'account-school', label: 'Students', visible: true },
        { id: 'passenger', name: 'Passenger', icon: 'seat-passenger', label: 'Passengers', visible: true },
        { id: 'safety-officer', name: 'Safety Officer', icon: 'shield-alert', label: 'Safety Officers', visible: true },
      ]
    },
    {
      name: 'Administration',
      icon: 'office-building',
      roles: [
        { id: 'flightclub-admin', name: 'Flight Club Admin', icon: 'account-group', label: 'Flightclub-Admin', visible: true },
        { id: 'flightschool-admin', name: 'Flight School Admin', icon: 'school', label: 'Flightschool-Admin', visible: true },
        { id: 'fbo-admin', name: 'FBO Admin', icon: 'airplane-landing', label: 'FBO-Admins', visible: true },
        { id: 'aerodrome-admin', name: 'Aerodrome Admin', icon: 'airport', label: 'Aerodrome-Admin', visible: true },
        { id: 'maintenance', name: 'Maintenance', icon: 'wrench', label: 'Maintenance', visible: true },
      ]
    },
    {
      name: 'Manufacturing & Inspection',
      icon: 'factory',
      roles: [
        { id: 'builder', name: 'Experimental Builder', icon: 'hammer-wrench', label: 'Experimental Builders', visible: true },
        { id: 'manufacturer', name: 'Manufacturer', icon: 'factory', label: 'Manufacturers', visible: true },
        { id: 'systems-vendor', name: 'Systems Vendor', icon: 'chip', label: 'Systems Vendors', visible: true },
        { id: 'consultant', name: 'Engineering Consultant', icon: 'account-tie', label: 'Engineering Consultants', visible: true },
        { id: 'inspector', name: 'Inspector', icon: 'clipboard-search', label: 'Inspectors', visible: true },
      ]
    },
    {
      name: 'Certification',
      icon: 'certificate',
      roles: [
        { id: 'dpe', name: 'Designated Pilot Examiner', icon: 'clipboard-check', label: 'DPEs', visible: true, permissionRequired: true },
        { id: 'ame', name: 'Aviation Medical Examiner', icon: 'stethoscope', label: 'AMEs', visible: true, permissionRequired: true },
      ]
    },
    {
      name: 'Insurance',
      icon: 'shield-account',
      roles: [
        { id: 'insurance-broker', name: 'Insurance Broker', icon: 'shield-account', label: 'Insurance Brokers', visible: true },
      ]
    },
    {
      name: 'Regulatory',
      icon: 'gavel',
      roles: [
        { id: 'caa', name: 'CAA', icon: 'shield-check', label: 'CAA', visible: true, permissionRequired: true },
        { id: 'customs', name: 'Customs', icon: 'passport', label: 'Customs', visible: true, permissionRequired: true },
      ]
    }
  ] as const satisfies readonly RoleGroup[],

  // ===== STANDALONE ADMIN ROLE =====
  adminRole: { id: 'admin', name: 'Admin', icon: 'cog', label: 'Admin (platform)', visible: true, permissionRequired: true },

  // ===== HIERARCHICAL NAVIGATION HELPERS =====
  /**
   * Get all roles as a flat array (for backward compatibility)
   */
  getAllRoles(): Role[] {
    const roles: Role[] = [];
    this.groups.forEach(group => {
      roles.push(...group.roles);
    });
    roles.push(this.adminRole);
    return roles;
  },

  /**
   * Find a role by ID
   */
  getRoleById(id: string): Role | undefined {
    if (id === 'admin') {
      return this.adminRole;
    }
    return this.getAllRoles().find(role => role.id === id);
  },

  /**
   * Get roles that don't require special permissions
   */
  getBasicRoles(): Role[] {
    return this.getAllRoles().filter(role => role.visible && !role.permissionRequired);
  },

  /**
   * Get roles that require special permissions
   */
  getPermissionRequiredRoles(): Role[] {
    return this.getAllRoles().filter(role => role.visible && role.permissionRequired);
  },

  /**
   * Get roles by group name
   */
  getRolesByGroup(groupName: string): Role[] {
    const group = this.groups.find(g => g.name === groupName);
    if (!group) return [];

    return group.roles.filter(role => role.visible);
  },

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
        { id: 'dashboard', name: 'Dashboard', href: '/(tabs)/', icon: 'view-dashboard', visible: true, order: 0, smallScreen: true },
        { id: 'reservations', name: 'Reservations', href: '/(tabs)/reservations', icon: 'calendar-check', visible: true, order: 1, largeScreen: true },
        { id: 'aircrafts', name: 'Fly', href: '/(tabs)/aircrafts', icon: 'airplane', visible: true, order: 2, smallScreen: true },
        { id: 'logbook', name: 'Log', href: '/(tabs)/logbook', icon: 'book-open-variant', visible: true, order: 3, smallScreen: true },
        { id: 'maintenance', name: 'Maintenance', href: '/(tabs)/maintenance', icon: 'wrench', visible: true, order: 5, largeScreen: true },
        { id: 'club', name: 'Club', href: '/(tabs)/club', icon: 'account-group', visible: true, order: 6, smallScreen: true },
        { id: 'aerodromes', name: 'Aerodromes', href: '/(tabs)/aerodromes', icon: 'airport', visible: true, order: 7, largeScreen: true },
        { id: 'route-planner', name: 'Plan', href: '/(tabs)/route-planner', icon: 'map', visible: true, order: 8, smallScreen: true },
        { id: 'documents', name: 'Documents', href: '/(tabs)/documents', icon: 'file-document-multiple', visible: true, order: 9, smallScreen: true },
        { id: 'events', name: 'Events', href: '/(tabs)/events', icon: 'calendar-star', visible: true, order: 10, largeScreen: true },
        { id: 'menu', name: 'Menu', href: '/(tabs)/menu', icon: 'menu', visible: true, order: 11, smallScreen: true },
        { id: 'admin', name: 'Admin', href: '/(tabs)/admin', icon: 'cog', adminOnly: true, visible: false, order: 12, largeScreen: true },
        { id: 'support', name: 'Support', href: '/(tabs)/support', icon: 'help', visible: false, order: 13, largeScreen: true },
        { id: 'about', name: 'About', href: '/(tabs)/about', icon: 'info', visible: false, order: 14, largeScreen: true },
        { id: 'feature-request', name: 'Feature Request', href: '/(tabs)/feature-request', icon: 'lightbulb', visible: false, order: 15, largeScreen: true },
        { id: 'invoicing', name: 'Invoicing', href: '/(tabs)/invoicing', icon: 'receipt', visible: false, order: 16, largeScreen: true },
        { id: 'checklists', name: 'Checklists', href: '/(tabs)/checklists', icon: 'checkbox-marked', visible: false, order: 17, largeScreen: true },
        { id: 'country-aips', name: 'Country AIPs', href: '/(tabs)/country-aips', icon: 'earth', visible: false, order: 18, largeScreen: true },
        { id: 'organizations', name: 'Organizations', href: '/(tabs)/organizations', icon: 'office-building', visible: false, order: 19, largeScreen: true },
        { id: 'tips', name: 'Tips', href: '/(tabs)/tips', icon: 'lightbulb', visible: true, order: 20, smallScreen: true, largeScreen: true },
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

    // ===== HOTKEYS CONFIGURATION =====
    /**
     * Keyboard shortcuts configuration for web platform
     */
    hotkeys: {
      // Navigation shortcuts (GitHub-style)
      navigation: {
        dashboard: { keys: 'g d', route: '/(tabs)/', description: 'Go to Dashboard' },
        reservations: { keys: 'g r', route: '/(tabs)/reservations', description: 'Go to Reservations' },
        logbook: { keys: 'g l', route: '/(tabs)/logbook', description: 'Go to Logbook' },
        aircrafts: { keys: 'g a', route: '/(tabs)/aircrafts', description: 'Go to Aircraft' },
        aerodromes: { keys: 'g e', route: '/(tabs)/aerodromes', description: 'Go to Aerodromes' },
        maintenance: { keys: 'g m', route: '/(tabs)/maintenance', description: 'Go to Maintenance' },
        routePlanner: { keys: 'g p', route: '/(tabs)/route-planner', description: 'Go to Route Planner' },
      },

      // Global actions
      actions: {
        focusSearch: { keys: 'cmd+k, ctrl+k, /', description: 'Focus search field' },
        toggleAI: { keys: 'cmd+j, ctrl+j, shift+space', description: 'Toggle AI Assistant' },
        newItem: { keys: 'n', description: 'Create new item (context-aware)' },
        help: { keys: 'shift+?', route: '/(tabs)/tips', description: 'Show keyboard shortcuts' },
        closeModals: { keys: 'escape', description: 'Close modals and overlays' },
      },

      // Context-aware actions by route
      contextual: {
        '/(tabs)/reservations': {
          newItem: { action: 'newReservation', description: 'New Reservation' }
        },
        '/(tabs)/logbook': {
          newItem: { action: 'newLogEntry', description: 'New Log Entry' }
        },
        '/(tabs)/aircrafts': {
          newItem: { action: 'newFlight', description: 'New Flight' }
        }
      }
    } as const,
  } as const;