import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { TabPlaceholder } from '@/components/ui/tab-placeholder';
import { EntityName, getPageInfoForEntity, getPageInfoFromNavConfig, XUISCHEMA_REGISTRY } from '@/constants/NAVIGATION';
import { useRoleContext } from '@/hooks/use-role-context';

/**
 * Dynamic route handler for all routes
 * Handles:
 * - Entity routes from ROLE_CONFIG navigation (aircrafts, logbook, reservations, etc.)
 * - Top navigation routes from NAVIGATION_CONFIG.tabBar (support, admin, club, etc.)
 * - Custom pages from role navigation config
 */
export default function DynamicEntityScreen() {
  const { entity } = useLocalSearchParams<{ entity: string }>();
  const { currentRole } = useRoleContext();

  // Map route names to entity names (e.g., 'logbook' -> 'logbookentries')
  const entityNameMap: Record<string, EntityName> = {
    'logbook': 'logbookentries',
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

  const entityName = (entityNameMap[entity as string] || entity) as EntityName;
  
  // First, try to get page info from NAVIGATION_CONFIG (top nav routes)
  const navConfigInfo = getPageInfoFromNavConfig(entity as string);
  
  if (navConfigInfo) {
    return (
      <TabPlaceholder
        description={navConfigInfo.description || 'Page content coming soon...'}
        icon={navConfigInfo.icon}
        title={navConfigInfo.title}
      />
    );
  }

  // Otherwise, get page info from XUISCHEMA_REGISTRY or role navigation (entity routes)
  const pageInfo = getPageInfoForEntity(entityName, currentRole);
  
  // Get icon - check navigation config first for custom pages, then schema
  const navConfig = currentRole.navigation?.[entityName];
  let icon = 'file';
  if (navConfig && typeof navConfig === 'object' && 'customPage' in navConfig && navConfig.customPage) {
    icon = navConfig.icon || 'file';
  } else {
    const schema = XUISCHEMA_REGISTRY[entityName];
    icon = schema?.display.icon || navConfig?.icon || 'file';
  }

  return (
    <TabPlaceholder
      description={pageInfo.description || 'Page content coming soon...'}
      icon={icon}
      title={pageInfo.title}
    />
  );
}

