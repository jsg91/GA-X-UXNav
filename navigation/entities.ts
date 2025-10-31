import { buildRoute } from './index';

import {
  ContextName,
  EntityName,
  GeneratedNavItem,
  Role,
  XUISchemaDefinition,
} from './types';
import { resolveContextForRole } from './utils';

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

// ===== NAVIGATION CACHE =====
import { navigationCache, CacheKeyGenerator } from './cache';

// ===== NAVIGATION GENERATION UTILITIES =====

/**
 * Get route-friendly name for an entity (derived from XUISCHEMA_REGISTRY)
 * Uses display.plural if it differs from entityName, otherwise uses entityName
 * This replaces the static ENTITY_ROUTE_MAP constant
 */
export function getRouteNameForEntity(entityName: EntityName | string): string {
  const schema = XUISCHEMA_REGISTRY[entityName as EntityName];
  if (schema && schema.display.plural) {
    const pluralLower = schema.display.plural.toLowerCase();
    // If plural form differs from entityName, use plural as route name
    // Example: 'logbookentries' -> 'Logbook' -> 'logbook'
    if (pluralLower !== entityName.toLowerCase()) {
      return pluralLower;
    }
  }
  // Default: use entityName as route name
  return entityName;
}

/**
 * Get entity name from route name (reverse lookup, derived from XUISCHEMA_REGISTRY and ROLE_CONFIG)
 * Checks XUISCHEMA_REGISTRY first, then custom pages in ROLE_CONFIG
 * This replaces the static ROUTE_ENTITY_MAP constant
 */
export function getEntityNameForRoute(routeName: string): EntityName | string {
  // Check XUISCHEMA_REGISTRY - reverse lookup by comparing route names
  for (const [entityName, schema] of Object.entries(XUISCHEMA_REGISTRY)) {
    const route = getRouteNameForEntity(entityName);
    if (route === routeName) {
      return entityName as EntityName;
    }
  }

  // Fallback: assume route name is entity name (for identity mappings)
  return routeName;
}

/**
 * Generate a page description from a page name
 * Centralized description formatting
 */
function getPageDescription(name: string): string {
  return `${name} page`;
}

/**
 * Generate navigation items for a role based on ROLE_CONFIG and XUISCHEMA_REGISTRY
 * With caching to avoid recomputation
 */
export function generateNavigationForRole(role: Role): GeneratedNavItem[] {
  const cacheKey = CacheKeyGenerator.navigationForRole(role.id, role.context);

  const cached = navigationCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const navItems: GeneratedNavItem[] = [];

  if (!role.navigation) {
    return navItems;
  }

  // Get the context to use for this role
  const contextName: ContextName = resolveContextForRole(role);

  // Iterate through navigation items in the role
  Object.entries(role.navigation).forEach(([entityKey, navConfig]) => {
    // Check if it's a custom page (not in XUISCHEMA_REGISTRY)
    if (navConfig && typeof navConfig === 'object' && 'customPage' in navConfig && navConfig.customPage) {
      // Custom page - use the config directly
      navItems.push({
        id: entityKey,
        name: navConfig.label || entityKey,
        href: navConfig.route || buildRoute(entityKey),
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
          href: buildRoute(getRouteNameForEntity(entityName)),
          icon: roleOverride.icon || schema.display.icon,
          label: roleOverride.label || pageConfig.title || schema.display.plural,
          description: pageConfig.subtitle || schema.display.description,
          customPage: false,
        });
      }
    }
  });

  // Cache the result
  navigationCache.set(cacheKey, navItems);
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
  const contextName: ContextName = resolveContextForRole(role);

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

/**
 * Validation function for navigation items
 */
export function isValidNavigationItem(item: any): item is GeneratedNavItem {
  return (
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.icon === 'string' &&
    typeof item.href === 'string'
  );
}
