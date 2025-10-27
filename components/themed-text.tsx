import { Text, type TextProps } from 'tamagui';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

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
      fontSize={fontSize}
      fontWeight={fontWeight}
      lineHeight={lineHeight}
      fontFamily="$body"
      {...rest}
    />
  );
}
