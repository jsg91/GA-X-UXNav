import React from 'react';
import { Button } from 'tamagui';

import { Badge } from '@/components/ui/badge';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface NotificationBadgeProps {
  count: number;
  icon: string;
  onPress: () => void;
  size?: number;
}

export function NotificationBadge({ count, icon, onPress, size = 24 }: NotificationBadgeProps) {
  return (
    <Button
      onPress={onPress}
      backgroundColor="transparent"
      height="100%"
      hoverStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        transform: 'scale(1.02)',
      }}
      padding="$2"
      position="relative"
      pressStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        transform: 'scale(0.98)',
      }}
      size="$2"
    >
      <IconSymbol name={icon} color="$color" size={size} />
      <Badge count={count} />
    </Button>
  );
}


