import { useEffect, RefObject } from 'react';

import { REFOCUS_DELAYS } from '@/constants/refocus-delays';
import { isBrowserEnvironment } from '@/utils/platform';

interface UseAutoFocusOptions {
  /**
   * Delay in milliseconds before attempting to focus (for modals that need time to render)
   * @default 300 for mobile, 500 for web
   */
  delay?: number;
  /**
   * Optional selector to find the input element in the DOM (for web)
   */
  selector?: string;
  /**
   * Whether to also click the element (useful for iOS Safari)
   * @default true for web
   */
  clickOnFocus?: boolean;
}

/**
 * Hook to automatically focus an input element when a condition becomes true
 * Handles cross-platform focus logic with proper fallbacks
 */
// Compute default delay once outside the hook to avoid recalculation
const DEFAULT_DELAY_WEB = 500;
const DEFAULT_DELAY_MOBILE = 300;

export function useAutoFocus(
  inputRef: RefObject<any>,
  shouldFocus: boolean,
  options: UseAutoFocusOptions = {}
) {
  const { delay, selector, clickOnFocus } = options;
  const defaultDelay = isBrowserEnvironment() ? DEFAULT_DELAY_WEB : DEFAULT_DELAY_MOBILE;

  useEffect(() => {
    if (!shouldFocus) return;

    const focusInput = () => {
      try {
        // Method 1: Try ref focus (works for React Native and web)
        if (inputRef.current) {
          const inputElement = inputRef.current;
          if (inputElement && typeof inputElement.focus === 'function') {
            inputElement.focus();
          }
        }

        // Method 2: Try DOM selector (web only)
        if (isBrowserEnvironment() && selector) {
          const nativeInput = document.querySelector(selector) as HTMLInputElement;
          if (nativeInput) {
            nativeInput.focus();
            // iOS Safari sometimes needs click to trigger keyboard
            if (clickOnFocus !== false) {
              nativeInput.click();
            }
          }
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('Failed to focus input:', error);
        }
      }
    };

    setTimeout(focusInput, delay ?? defaultDelay);
  }, [shouldFocus, delay, selector, clickOnFocus, inputRef]);
}

/**
 * Utility function to refocus an input after an action (e.g., after sending a message)
 * Uses multiple strategies with delays to ensure it works on all platforms
 */
export function refocusInput(
  inputRef: RefObject<any>,
  selector?: string,
  delays: number[] = [...REFOCUS_DELAYS]
) {
  const focusAttempt = () => {
    try {
      // Try ref focus
      if (inputRef.current) {
        const inputElement = inputRef.current;
        if (inputElement && typeof inputElement.focus === 'function') {
          inputElement.focus();
        }
      }

      // Try DOM selector (web only)
      if (isBrowserEnvironment() && selector) {
        const nativeInput = document.querySelector(selector) as HTMLInputElement;
        if (nativeInput) {
          nativeInput.focus();
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to refocus input:', error);
      }
    }
  };

  // Try multiple times with different delays
  delays.forEach((delay, index) => {
    if (index === 0) {
      requestAnimationFrame(focusAttempt);
    } else {
      setTimeout(focusAttempt, delay);
    }
  });
}

