/**
 * Menu item style utilities
 * Standardized styles for menu items, navigation items, and dropdown options
 */

import { MENU_ITEM_MIN_HEIGHT } from '@/constants/layout';
import { isWeb } from '@/utils/platform';
import { INTERACTIVE_COLORS } from './interactive-colors';

/**
 * Standard menu item button props
 * Shared hover and press styles for menu items across components
 */
export const MENU_ITEM_BUTTON_STYLES = {
  backgroundColor: 'transparent' as const,
  borderBottomWidth: 0,
  borderRadius: 0,
  paddingHorizontal: '$4',
  paddingVertical: '$3',
} as const;

/**
 * Get hover style for menu items (web only)
 */
export function getMenuItemHoverStyle(useTint: boolean = true) {
  if (!isWeb) return undefined;
  return {
    backgroundColor: useTint ? INTERACTIVE_COLORS.tintHover : INTERACTIVE_COLORS.hover,
  };
}

/**
 * Get press style for menu items
 */
export function getMenuItemPressStyle(useTint: boolean = true) {
  return {
    backgroundColor: useTint ? INTERACTIVE_COLORS.tintPress : INTERACTIVE_COLORS.press,
  };
}

/**
 * Standard menu item with minimum height
 */
export const MENU_ITEM_WITH_HEIGHT_STYLES = {
  ...MENU_ITEM_BUTTON_STYLES,
  minHeight: MENU_ITEM_MIN_HEIGHT,
  paddingVertical: 15,
} as const;

