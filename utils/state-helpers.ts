/**
 * State helper utilities
 * Shared utilities for common state management patterns
 */

import type { Dispatch, SetStateAction } from 'react';

/**
 * Toggle a boolean state value
 * @param setState - State setter function
 * @returns Handler function that toggles the state
 */
export function createToggleHandler(setState: Dispatch<SetStateAction<boolean>>) {
  return () => setState(prev => !prev);
}

/**
 * Create a close handler for modals/dropdowns
 * @param setState - State setter function
 * @returns Handler function that sets state to false
 */
export function createCloseHandler(setState: Dispatch<SetStateAction<boolean>>) {
  return () => setState(false);
}

