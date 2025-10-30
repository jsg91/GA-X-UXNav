/**
 * Navigation utility functions
 * Shared utilities for navigation-related operations across components
 */

/**
 * Route prefix constant for tabs
 */
export const ROUTE_PREFIX = '/(tabs)/';

/**
 * Build a route path with the tabs prefix
 * @param path - The route path (e.g., 'logbook' or '/logbook')
 * @returns The full route path with prefix (e.g., '/(tabs)/logbook')
 */
export function buildRoute(path: string): string {
  // Remove leading slash if present, then add prefix
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${ROUTE_PREFIX}${cleanPath}`;
}

/**
 * Strip the route prefix from a path
 * @param path - The full route path (e.g., '/(tabs)/logbook')
 * @returns The path without prefix (e.g., 'logbook')
 */
export function stripRoutePrefix(path: string): string {
  return path.replace(ROUTE_PREFIX, '');
}

/**
 * Check if a navigation tab is currently active based on href and pathname
 * @param href - The href path of the navigation item (e.g., '/(tabs)/logbook')
 * @param pathname - The current pathname from the router
 * @returns true if the tab is active, false otherwise
 */
export function isTabActive(href: string | null | undefined, pathname: string): boolean {
  if (!href) return false;
  // Handle root path
  if (href === ROUTE_PREFIX && pathname === '/') return true;
  // Exact match first
  if (href === pathname) return true;
  // For tab paths, check if pathname starts with the route (more precise than includes)
  // Only process if href starts with the route prefix
  if (href.startsWith(ROUTE_PREFIX)) {
    const routeWithoutPrefix = stripRoutePrefix(href);
    if (routeWithoutPrefix && pathname.startsWith(`/${routeWithoutPrefix}`)) {
      // Ensure we're matching a complete route segment, not part of another route
      // Check the character after the route to ensure it's a valid separator
      const nextChar = pathname[routeWithoutPrefix.length + 1];
      return !nextChar || nextChar === '/' || nextChar === '?';
    }
  }
  return false;
}

/**
 * Extract href from a navigation item
 * Handles both GeneratedNavItem (always has href as string) and legacy BaseNavItem types
 */
export function getItemHref(item: { href?: string | null }): string | null {
  return item.href || null;
}
