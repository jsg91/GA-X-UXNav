/**
 * Navigation items utility functions
 * Shared utilities for filtering and processing navigation items
 */


/**
 * Filter navigation items by visibility
 * @param items - Array of navigation items (supports readonly arrays)
 * @returns Filtered array of visible items
 */
export function filterVisibleItems<T extends { visible: boolean }>(items: readonly T[] | T[]): T[] {
  return (items.filter(item => item.visible) as T[]);
}

