import { Slot } from 'expo-router';
import React from 'react';

import { ResponsiveNavigation } from '@/components/responsive-navigation';
import { RoleProvider } from '@/hooks/use-role-context';

export default function TabLayout() {
  return (
    <RoleProvider>
      <ResponsiveNavigation>
        <Slot />
      </ResponsiveNavigation>
    </RoleProvider>
  );
}
