/**
 * Active state utilities
 * Standardized logic for determining active/selected states and their styles
 */

/**
 * Get color based on active state
 * @param isActive - Whether the item is active/selected
 * @param tintToken - Tamagui token for tint color (default: "$tint")
 * @param defaultToken - Tamagui token for default color (default: "$color")
 * @returns The appropriate color token
 */
export function getActiveColor(isActive: boolean, tintToken: string = '$tint', defaultToken: string = '$color'): string {
  return isActive ? tintToken : defaultToken;
}

/**
 * Get font weight based on active state
 * @param isActive - Whether the item is active/selected
 * @param activeWeight - Tamagui token for active weight (default: "$6")
 * @param defaultWeight - Tamagui token for default weight (default: "$4")
 * @returns The appropriate font weight token
 */
export function getActiveFontWeight(
  isActive: boolean,
  activeWeight: '$6' | '$7' | '$8' | '$9' = '$6',
  defaultWeight: '$2' | '$3' | '$4' | '$5' = '$4'
): '$2' | '$3' | '$4' | '$5' | '$6' | '$7' | '$8' | '$9' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 'unset' {
  const weight = isActive ? activeWeight : defaultWeight;
  // Tamagui accepts both token strings and numeric values
  return weight as '$2' | '$3' | '$4' | '$5' | '$6' | '$7' | '$8' | '$9' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 'unset';
}

/**
 * Get opacity based on active state
 * @param isActive - Whether the item is active/selected
 * @param activeOpacity - Opacity when active (default: 1)
 * @param defaultOpacity - Opacity when inactive (default: 0.7)
 * @returns The appropriate opacity value
 */
export function getActiveOpacity(isActive: boolean, activeOpacity: number = 1, defaultOpacity: number = 0.7): number {
  return isActive ? activeOpacity : defaultOpacity;
}

