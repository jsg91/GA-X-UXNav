/**
 * Event handler utilities
 * Shared utilities for common event handling patterns
 */

/**
 * Stop event propagation
 * Used for preventing clicks on modal overlays from closing the modal
 * @param e - Event object (web or React Native)
 */
export function stopPropagation(e: any): void {
  if (e?.stopPropagation) {
    e.stopPropagation();
  }
}

