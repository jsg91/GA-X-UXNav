// Fallback for using MaterialCommunityIcons on Android and web.

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialCommunityIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to MaterialCommunityIcons mappings here.
 * - see MaterialCommunityIcons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation icons from NAVIGATION.ts
  'group': 'account-group',
  'receipt': 'receipt',
  'description': 'file-document',
  'memory': 'memory',
  'business': 'domain',
  'event': 'calendar',
  'storefront': 'storefront',
  'map': 'map',
  'public': 'earth',
  'place': 'map-marker',
  'check-box': 'checkbox-marked',
  'person-add': 'account-plus',
  'assignment': 'clipboard-text',
  'verified': 'check-circle',
  'radio': 'radio',
  'share': 'share',
  'flight': 'airplane',
  'book': 'book',
  'build': 'hammer-wrench',
  'calculate': 'calculator',
  'school': 'school',
  'person': 'account',
  'warning': 'alert',
  'local-hospital': 'hospital',
  'lightbulb': 'lightbulb',
  'help': 'help',
  'info': 'information',
  'view-dashboard': 'view-dashboard',
  'calendar-check': 'calendar-check',
  'airplane-edit': 'airplane-edit',
  'wrench': 'wrench',
  'airport': 'airport',
  'file-document-multiple': 'file-document-multiple',
  'stadium-variant': 'stadium-variant',
  'menu': 'menu',
  'cog': 'cog',
  'certificate': 'certificate',
  'credit-card': 'credit-card',
  'logout': 'logout',

  // Profile menu icons
  'account': 'account',
  'account.fill': 'account',
  'person.fill': 'account',

  // Existing icons
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code-braces',
  'chevron.right': 'chevron-right',
  'xmark': 'close',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and MaterialCommunityIcons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to MaterialCommunityIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialCommunityIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
