import {
  BaseNavItem,
  ContextName,
  EntityName,
  GeneratedNavItem,
  Role,
  RoleNavigation,
  RoleNavigationItem,
} from './types';
import { NAVIGATION_ERRORS, NAVIGATION_CONSTANTS } from './constants';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validation error interface
 */
export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  value?: any;
  suggestion?: string;
}

/**
 * Validation warning interface
 */
export interface ValidationWarning {
  code: string;
  message: string;
  field?: string;
  value?: any;
  suggestion?: string;
}

/**
 * Comprehensive validation system for navigation components
 */
export class NavigationValidator {
  private static readonly VALID_ENTITY_NAMES: EntityName[] = [
    'aircrafts', 'logbookentries', 'reservations', 'users', 'aerodromes',
    'maintenance', 'events', 'organizations', 'documents', 'checklists', 'techlog'
  ];

  private static readonly VALID_CONTEXT_NAMES: ContextName[] = [
    'default', 'pilot', 'maintenance', 'flightclub_admin', 'flightschool_admin',
    'aerodrome_admin', 'platform_admin', 'instructor'
  ];

  /**
   * Validate a complete navigation configuration
   */
  static validateNavigationConfig(config: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate tabBar
    if (config.tabBar?.items) {
      const tabBarResult = this.validateNavigationItems(config.tabBar.items, 'tabBar');
      errors.push(...tabBarResult.errors);
      warnings.push(...tabBarResult.warnings);
    }

    // Validate profileMenu
    if (config.profileMenu?.items) {
      const profileResult = this.validateNavigationItems(config.profileMenu.items, 'profileMenu');
      errors.push(...profileResult.errors);
      warnings.push(...profileResult.warnings);
    }

    // Validate hotkeys
    if (config.hotkeys) {
      const hotkeysResult = this.validateHotkeys(config.hotkeys);
      errors.push(...hotkeysResult.errors);
      warnings.push(...hotkeysResult.warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate an array of navigation items
   */
  static validateNavigationItems(
    items: any[],
    context: string = 'navigation'
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!Array.isArray(items)) {
      errors.push({
        code: 'INVALID_TYPE',
        message: `${context}: Expected array, got ${typeof items}`,
        field: context,
        value: items,
      });
      return { isValid: false, errors, warnings };
    }

    // Check for duplicate IDs
    const ids = new Set<string>();
    const duplicates: string[] = [];

    items.forEach((item, index) => {
      if (item?.id) {
        if (ids.has(item.id)) {
          duplicates.push(item.id);
        } else {
          ids.add(item.id);
        }
      }
    });

    duplicates.forEach(id => {
      errors.push({
        code: 'DUPLICATE_ID',
        message: `${context}: Duplicate navigation item ID "${id}"`,
        field: `${context}[].id`,
        value: id,
        suggestion: 'Ensure all navigation item IDs are unique',
      });
    });

    // Validate each item
    items.forEach((item, index) => {
      const itemResult = this.validateNavigationItem(item, `${context}[${index}]`);
      errors.push(...itemResult.errors);
      warnings.push(...itemResult.warnings);
    });

    // Check ordering
    const sortedItems = [...items].sort((a, b) => (a?.order || 0) - (b?.order || 0));
    const isSorted = items.every((item, index) =>
      !item || !sortedItems[index] || item.id === sortedItems[index].id
    );

    if (!isSorted) {
      warnings.push({
        code: 'UNSORTED_ITEMS',
        message: `${context}: Navigation items are not sorted by order`,
        field: context,
        suggestion: 'Sort navigation items by order property for consistent display',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate a single navigation item
   */
  static validateNavigationItem(
    item: any,
    context: string = 'item'
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Type check
    if (typeof item !== 'object' || item === null) {
      errors.push({
        code: 'INVALID_TYPE',
        message: `${context}: Expected object, got ${typeof item}`,
        field: context,
        value: item,
      });
      return { isValid: false, errors, warnings };
    }

    // Required fields
    const requiredFields: (keyof BaseNavItem)[] = ['id', 'name', 'icon'];
    requiredFields.forEach(field => {
      if (!item[field]) {
        errors.push({
          code: 'MISSING_REQUIRED_FIELD',
          message: `${context}: Missing required field "${field}"`,
          field: `${context}.${field}`,
          value: item[field],
        });
      }
    });

    // Field type validation
    if (item.id && typeof item.id !== 'string') {
      errors.push({
        code: 'INVALID_FIELD_TYPE',
        message: `${context}.id: Expected string, got ${typeof item.id}`,
        field: `${context}.id`,
        value: item.id,
      });
    }

    if (item.name && typeof item.name !== 'string') {
      errors.push({
        code: 'INVALID_FIELD_TYPE',
        message: `${context}.name: Expected string, got ${typeof item.name}`,
        field: `${context}.name`,
        value: item.name,
      });
    }

    if (item.icon && typeof item.icon !== 'string') {
      errors.push({
        code: 'INVALID_FIELD_TYPE',
        message: `${context}.icon: Expected string, got ${typeof item.icon}`,
        field: `${context}.icon`,
        value: item.icon,
      });
    }

    if (item.visible !== undefined && typeof item.visible !== 'boolean') {
      errors.push({
        code: 'INVALID_FIELD_TYPE',
        message: `${context}.visible: Expected boolean, got ${typeof item.visible}`,
        field: `${context}.visible`,
        value: item.visible,
      });
    }

    if (item.order !== undefined && typeof item.order !== 'number') {
      errors.push({
        code: 'INVALID_FIELD_TYPE',
        message: `${context}.order: Expected number, got ${typeof item.order}`,
        field: `${context}.order`,
        value: item.order,
      });
    }

    // Route validation
    if (item.href && typeof item.href === 'string') {
      if (!item.href.startsWith('/') && !item.href.startsWith('http')) {
        warnings.push({
          code: 'INVALID_ROUTE_FORMAT',
          message: `${context}.href: Route should start with "/" or be a full URL`,
          field: `${context}.href`,
          value: item.href,
          suggestion: 'Routes should be relative (start with "/") or absolute URLs',
        });
      }
    }

    // Order validation
    if (item.order !== undefined && (item.order < 0 || item.order > 1000)) {
      warnings.push({
        code: 'INVALID_ORDER_RANGE',
        message: `${context}.order: Order should be between 0 and 1000`,
        field: `${context}.order`,
        value: item.order,
        suggestion: 'Use order values between 0 and 1000 for better organization',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate a role configuration
   */
  static validateRole(role: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (typeof role !== 'object' || role === null) {
      errors.push({
        code: 'INVALID_TYPE',
        message: 'Role: Expected object, got ' + typeof role,
        field: 'role',
        value: role,
      });
      return { isValid: false, errors, warnings };
    }

    // Required fields
    if (!role.id || typeof role.id !== 'string') {
      errors.push({
        code: 'MISSING_REQUIRED_FIELD',
        message: 'Role: Missing or invalid id field',
        field: 'role.id',
        value: role.id,
      });
    }

    if (!role.name || typeof role.name !== 'string') {
      errors.push({
        code: 'MISSING_REQUIRED_FIELD',
        message: 'Role: Missing or invalid name field',
        field: 'role.name',
        value: role.name,
      });
    }

    if (!role.icon || typeof role.icon !== 'string') {
      errors.push({
        code: 'MISSING_REQUIRED_FIELD',
        message: 'Role: Missing or invalid icon field',
        field: 'role.icon',
        value: role.icon,
      });
    }

    if (!role.label || typeof role.label !== 'string') {
      errors.push({
        code: 'MISSING_REQUIRED_FIELD',
        message: 'Role: Missing or invalid label field',
        field: 'role.label',
        value: role.label,
      });
    }

    // Optional fields validation
    if (role.comingSoon !== undefined && typeof role.comingSoon !== 'boolean') {
      errors.push({
        code: 'INVALID_FIELD_TYPE',
        message: 'Role.comingSoon: Expected boolean, got ' + typeof role.comingSoon,
        field: 'role.comingSoon',
        value: role.comingSoon,
      });
    }

    // Context validation
    if (role.context && typeof role.context === 'string') {
      if (!this.VALID_CONTEXT_NAMES.includes(role.context as ContextName)) {
        errors.push({
          code: 'INVALID_CONTEXT',
          message: `Role.context: "${role.context}" is not a valid context name`,
          field: 'role.context',
          value: role.context,
          suggestion: `Valid contexts: ${this.VALID_CONTEXT_NAMES.join(', ')}`,
        });
      }
    }

    // Navigation validation
    if (role.navigation) {
      const navResult = this.validateRoleNavigation(role.navigation, `role.${role.id || 'unknown'}`);
      errors.push(...navResult.errors);
      warnings.push(...navResult.warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate role navigation configuration
   */
  static validateRoleNavigation(
    navigation: any,
    context: string = 'navigation'
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (typeof navigation !== 'object' || navigation === null) {
      errors.push({
        code: 'INVALID_TYPE',
        message: `${context}: Expected object, got ${typeof navigation}`,
        field: context,
        value: navigation,
      });
      return { isValid: false, errors, warnings };
    }

    Object.entries(navigation).forEach(([entityKey, navValue]) => {
      const fieldPath = `${context}.${entityKey}`;

      // Validate entity name
      if (!this.VALID_ENTITY_NAMES.includes(entityKey as EntityName)) {
        // Allow custom navigation keys (like 'route-planner', 'training', etc.)
        if (!entityKey.includes('-') && !entityKey.includes('_')) {
          warnings.push({
            code: 'UNKNOWN_ENTITY',
            message: `${fieldPath}: "${entityKey}" is not a known entity name`,
            field: fieldPath,
            value: entityKey,
            suggestion: `Known entities: ${this.VALID_ENTITY_NAMES.join(', ')}`,
          });
        }
      }

      // Validate navigation value
      if (typeof navValue === 'boolean') {
        // Boolean value is valid (enable/disable)
      } else if (typeof navValue === 'object' && navValue !== null) {
        // Object configuration
        const configErrors = this.validateRoleNavigationItem(navValue, fieldPath);
        errors.push(...configErrors.errors);
        warnings.push(...configErrors.warnings);
      } else {
        errors.push({
          code: 'INVALID_NAVIGATION_VALUE',
          message: `${fieldPath}: Expected boolean or object, got ${typeof navValue}`,
          field: fieldPath,
          value: navValue,
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate a single role navigation item
   */
  static validateRoleNavigationItem(
    item: any,
    context: string = 'item'
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (typeof item !== 'object' || item === null) {
      errors.push({
        code: 'INVALID_TYPE',
        message: `${context}: Expected object, got ${typeof item}`,
        field: context,
        value: item,
      });
      return { isValid: false, errors, warnings };
    }

    // Optional field validations
    if (item.route && typeof item.route !== 'string') {
      errors.push({
        code: 'INVALID_FIELD_TYPE',
        message: `${context}.route: Expected string, got ${typeof item.route}`,
        field: `${context}.route`,
        value: item.route,
      });
    }

    if (item.label && typeof item.label !== 'string') {
      errors.push({
        code: 'INVALID_FIELD_TYPE',
        message: `${context}.label: Expected string, got ${typeof item.label}`,
        field: `${context}.label`,
        value: item.label,
      });
    }

    if (item.icon && typeof item.icon !== 'string') {
      errors.push({
        code: 'INVALID_FIELD_TYPE',
        message: `${context}.icon: Expected string, got ${typeof item.icon}`,
        field: `${context}.icon`,
        value: item.icon,
      });
    }

    if (item.customPage !== undefined && typeof item.customPage !== 'boolean') {
      errors.push({
        code: 'INVALID_FIELD_TYPE',
        message: `${context}.customPage: Expected boolean, got ${typeof item.customPage}`,
        field: `${context}.customPage`,
        value: item.customPage,
      });
    }

    if (item.main !== undefined && typeof item.main !== 'boolean') {
      errors.push({
        code: 'INVALID_FIELD_TYPE',
        message: `${context}.main: Expected boolean, got ${typeof item.main}`,
        field: `${context}.main`,
        value: item.main,
      });
    }

    // Route format validation
    if (item.route && typeof item.route === 'string') {
      if (!item.route.startsWith('/') && !item.route.startsWith('http')) {
        warnings.push({
          code: 'INVALID_ROUTE_FORMAT',
          message: `${context}.route: Route should start with "/"`,
          field: `${context}.route`,
          value: item.route,
          suggestion: 'Routes should be relative paths starting with "/"',
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate hotkeys configuration
   */
  static validateHotkeys(hotkeys: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (typeof hotkeys !== 'object' || hotkeys === null) {
      errors.push({
        code: 'INVALID_TYPE',
        message: 'Hotkeys: Expected object, got ' + typeof hotkeys,
        field: 'hotkeys',
        value: hotkeys,
      });
      return { isValid: false, errors, warnings };
    }

    // Validate navigation hotkeys
    if (hotkeys.navigation) {
      Object.entries(hotkeys.navigation).forEach(([key, config]: [string, any]) => {
        if (config.keys && Array.isArray(config.keys)) {
          config.keys.forEach((keyCombo: string) => {
            if (typeof keyCombo !== 'string') {
              errors.push({
                code: 'INVALID_HOTKEY',
                message: `Hotkey ${key}: Invalid key combination "${keyCombo}"`,
                field: `hotkeys.navigation.${key}.keys`,
                value: keyCombo,
              });
            }
          });
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Run comprehensive validation on all navigation data
   */
  static validateAll(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      // Import and validate all navigation data
      const { ROLE_CONFIG, XUISCHEMA_REGISTRY, NAVIGATION_CONFIG } = require('./index');

      // Validate roles
      ROLE_CONFIG.groups.forEach((group: any) => {
        group.roles.forEach((role: any) => {
          const roleResult = this.validateRole(role);
          errors.push(...roleResult.errors);
          warnings.push(...roleResult.warnings);
        });
      });

      // Validate navigation config
      const configResult = this.validateNavigationConfig(NAVIGATION_CONFIG);
      errors.push(...configResult.errors);
      warnings.push(...configResult.warnings);

    } catch (error) {
      errors.push({
        code: 'VALIDATION_ERROR',
        message: 'Failed to run comprehensive validation',
        field: 'navigation',
        value: error,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// ===== QUICK VALIDATION FUNCTIONS =====

/**
 * Quick validation for development - throws on errors
 */
export function assertValidNavigation(item: any, context?: string): void {
  const result = NavigationValidator.validateNavigationItem(item, context);
  if (!result.isValid) {
    throw new Error(`Navigation validation failed: ${result.errors[0]?.message}`);
  }
}

/**
 * Quick validation for roles - throws on errors
 */
export function assertValidRole(role: Role): void {
  const result = NavigationValidator.validateRole(role);
  if (!result.isValid) {
    throw new Error(`Role validation failed: ${result.errors[0]?.message}`);
  }
}

/**
 * Get validation summary as string
 */
export function getValidationSummary(result: ValidationResult): string {
  const parts: string[] = [];

  if (result.errors.length > 0) {
    parts.push(`❌ ${result.errors.length} errors`);
  }

  if (result.warnings.length > 0) {
    parts.push(`⚠️ ${result.warnings.length} warnings`);
  }

  if (result.isValid && result.errors.length === 0 && result.warnings.length === 0) {
    parts.push('✅ Valid');
  }

  return parts.join(', ');
}
