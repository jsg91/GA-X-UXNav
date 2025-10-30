import { Platform } from 'react-native';

/**
 * Platform utility functions
 * Provides consistent platform checks and utilities across the application
 */

/**
 * Check if running on web platform
 */
export const isWeb = Platform.OS === 'web';

/**
 * Check if running on mobile platform (iOS or Android)
 */
export const isMobile = Platform.OS !== 'web';

/**
 * Check if running on iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Check if running on Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Get platform-specific style value
 * @param webStyle - Style value to use on web
 * @param mobileStyle - Style value to use on mobile (optional, defaults to undefined)
 * @returns The appropriate style based on platform
 */
export function getPlatformStyle<T>(webStyle: T, mobileStyle?: T): T | undefined {
  return isWeb ? webStyle : mobileStyle;
}

/**
 * Get platform-specific value, falling back to a default
 * @param webValue - Value to use on web
 * @param mobileValue - Value to use on mobile
 * @returns The appropriate value based on platform
 */
export function getPlatformValue<T>(webValue: T, mobileValue: T): T {
  return isWeb ? webValue : mobileValue;
}

/**
 * Check if browser environment is available (web-specific checks)
 */
export function isBrowserEnvironment(): boolean {
  return isWeb && typeof window !== 'undefined' && typeof document !== 'undefined';
}

