import { Text  } from 'tamagui';
import type {TextProps} from 'tamagui';

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
  // Determine color key based on level using shared utility
  const colorKey = getTextColorKey(level);
  const color = useThemeColor({ light: lightColor, dark: darkColor }, colorKey as any);

  // Get style properties for the text type
  const { fontSize, fontWeight, lineHeight } = getTextTypeStyles(type);

  return (
    <Text
      color={color}
      fontFamily="$body"
      fontSize={fontSize}
      fontWeight={fontWeight}
      lineHeight={lineHeight}
      {...rest}
    />
  );
}
