/**
 * Panel calculation utilities
 * Shared calculations for modal panels, dropdowns, and overlays
 */

import { HEADER_HEIGHT, PANEL_HEADER_MARGIN, PANEL_MIN_HEIGHT_FALLBACK } from '@/constants/layout';

/**
 * Calculate maximum panel height based on window height
 * Used for dropdown panels, modals, and overlays that appear below the header
 * @param windowHeight - Current window height from useWindowDimensions
 * @returns Maximum height in pixels for the panel
 */
export function calculateMaxPanelHeight(windowHeight: number): number {
  return windowHeight > 0 ? windowHeight - HEADER_HEIGHT - PANEL_HEADER_MARGIN : PANEL_MIN_HEIGHT_FALLBACK;
}

