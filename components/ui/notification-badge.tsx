import React from 'react';
import { Button } from 'tamagui';

import { Badge } from '@/components/ui/badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TRANSFORM_SCALES } from '@/constants/transform-scales';
import { INTERACTIVE_COLORS } from '@/utils/interactive-colors';
import { getActiveColor } from '@/utils/active-state';
import { useThemeContext } from '@/hooks/use-theme-context';

interface NotificationBadgeProps {
  count: number;
  icon: string;
  onPress: () => void;
  size?: number;
  isActive?: boolean;
}

export function NotificationBadge({ count, icon, onPress, size = 24, isActive = false }: NotificationBadgeProps) {
  const { resolvedTheme } = useThemeContext();
  const iconColor = resolvedTheme === 'dark' 
    ? (isActive ? '$tint' : '#FFFFFF')
    : getActiveColor(isActive);
  
  return (
    <Button
      onPress={onPress}
      backgroundColor="transparent"
      height="100%"
      hoverStyle={{
        backgroundColor: INTERACTIVE_COLORS.hover,
        transform: `scale(${TRANSFORM_SCALES.hover})`,
      }}
      padding="$1"
      position="relative"
      pressStyle={{
        backgroundColor: INTERACTIVE_COLORS.press,
        transform: `scale(${TRANSFORM_SCALES.press})`,
      }}
      size="$2"
    >
      <IconSymbol name={icon} color={iconColor} size={size} />
      <Badge count={count} />
    </Button>
  );
}


