import React from 'react';
import { Text, View } from 'tamagui';

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
  const fontSize = isLongCount ? "$3" : "$1.5";

  return (
    <View
      position="absolute"
      top={2}
      right={2}
      minWidth={badgeSize}
      height={badgeSize}
      borderRadius={badgeSize / 2}
      backgroundColor="#FF3B30"
      borderWidth={1.5}
      borderColor="rgba(255, 255, 255, 0.3)"
      shadowColor="rgba(0, 0, 0, 0.3)"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.8}
      shadowRadius={2}
      justifyContent="center"
      alignItems="center"
      paddingHorizontal={isLongCount ? "$1.5" : "$1"}
    >
      <Text color="white" fontSize={fontSize} fontFamily="$body" fontWeight="$6">
        {countText}
      </Text>
    </View>
  );
}
