import { View  } from 'tamagui';
import type {ViewProps} from 'tamagui';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'primary' | 'secondary';
};

export function ThemedView({ lightColor, darkColor, variant = 'primary', ...otherProps }: ThemedViewProps) {
  // Determine background color key based on variant
  const bgKey = variant === 'secondary' ? 'backgroundSecondary' : 'background';

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, bgKey as any);

  return <View backgroundColor={backgroundColor} {...otherProps} />;
}
