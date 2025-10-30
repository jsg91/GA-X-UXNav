import { View  } from 'tamagui';
import type {ViewProps} from 'tamagui';

import { useThemeColor } from '@/hooks/use-theme-color';
import { getBackgroundColorKey } from '@/utils/theme-colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'primary' | 'secondary';
};

export function ThemedView({ lightColor, darkColor, variant = 'primary', ...otherProps }: ThemedViewProps) {
  // Determine background color key based on variant using shared utility
  const bgKey = getBackgroundColorKey(variant);

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, bgKey as any);

  return <View backgroundColor={backgroundColor} {...otherProps} />;
}
