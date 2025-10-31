import { useMemo } from 'react';

import { GeneratedNavItem, NAVIGATION_CONFIG, Role, generateNavigationForRole } from '@/navigation';

interface UseNavigationItemsOptions {
  /**
   * If true, filter items for large screen (sidebar) visibility
   * If false, filter items for all screens (bottom nav)
   */
  forLargeScreen?: boolean;
  /**
   * If true, only show main navigation items (for small screens)
   */
  forSmallScreenMainOnly?: boolean;
}

/**
 * Hook to generate navigation items based on current role
 * Provides consistent navigation item generation across components
 */
export function useNavigationItems(
  currentRole?: Role,
  options: UseNavigationItemsOptions = {}
): GeneratedNavItem[] {
  const { forLargeScreen = false, forSmallScreenMainOnly = false } = options;

  return useMemo(() => {
    if (currentRole) {
      const items = generateNavigationForRole(currentRole);
      if (forSmallScreenMainOnly) {
        // Filter to only main items for small screens
        return items.filter(item => {
          // Check if this item has main: true in the role navigation config
          const navConfig = currentRole.navigation?.[item.id];
          return navConfig && typeof navConfig === 'object' && 'main' in navConfig && navConfig.main === true;
        });
      }
      return items;
    }
    // Fallback to old navigation config if no role
    // Convert BaseNavItem to GeneratedNavItem format for consistency
    return NAVIGATION_CONFIG.tabBar.items
      .filter(item => {
        if (forLargeScreen) {
          return ('largeScreen' in item && item.largeScreen) || item.visible;
        }
        return item.visible;
      })
      .map(item => ({
        id: item.id,
        name: item.name,
        href: item.href || '',
        icon: item.icon,
        label: item.name,
        customPage: false,
      }));
  }, [currentRole, forLargeScreen, forSmallScreenMainOnly]);
}

