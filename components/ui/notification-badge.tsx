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
      size="$2"
      backgroundColor="transparent"
      padding="$2"
      onPress={onPress}
      position="relative"
    >
      <IconSymbol name={icon} size={size} color="$color" />
      <Badge count={count} />
    </Button>
  );
}


