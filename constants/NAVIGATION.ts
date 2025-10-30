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
  navigation?: Record<string, any>;
  context?: string;
}

// Hierarchical group structure
export interface RoleGroup {
  name: string;
  icon: string;
  roles: Role[];
}

// ===== XUI SCHEMA TYPES =====
// Context types that can be used in role navigation
export type ContextName = 
  | 'default'
  | 'pilot'
  | 'maintenance'
  | 'flightclub_admin'
  | 'flightschool_admin'
  | 'aerodrome_admin'
  | 'platform_admin'
  | 'instructor';

// Entity names used in the system
export type EntityName =
  | 'aircrafts'
  | 'logbookentries'
  | 'reservations'
  | 'users'
  | 'aerodromes'
  | 'maintenance'
  | 'events'
  | 'organizations'
  | 'documents'
  | 'checklists'
  | 'techlog';

// Page configuration for a context
export interface ContextPageConfig {
  title?: string;
  subtitle?: string;
  description?: string;
}

// Context configuration
export interface ContextConfig {
  pages?: {
    list?: ContextPageConfig;
    detail?: ContextPageConfig;
    create?: ContextPageConfig;
    edit?: ContextPageConfig;
  };
  [key: string]: any; // Allow additional context-specific properties
}

// Display information for an entity
export interface EntityDisplay {
  singular: string;
  plural: string;
  icon: string;
  description: string;
}

// XUI Schema Definition for an entity
export interface XUISchemaDefinition {
  entityName: EntityName;
  display: EntityDisplay;
  contexts: Partial<Record<ContextName, ContextConfig>>;
}

export const ROLE_CONFIG = {
  groups: [
    {
      name: 'Flying & Training',
      icon: 'airplane-takeoff',
      roles: [
        {
          id: 'pilot',
          name: 'Pilot',
          icon: 'airplane',
          label: 'Pilot',
          visible: true,
          navigation: {
            aircrafts: {},
            logbookentries: {},
            reservations: {},
            users: { label: 'Find Instructors', icon: 'school' },
            aerodromes: {},
            'route-planner': {
              route: '/(tabs)/route-planner',
              label: 'Route Planner',
              icon: 'map',
              customPage: true,
            },
          },
        },
        {
          id: 'student',
          name: 'Student',
          icon: 'account-school',
          label: 'Student',
          visible: true,
          context: 'pilot',  // Students use pilot context
          navigation: {
            logbookentries: {},
            reservations: {},
            users: { label: 'My Instructor', icon: 'school' },
            training: {
              route: '/(tabs)/training',
              label: 'My Training',
              icon: 'school',
              customPage: true,
            },
          },
        },
        {
          id: 'instructor',
          name: 'Instructor',
          icon: 'school',
          label: 'Instructor',
          visible: true,
          navigation: {
            users: { label: 'My Students', icon: 'account-school' },
            reservations: {},
            aircrafts: {},
            logbookentries: {},
          },
        },
        {
          id: 'safety-officer',
          name: 'Safety Officer',
          icon: 'shield-alert',
          label: 'Safety Officer',
          visible: true,
          context: 'default',
          navigation: {
            incidents: {
              route: '/(tabs)/incidents',
              label: 'Incidents',
              icon: 'shield-alert',
              customPage: true,
            },
            aircrafts: {},
            'safety-reports': {
              route: '/(tabs)/safety-reports',
              label: 'Safety Reports',
              icon: 'clipboard-alert',
              customPage: true,
            },
          },
        },
        {
          id: 'passenger',
          name: 'Passenger',
          icon: 'seat-passenger',
          label: 'Passenger',
          visible: true,
          context: 'pilot',
          navigation: {
            reservations: { label: 'My Flights' },
            aerodromes: {},
          },
        },
      ],
    },
    {
      name: 'Administration',
      icon: 'office-building',
      roles: [
        {
          id: 'organization-admin',
          name: 'Organization Admin',
          icon: 'domain',
          label: 'Organization',
          visible: true,
          context: 'platform_admin',
          navigation: {
            organizations: {},
            members: {
              route: '/(tabs)/members',
              label: 'Members',
              icon: 'account-group',
              customPage: true,
            },
            events: {},
            invoicing: {
              route: '/(tabs)/invoicing',
              label: 'Invoicing',
              icon: 'receipt',
              customPage: true,
            },
          },
        },
        {
          id: 'flightschool-admin',
          name: 'Flight School Admin',
          icon: 'school',
          label: 'Flightschool',
          visible: true,
          context: 'flightschool_admin',
          navigation: {
            users: { label: 'Students' },
            instructors: {
              route: '/(tabs)/instructors',
              label: 'Instructors',
              icon: 'school',
              customPage: true,
            },
            aircrafts: {},
            reservations: {},
            courses: {
              route: '/(tabs)/courses',
              label: 'Courses',
              icon: 'book-open-variant',
              customPage: true,
            },
          },
        },
        {
          id: 'flightclub-admin',
          name: 'Flight Club Admin',
          icon: 'account-group',
          label: 'Flightclub',
          visible: true,
          context: 'flightclub_admin',
          navigation: {
            aircrafts: {},
            members: {
              route: '/(tabs)/members',
              label: 'Members',
              icon: 'account-group',
              customPage: true,
            },
            reservations: {},
            events: {},
            invoicing: {
              route: '/(tabs)/invoicing',
              label: 'Invoicing',
              icon: 'receipt',
              customPage: true,
            },
          },
        },
        {
          id: 'fbo-admin',
          name: 'FBO Admin',
          icon: 'airplane-landing',
          label: 'FBO',
          visible: true,
          context: 'default',
          navigation: {
            aerodromes: {},
            fuel: {
              route: '/(tabs)/fuel',
              label: 'Fuel Services',
              icon: 'gas-station',
              customPage: true,
            },
            services: {
              route: '/(tabs)/services',
              label: 'Services',
              icon: 'room-service',
              customPage: true,
            },
          },
        },
        {
          id: 'aerodrome-admin',
          name: 'Aerodrome Admin',
          icon: 'airport',
          label: 'Aerodrome',
          visible: true,
          context: 'aerodrome_admin',
          navigation: {
            aerodromes: {},
            movements: {
              route: '/(tabs)/movements',
              label: 'Movements',
              icon: 'airplane-takeoff',
              customPage: true,
            },
            parking: {
              route: '/(tabs)/parking',
              label: 'Parking',
              icon: 'parking',
              customPage: true,
            },
            fuel: {
              route: '/(tabs)/fuel',
              label: 'Fuel',
              icon: 'gas-station',
              customPage: true,
            },
          },
        },
        {
          id: 'maintenance',
          name: 'Maintenance',
          icon: 'wrench',
          label: 'Maintenance',
          visible: true,
          navigation: {
            aircrafts: {},
            maintenance: {},
            inspections: {
              route: '/(tabs)/inspections',
              label: 'Inspections',
              icon: 'clipboard-check',
              customPage: true,
            },
            parts: {
              route: '/(tabs)/parts',
              label: 'Parts',
              icon: 'cog',
              customPage: true,
            },
          },
        },
      ],
    },
    {
      name: 'Manufacturing & Inspection',
      icon: 'factory',
      roles: [
        {
          id: 'builder',
          name: 'Experimental Builder',
          icon: 'hammer-wrench',
          label: 'Experimental Builder',
          visible: true,
          context: 'default',
          navigation: {
            'my-projects': {
              route: '/(tabs)/my-projects',
              label: 'My Projects',
              icon: 'hammer-wrench',
              customPage: true,
            },
            aircrafts: {},
            'build-log': {
              route: '/(tabs)/build-log',
              label: 'Build Log',
              icon: 'notebook',
              customPage: true,
            },
          },
        },
        {
          id: 'manufacturer',
          name: 'Manufacturer',
          icon: 'factory',
          label: 'Manufacturing',
          visible: true,
          context: 'default',
          navigation: {
            products: {
              route: '/(tabs)/products',
              label: 'Products',
              icon: 'factory',
              customPage: true,
            },
            aircrafts: {},
            orders: {
              route: '/(tabs)/orders',
              label: 'Orders',
              icon: 'cart',
              customPage: true,
            },
          },
        },
        {
          id: 'inspector',
          name: 'Inspector',
          icon: 'clipboard-search',
          label: 'Consultant / Inspector',
          visible: true,
          context: 'default',
          navigation: {
            inspections: {
              route: '/(tabs)/inspections',
              label: 'Inspections',
              icon: 'clipboard-search',
              customPage: true,
            },
            aircrafts: {},
            reports: {
              route: '/(tabs)/reports',
              label: 'Reports',
              icon: 'file-document',
              customPage: true,
            },
          },
        },
      ],
    },
    {
      name: 'Certification',
      icon: 'certificate',
      roles: [
        {
          id: 'dpe',
          name: 'Designated Pilot Examiner',
          icon: 'clipboard-check',
          label: 'DPE',
          visible: true,
          permissionRequired: true,
          context: 'default',
          navigation: {
            examinations: {
              route: '/(tabs)/examinations',
              label: 'Examinations',
              icon: 'clipboard-check',
              customPage: true,
            },
            candidates: {
              route: '/(tabs)/candidates',
              label: 'Candidates',
              icon: 'account-multiple',
              customPage: true,
            },
          },
        },
        {
          id: 'ame',
          name: 'Aviation Medical Examiner',
          icon: 'stethoscope',
          label: 'AME',
          visible: true,
          permissionRequired: true,
          context: 'default',
          navigation: {
            'medical-exams': {
              route: '/(tabs)/medical-exams',
              label: 'Medical Exams',
              icon: 'stethoscope',
              customPage: true,
            },
            patients: {
              route: '/(tabs)/patients',
              label: 'Patients',
              icon: 'account-heart',
              customPage: true,
            },
          },
        },
      ],
    },
    {
      name: 'Insurance',
      icon: 'shield-account',
      roles: [
        {
          id: 'insurance-broker',
          name: 'Insurance Broker',
          icon: 'shield-account',
          label: 'Insurance Broker',
          visible: true,
          permissionRequired: true,
          context: 'default',
          navigation: {
            policies: {
              route: '/(tabs)/policies',
              label: 'Policies',
              icon: 'shield-account',
              customPage: true,
            },
            clients: {
              route: '/(tabs)/clients',
              label: 'Clients',
              icon: 'account-multiple',
              customPage: true,
            },
          },
        },
      ],
    },
    {
      name: 'Regulatory',
      icon: 'gavel',
      roles: [
        {
          id: 'caa',
          name: 'CAA',
          icon: 'shield-check',
          label: 'CAA',
          visible: true,
          permissionRequired: true,
          navigation: {
            aircrafts: {},
            registrations: {
              route: '/(tabs)/registrations',
              label: 'Registrations',
              icon: 'certificate',
              customPage: true,
            },
            licenses: {
              route: '/(tabs)/licenses',
              label: 'Licenses',
              icon: 'card-account-details',
              customPage: true,
            },
            incidents: {
              route: '/(tabs)/incidents',
              label: 'Incidents',
              icon: 'alert',
              customPage: true,
            },
          },
        },
        {
          id: 'customs',
          name: 'Customs',
          icon: 'passport',
          label: 'Custom',
          visible: true,
          permissionRequired: true,
          context: 'default',
          navigation: {
            declarations: {
              route: '/(tabs)/declarations',
              label: 'Declarations',
              icon: 'passport',
              customPage: true,
            },
            flights: {
              route: '/(tabs)/flights',
              label: 'International Flights',
              icon: 'airplane',
              customPage: true,
            },
          },
        },
      ],
    },
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
} as const;

// ===== XUI SCHEMA REGISTRY =====
/**
 * XUI Schema Registry - defines entity display and context-specific configurations
 * This registry is used to generate navigation items and page configurations
 * based on roles and contexts.
 */
export const XUISCHEMA_REGISTRY: Record<EntityName, XUISchemaDefinition> = {
  // Aviation Entities
  aircrafts: {
    entityName: 'aircrafts',
    display: {
      singular: 'Aircraft',
      plural: 'Aircrafts',
      icon: 'airplane',
      description: 'Manage your aircraft fleet',
    },
    contexts: {
      default: {},
      pilot: {
        pages: {
          list: { title: 'My Aircraft', subtitle: 'Your personal aircraft' },
        },
      },
      maintenance: {
        pages: {
          list: { title: 'Aircraft Maintenance', subtitle: 'Maintenance tracking' },
        },
      },
      flightclub_admin: {
        pages: {
          list: { title: 'Fleet Management', subtitle: 'Manage club aircraft' },
        },
      },
    },
  },

  logbookentries: {
    entityName: 'logbookentries',
    display: {
      singular: 'Logbook Entry',
      plural: 'Logbook',
      icon: 'book-open-variant',
      description: 'Flight logbook entries',
    },
    contexts: {
      default: {},
      pilot: {
        pages: {
          list: { title: 'My Logbook', subtitle: 'Your flight history' },
        },
      },
      instructor: {
        pages: {
          list: { title: 'Student Logbooks', subtitle: 'Track student progress' },
        },
      },
    },
  },

  reservations: {
    entityName: 'reservations',
    display: {
      singular: 'Reservation',
      plural: 'Reservations',
      icon: 'calendar-check',
      description: 'Aircraft reservations and bookings',
    },
    contexts: {
      default: {},
      pilot: {
        pages: {
          list: { title: 'My Reservations', subtitle: 'Your upcoming flights' },
        },
      },
      flightclub_admin: {
        pages: {
          list: { title: 'All Reservations', subtitle: 'Manage club bookings' },
        },
      },
    },
  },

  users: {
    entityName: 'users',
    display: {
      singular: 'User',
      plural: 'Users',
      icon: 'account',
      description: 'User management',
    },
    contexts: {
      default: {},
      pilot: {
        pages: {
          list: { title: 'Instructors', subtitle: 'Find qualified instructors' },
        },
      },
      instructor: {
        pages: {
          list: { title: 'My Students', subtitle: 'Track student progress' },
        },
      },
      flightschool_admin: {
        pages: {
          list: { title: 'Students', subtitle: 'All enrolled students' },
        },
      },
      platform_admin: {
        pages: {
          list: { title: 'All Users', subtitle: 'Platform user management' },
        },
      },
    },
  },

  aerodromes: {
    entityName: 'aerodromes',
    display: {
      singular: 'Aerodrome',
      plural: 'Aerodromes',
      icon: 'airport',
      description: 'Airport and aerodrome information',
    },
    contexts: {
      default: {},
      pilot: {
        pages: {
          list: { title: 'Aerodromes', subtitle: 'Find airports and airfields' },
        },
      },
      aerodrome_admin: {
        pages: {
          list: { title: 'Aerodrome Management', subtitle: 'Manage your aerodrome' },
        },
      },
    },
  },

  maintenance: {
    entityName: 'maintenance',
    display: {
      singular: 'Maintenance Record',
      plural: 'Maintenance',
      icon: 'wrench',
      description: 'Aircraft maintenance records',
    },
    contexts: {
      default: {},
      maintenance: {
        pages: {
          list: { title: 'Maintenance Records', subtitle: 'Track aircraft maintenance' },
        },
      },
      flightclub_admin: {
        pages: {
          list: { title: 'Fleet Maintenance', subtitle: 'Club aircraft maintenance' },
        },
      },
    },
  },

  events: {
    entityName: 'events',
    display: {
      singular: 'Event',
      plural: 'Events',
      icon: 'calendar-star',
      description: 'Club events and activities',
    },
    contexts: {
      default: {},
      pilot: {
        pages: {
          list: { title: 'Events', subtitle: 'Upcoming club events' },
        },
      },
      flightclub_admin: {
        pages: {
          list: { title: 'Event Management', subtitle: 'Organize club events' },
        },
      },
    },
  },

  organizations: {
    entityName: 'organizations',
    display: {
      singular: 'Organization',
      plural: 'Organizations',
      icon: 'domain',
      description: 'Aviation organizations',
    },
    contexts: {
      default: {},
      platform_admin: {
        pages: {
          list: { title: 'Organizations', subtitle: 'Manage organizations' },
        },
      },
    },
  },

  documents: {
    entityName: 'documents',
    display: {
      singular: 'Document',
      plural: 'Documents',
      icon: 'file-document-multiple',
      description: 'Aviation documents and files',
    },
    contexts: {
      default: {},
      pilot: {
        pages: {
          list: { title: 'My Documents', subtitle: 'Your aviation documents' },
        },
      },
    },
  },

  checklists: {
    entityName: 'checklists',
    display: {
      singular: 'Checklist',
      plural: 'Checklists',
      icon: 'clipboard-check-outline',
      description: 'Flight checklists and procedures',
    },
    contexts: {
      default: {},
      pilot: {
        pages: {
          list: { title: 'Checklists', subtitle: 'Flight procedures' },
        },
      },
    },
  },

  techlog: {
    entityName: 'techlog',
    display: {
      singular: 'Tech Log Entry',
      plural: 'Tech Log',
      icon: 'notebook',
      description: 'Technical log entries',
    },
    contexts: {
      default: {},
      pilot: {
        pages: {
          list: { title: 'Tech Log', subtitle: 'Aircraft technical log' },
        },
      },
      maintenance: {
        pages: {
          list: { title: 'Technical Logs', subtitle: 'Review tech log entries' },
        },
      },
    },
  },
} as const satisfies Record<EntityName, XUISchemaDefinition>;

// ===== NAVIGATION GENERATION UTILITIES =====
/**
 * Generate navigation items for a role based on ROLE_CONFIG and XUISCHEMA_REGISTRY
 */
export interface GeneratedNavItem {
  id: string;
  name: string;
  href: string;
  icon: string;
  label: string;
  description?: string;
  customPage?: boolean;
}

/**
 * Map entity names to route-friendly names (e.g., 'logbookentries' -> 'logbook')
 */
function getRouteNameForEntity(entityName: EntityName | string): string {
  const routeMap: Record<string, string> = {
    'logbookentries': 'logbook',
    'aircrafts': 'aircrafts',
    'reservations': 'reservations',
    'aerodromes': 'aerodromes',
    'maintenance': 'maintenance',
    'events': 'events',
    'documents': 'documents',
    'checklists': 'checklists',
    'techlog': 'techlog',
    'organizations': 'organizations',
    'users': 'users',
  };
  return routeMap[entityName] || entityName;
}

export function generateNavigationForRole(role: Role): GeneratedNavItem[] {
  const navItems: GeneratedNavItem[] = [];
  
  if (!role.navigation) {
    return navItems;
  }

  // Get the context to use for this role (defaults to role.id or 'default')
  const contextName: ContextName = (role.context as ContextName) || role.id as ContextName || 'default';

  // Iterate through navigation items in the role
  Object.entries(role.navigation).forEach(([entityKey, navConfig]) => {
    // Check if it's a custom page (not in XUISCHEMA_REGISTRY)
    if (navConfig && typeof navConfig === 'object' && 'customPage' in navConfig && navConfig.customPage) {
      // Custom page - use the config directly
      navItems.push({
        id: entityKey,
        name: navConfig.label || entityKey,
        href: navConfig.route || `/(tabs)/${entityKey}`,
        icon: navConfig.icon || 'file',
        label: navConfig.label || entityKey,
        customPage: true,
      });
    } else {
      // Entity-based navigation - look up in XUISCHEMA_REGISTRY
      const entityName = entityKey as EntityName;
      const schema = XUISCHEMA_REGISTRY[entityName];
      
      if (schema) {
        // Get context-specific config
        const contextConfig = schema.contexts[contextName] || schema.contexts.default || {};
        const pageConfig = contextConfig.pages?.list || {};
        
        // Override with role-specific config if provided
        const roleOverride = navConfig && typeof navConfig === 'object' ? navConfig : {};
        
        navItems.push({
          id: entityName,
          name: roleOverride.label || pageConfig.title || schema.display.plural,
          href: `/(tabs)/${getRouteNameForEntity(entityName)}`,
          icon: roleOverride.icon || schema.display.icon,
          label: roleOverride.label || pageConfig.title || schema.display.plural,
          description: pageConfig.subtitle || schema.display.description,
          customPage: false,
        });
      }
    }
  });

  return navItems;
}

/**
 * Get page information for an entity based on current role
 * Uses the same logic as navigation generation to ensure consistency
 * Handles both entities in XUISCHEMA_REGISTRY and custom pages
 */
export function getPageInfoForEntity(entityName: EntityName | string, role: Role): { title: string; description?: string } {
  // First check if it's a custom page in the role's navigation config
  const navConfig = role.navigation?.[entityName];
  if (navConfig && typeof navConfig === 'object' && 'customPage' in navConfig && navConfig.customPage) {
    return {
      title: navConfig.label || entityName,
      description: navConfig.description,
    };
  }

  // Otherwise, look up in XUISCHEMA_REGISTRY (only if it's a valid EntityName)
  const schema = entityName in XUISCHEMA_REGISTRY ? XUISCHEMA_REGISTRY[entityName as EntityName] : undefined;
  if (!schema) {
    // Fallback: check if there's a label override in navigation config even if not custom page
    if (navConfig && typeof navConfig === 'object' && navConfig.label) {
      return { title: navConfig.label };
    }
    return { title: entityName };
  }

  // Get the context to use for this role
  const contextName: ContextName = (role.context as ContextName) || role.id as ContextName || 'default';
  
  // Get context-specific config
  const contextConfig = schema.contexts[contextName] || schema.contexts.default || {};
  const pageConfig = contextConfig.pages?.list || {};
  
  // Check for role-specific label override in navigation config (same logic as generateNavigationForRole)
  const roleOverride = navConfig && typeof navConfig === 'object' ? navConfig : {};

  return {
    title: roleOverride.label || pageConfig.title || schema.display.plural,
    description: pageConfig.subtitle || schema.display.description,
  };
}

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
        focusSearch: { keys: 'cmd+k, ctrl+k, ctrl+f, /', description: 'Focus search field' },
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

// ===== NAVIGATION CONFIG HELPERS =====
/**
 * Get page information for a navigation item from NAVIGATION_CONFIG
 * Used for top navigation and profile menu routes
 */
export function getPageInfoFromNavConfig(routeId: string): { title: string; icon: string; description?: string } | null {
  // Special routes for top nav buttons
  if (routeId === 'notifications') {
    return {
      title: 'Notifications',
      icon: 'bell',
      description: 'View your notifications',
    };
  }
  if (routeId === 'messages') {
    return {
      title: 'Messages',
      icon: 'message-text',
      description: 'View your messages',
    };
  }
  if (routeId === 'news') {
    return {
      title: 'Aviation News',
      icon: 'newspaper',
      description: 'Latest aviation news, weather updates, and regulatory changes',
    };
  }

  // Check tabBar items
  const tabBarItem = NAVIGATION_CONFIG.tabBar.items.find(item => item.id === routeId);
  if (tabBarItem) {
    return {
      title: tabBarItem.name,
      icon: tabBarItem.icon,
      description: `${tabBarItem.name} page`,
    };
  }

  // Check profileMenu items
  const profileMenuItem = NAVIGATION_CONFIG.profileMenu.items.find(item => item.id === routeId);
  if (profileMenuItem) {
    return {
      title: profileMenuItem.name,
      icon: profileMenuItem.icon,
      description: `${profileMenuItem.name} page`,
    };
  }

  return null;
}