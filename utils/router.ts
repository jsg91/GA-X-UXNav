/**
 * Router utility functions
 * Provides type-safe navigation helpers to avoid 'as any' casts
 */

import { Href, router } from 'expo-router';

/**
 * Type-safe navigation helper
 * Wraps router.push with proper typing to avoid 'as any' casts
 * @param href - The route to navigate to
 */
export function navigateTo(href: string | Href): void {
  router.push(href as Href);
}

/**
 * Type-safe navigation helper with replace
 * @param href - The route to navigate to
 */
export function navigateReplace(href: string | Href): void {
  router.replace(href as Href);
}

/**
 * Navigate back
 */
export function navigateBack(): void {
  router.back();
}

