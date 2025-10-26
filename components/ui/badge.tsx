import React from 'react';
import { Text, View } from 'tamagui';

interface BadgeProps {
  count: number;
  maxCount?: number;
}

export function Badge({ count, maxCount = 9 }: BadgeProps) {
  if (count <= 0) return null;

  return (
    <View
      position="absolute"
      top={-6}
      right={-8}
      minWidth={18}
      height={18}
      borderRadius="$4"
      backgroundColor="$color"
      justifyContent="center"
      alignItems="center"
      paddingHorizontal="$1"
    >
      <Text color="white" fontSize="$1" fontWeight="$5">
        {count > maxCount ? `${maxCount}+` : count.toString()}
      </Text>
    </View>
  );
}
