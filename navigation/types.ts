// ===== NAVIGATION TYPES =====

// Base navigation item interface
export interface BaseNavItem {
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

// Role definitions with improved type safety
export interface Role {
  id: string;
  name: string;
  icon: string;
  label: string;
  comingSoon?: boolean;
  navigation?: RoleNavigation;
  context?: ContextName; // Use ContextName instead of string
}

// Hierarchical group structure
export interface RoleGroup {
  name: string;
  icon: string;
  roles: Role[];
}

// Role navigation item types
export interface RoleNavigationItem {
  route?: string;
  label?: string;
  icon?: string;
  customPage?: boolean;
  main?: boolean;
}

// Discriminated union for role navigation values
export type RoleNavigationValue =
  | RoleNavigationItem  // Full configuration
  | boolean;           // Simple enable/disable

export type RoleNavigation = Record<string, RoleNavigationValue>;

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

// Generated navigation item (result of processing role navigation)
export interface GeneratedNavItem {
  id: string;
  name: string;
  href: string;
  icon: string;
  label: string;
  description?: string;
  customPage?: boolean;
}

// Hotkey configuration types
export interface HotkeyConfig {
  keys: string[];
  route?: string;
  action?: string;
  description: string;
}

export interface HotkeyGroup {
  [key: string]: HotkeyConfig;
}

export interface HotkeysConfig {
  navigation: HotkeyGroup;
  actions: HotkeyGroup;
  contextual: Record<string, { [key: string]: { action: string; description: string } }>;
}

// Page info result type
export interface PageInfo {
  title: string;
  icon: string;
  description?: string;
}
