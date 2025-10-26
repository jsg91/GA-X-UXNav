/**
 * Icon component using Expo vector icons (MaterialCommunityIcons) consistently across all platforms.
 * This ensures identical appearance on iOS, Android, and web using proper TypeScript types.
 * - see MaterialCommunityIcons in the [Icons Directory](https://icons.expo.fyi).
 */

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle, View } from 'react-native';
import { useTheme } from 'tamagui';

// Get proper TypeScript types from @expo/vector-icons
type MaterialCommunityIconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface IconSymbolProps {
  name: MaterialCommunityIconName | string;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}

const IconSymbol = ({ name, size = 24, color, style, ...rest }: IconSymbolProps) => {
  const theme = useTheme();
  
  // Resolve Tamagui color tokens (e.g., "$tint", "$color") to actual color values
  let resolvedColor = color;
  if (typeof color === 'string' && color.startsWith('$')) {
    const tokenName = color.slice(1); // Remove the $ prefix
    const themeValue = theme[tokenName];
    
    // Handle different Tamagui token value types
    if (themeValue) {
      if (typeof themeValue === 'object' && 'val' in themeValue) {
        resolvedColor = String(themeValue.val);
      } else if (typeof themeValue === 'string') {
        resolvedColor = themeValue;
      } else {
        resolvedColor = String(themeValue);
      }
    }
  }
  
  // Wrap in View to prevent parent styles from interfering on iOS
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <MaterialCommunityIcons style={style} name={name as any} color={resolvedColor as any} size={size} {...rest} />
    </View>
  );
};

export { IconSymbol };
