/**
 * Icon utility functions
 * Provides consistent icon color logic across components
 */

/**
 * Get the icon color based on active state
 * @param isActive - Whether the icon is in an active/selected state
 * @param resolvedTheme - The current theme ('light' or 'dark')
 * @returns The Tamagui color token to use
 */
export function getIconColor(isActive: boolean, resolvedTheme?: 'light' | 'dark'): string {
  // In dark mode, use white for all icons; in light mode use theme tokens
  if (resolvedTheme === 'dark') {
    return isActive ? '$tint' : '#FFFFFF';
  }
  return isActive ? "$tint" : "$tabIconDefault";
}

