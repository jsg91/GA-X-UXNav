import type { TextProps } from 'tamagui';
import { Text } from 'tamagui';

import { useThemeColor } from '@/hooks/use-theme-color';
import { getTextColorKey } from '@/utils/theme-colors';
import { getTextTypeStyles } from '@/utils/themed-text-styles';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  level?: 'primary' | 'secondary' | 'tertiary';
};

export function ThemedText({
  lightColor,
  darkColor,
  type = 'default',
  level = 'primary',
  ...rest
}: ThemedTextProps) {
  // Extract color from rest to check if it's explicitly provided
  const { color: explicitColor, ...otherRest } = rest;

  // If an explicit color is provided, use it; otherwise compute theme color
  const color = explicitColor ??
    useThemeColor({ light: lightColor, dark: darkColor }, getTextColorKey(level) as any);

  // Get style properties for the text type
  const { fontSize, fontWeight, lineHeight } = getTextTypeStyles(type);

  return (
    <Text
      color={color}
      fontFamily="$body"
      fontSize={fontSize}
      fontWeight={fontWeight}
      lineHeight={lineHeight}
      {...otherRest}
    />
  );
}
