/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from 'tamagui';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const tamaguiTheme = useTheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // First try Tamagui theme, fallback to legacy Colors
    const tamaguiColor = tamaguiTheme[colorName as keyof typeof tamaguiTheme];
    if (tamaguiColor) {
      return String(tamaguiColor);
    }
    return Colors[theme][colorName];
  }
}
