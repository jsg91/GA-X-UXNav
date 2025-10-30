import { useMemo } from 'react';

import { GeneratedNavItem, NAVIGATION_CONFIG, Role, generateNavigationForRole } from '@/constants/NAVIGATION';

interface UseNavigationItemsOptions {
  /**
   * If true, filter items for large screen (sidebar) visibility
   * If false, filter items for all screens (bottom nav)
   */
  forLargeScreen?: boolean;
}

/**
 * Hook to generate navigation items based on current role
 * Provides consistent navigation item generation across components
 */
export function useNavigationItems(
  currentRole?: Role,
  options: UseNavigationItemsOptions = {}
): GeneratedNavItem[] {
  const { forLargeScreen = false } = options;

  return useMemo(() => {
    if (currentRole) {
      return generateNavigationForRole(currentRole);
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
  }, [currentRole, forLargeScreen]);
}

