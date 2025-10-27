/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useThemeContext } from '@/hooks/use-theme-context';
import { useTheme } from 'tamagui';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { resolvedTheme } = useThemeContext();
  const tamaguiTheme = useTheme();
  const colorFromProps = props[resolvedTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // First try Tamagui theme, fallback to legacy Colors
    const tamaguiColor = tamaguiTheme[colorName as keyof typeof tamaguiTheme];
    if (tamaguiColor) {
      return String(tamaguiColor);
    }
    return Colors[resolvedTheme][colorName];
  }
}
