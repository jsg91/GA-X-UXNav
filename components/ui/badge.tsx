import React from 'react';
import { Text, View } from 'tamagui';

import { BADGE_SHADOW } from '@/constants/shadow-styles';

interface BadgeProps {
  count: number;
  maxCount?: number;
}

export function Badge({ count, maxCount = 9 }: BadgeProps) {
  if (count <= 0) return null;

  // Dynamic sizing based on count length
  const countText = count > maxCount ? `${maxCount}+` : count.toString();
  const isLongCount = countText.length > 1;
  const badgeSize = isLongCount ? 24 : 20; // Increased to accommodate larger font
  const fontSize = isLongCount ? "$3" : "$2";

  return (
    <View
      alignItems="center"
      backgroundColor="#FF3B30"
      borderColor="rgba(255, 255, 255, 0.3)" // Keep white border for badge contrast
      borderRadius={badgeSize / 2}
      borderWidth={1.5}
      height={badgeSize}
      justifyContent="center"
      minWidth={badgeSize}
      paddingHorizontal={isLongCount ? "$1.5" : "$1"}
      position="absolute"
      right={2}
      {...BADGE_SHADOW}
      top={2}
    >
      <Text color="white" fontFamily="$body" fontSize={fontSize} fontWeight="$6">
        {countText}
      </Text>
    </View>
  );
}
