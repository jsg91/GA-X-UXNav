import { Slot } from 'expo-router';
import React from 'react';

import { ResponsiveNavigation } from '@/components/responsive-navigation';

export default function TabLayout() {
  return (
    <ResponsiveNavigation>
      <Slot />
    </ResponsiveNavigation>
  );
}
