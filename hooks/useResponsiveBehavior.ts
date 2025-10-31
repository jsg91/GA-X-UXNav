import { useEffect, useState } from 'react';
import { EntityName, Role } from '@/navigation';
import { getEntityNameForRoute, getPageInfoForEntity, getPageInfoFromNavConfig } from '@/navigation';
import { isBrowserEnvironment, isWeb } from '@/utils/platform';

/**
 * Responsive behavior hook state and functionality
 * Handles keyboard tracking, viewport management, and document title updates
 */
export interface ResponsiveBehaviorState {
  // Keyboard state
  keyboardHeight: number;

  // Platform detection
  isWeb: boolean;
  isBrowserEnvironment: boolean;

  // Document title management
  updateDocumentTitle: (pathname: string, currentRole?: Role) => void;
}

export function useResponsiveBehavior(): ResponsiveBehaviorState {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Set viewport meta tag for mobile web
  useEffect(() => {
    if (isBrowserEnvironment()) {
      // Set viewport meta tag
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.setAttribute('name', 'viewport');
        document.head.appendChild(viewportMeta);
      }
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  }, []);

  // Track keyboard height for mobile web (iOS Safari)
  useEffect(() => {
    // Only track keyboard when needed (when AI modal is open and no sidebar)
    // This will be controlled by the parent component
    const shouldTrackKeyboard = isWeb && typeof window !== 'undefined';

    if (!shouldTrackKeyboard) {
      setKeyboardHeight(0);
      return;
    }

    // Check if we're in a real browser environment with addEventListener support
    const hasAddEventListener = typeof window.addEventListener === 'function';
    const hasVisualViewport = typeof window.visualViewport !== 'undefined'
      && window.visualViewport
      && typeof window.visualViewport.addEventListener === 'function';

    if (!hasAddEventListener) {
      // Not a browser environment (e.g., Expo Go), reset keyboard height
      setKeyboardHeight(0);
      return;
    }

    // Track initial viewport height to detect keyboard
    let initialViewportHeight = window.innerHeight;

    const updateKeyboardHeight = () => {
      try {
        if (hasVisualViewport && window.visualViewport) {
          // Use Visual Viewport API for most accurate measurement
          const currentViewportHeight = window.visualViewport.height;
          const windowHeight = window.innerHeight;

          // Calculate keyboard height as the difference between window height and viewport height
          const kbHeight = windowHeight - currentViewportHeight;

          // Consider keyboard open if difference is significant (>150px to avoid false positives)
          if (kbHeight > 150) {
            setKeyboardHeight(kbHeight);
          } else {
            setKeyboardHeight(0);
            // Reset initial height when keyboard closes
            initialViewportHeight = currentViewportHeight;
          }
        } else {
          // Fallback: detect keyboard by comparing window heights
          const currentHeight = window.innerHeight;
          // Update initial height if it increased (keyboard closed or orientation change)
          if (currentHeight > initialViewportHeight) {
            initialViewportHeight = currentHeight;
          }
          const heightDiff = initialViewportHeight - currentHeight;
          // Only consider it a keyboard if the difference is significant (>150px)
          if (heightDiff > 150) {
            setKeyboardHeight(heightDiff);
          } else {
            setKeyboardHeight(0);
          }
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('Failed to update keyboard height:', error);
        }
      }
    };

    // Initial calculation
    updateKeyboardHeight();

    // Listen to Visual Viewport changes (most accurate) - only if available
    if (hasVisualViewport && window.visualViewport) {
      try {
        window.visualViewport.addEventListener('resize', updateKeyboardHeight);
        window.visualViewport.addEventListener('scroll', updateKeyboardHeight);
      } catch (error) {
        if (__DEV__) {
          console.warn('Failed to add visual viewport listeners:', error);
        }
      }
    }

    // Fallback: listen to window resize - only if addEventListener is available
    if (hasAddEventListener) {
      try {
        window.addEventListener('resize', updateKeyboardHeight);
      } catch (error) {
        if (__DEV__) {
          console.warn('Failed to add resize listener:', error);
        }
      }
    }

    return () => {
      // Cleanup - only remove listeners if they were successfully added
      if (hasVisualViewport && window.visualViewport) {
        try {
          if (typeof window.visualViewport.removeEventListener === 'function') {
            window.visualViewport.removeEventListener('resize', updateKeyboardHeight);
            window.visualViewport.removeEventListener('scroll', updateKeyboardHeight);
          }
        } catch (error) {
          // Silently fail cleanup
        }
      }
      if (hasAddEventListener && typeof window.removeEventListener === 'function') {
        try {
          window.removeEventListener('resize', updateKeyboardHeight);
        } catch (error) {
          // Silently fail cleanup
        }
      }
    };
  }, []); // Empty dependency array - this effect should only run once

  // Document title management function
  const updateDocumentTitle = (pathname: string, currentRole?: Role) => {
    if (isBrowserEnvironment()) {
      let pageTitle = 'GA-X';

      if (pathname === '/') {
        pageTitle = 'Dashboard | GA-X';
      } else {
        // Extract route name from pathname (e.g., '/logbook' -> 'logbook')
        const routeName = pathname.replace('/(tabs)/', '').replace('/', '') || 'dashboard';

        // Try to get page info from NAVIGATION_CONFIG first
        const navConfigInfo = getPageInfoFromNavConfig(routeName);
        if (navConfigInfo) {
          pageTitle = `${navConfigInfo.title} | GA-X`;
        } else {
          // Try to get from entity routes using derived mapping
          const entityName = getEntityNameForRoute(routeName);
          const pageInfo = getPageInfoForEntity(entityName as EntityName, currentRole);
          pageTitle = `${pageInfo.title} | GA-X`;
        }
      }

      document.title = pageTitle;
    }
  };

  return {
    // Keyboard state
    keyboardHeight,

    // Platform detection
    isWeb,
    isBrowserEnvironment: isBrowserEnvironment(),

    // Document title management
    updateDocumentTitle,
  };
}
