import { Text  } from 'tamagui';
import type {TextProps} from 'tamagui';

import { useThemeColor } from '@/hooks/use-theme-color';

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
  // Determine color key based on level
  const colorKey = level === 'secondary' ? 'textSecondary' :
                   level === 'tertiary' ? 'textTertiary' : 'text';

  const color = useThemeColor({ light: lightColor, dark: darkColor }, colorKey as any);

  const fontSize = type === 'title' ? '$10' :
                   type === 'subtitle' ? '$8' :
                   type === 'default' ? '$6' : '$6';

  const fontWeight = type === 'title' ? '$7' :
                     type === 'defaultSemiBold' ? '$4' :
                     type === 'subtitle' ? '$5' : '$2';

  const lineHeight = type === 'title' ? '$10' :
                     type === 'subtitle' ? '$8' :
                     type === 'default' ? '$6' : '$6';

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
