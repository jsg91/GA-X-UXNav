import { useEffect, useState } from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';
import { SIDEBAR_BREAKPOINT } from '@/constants/layout';
import { isWeb } from '@/utils/platform';

/**
 * Navigation state management hook
 * Handles responsive navigation logic, sidebar visibility, and dimension tracking
 */
export interface NavigationState {
  // State
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;

  // Responsive state
  dimensionsReady: boolean;
  hasMeasuredDimensions: boolean;

  // Computed values
  showSidebar: boolean;
  shouldReserveSidebarSpace: boolean;
  shouldShowBottomNav: boolean;

  // Platform detection
  isMobilePlatform: boolean;
  hasTouchCapability: boolean;
  isSmallViewport: boolean;
}

export function useNavigationState(): NavigationState {
  const { width, height } = useWindowDimensions();
  const _screenWidth = Dimensions.get('window').width;

  // Navigation state
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Dimension tracking state
  const [dimensionsReady, setDimensionsReady] = useState(!isWeb);
  const [hasMeasuredDimensions, setHasMeasuredDimensions] = useState(false);

  // Platform and viewport detection
  const hasTouchCapability = isWeb && typeof window !== 'undefined' && 'ontouchstart' in window;
  const isSmallViewport = height < 600; // Mobile devices typically have smaller height
  const isMobilePlatform = !isWeb || hasTouchCapability || isSmallViewport;

  // Computed responsive values
  const showSidebar = !isMobilePlatform && width >= SIDEBAR_BREAKPOINT && hasMeasuredDimensions;
  const shouldReserveSidebarSpace = showSidebar;
  const shouldShowBottomNav = dimensionsReady && !showSidebar;

  // Handle initial responsive detection
  useEffect(() => {
    // On web, assume large screen initially to prevent bottom nav flash
    if (isWeb) {
      setDimensionsReady(true);
    } else {
      // On mobile, wait for actual dimensions
      setDimensionsReady(true);
    }

    // Mark dimensions as measured once we have a width > 0
    // useWindowDimensions hook automatically triggers re-renders on dimension changes
    if (width > 0 && !hasMeasuredDimensions) {
      setHasMeasuredDimensions(true);
    }
  }, [width, hasMeasuredDimensions]);

  // Debug logging for development
  if (__DEV__) {
    console.warn('NavigationState Debug:', {
      platform: isWeb ? 'web' : 'mobile',
      width,
      height,
      dimensionsReady,
      showSidebar,
      hasTouchCapability,
      isSmallViewport,
      isMobilePlatform,
      shouldShowBottomNav,
      SIDEBAR_BREAKPOINT
    });
  }

  return {
    // State
    sidebarExpanded,
    setSidebarExpanded,

    // Responsive state
    dimensionsReady,
    hasMeasuredDimensions,

    // Computed values
    showSidebar,
    shouldReserveSidebarSpace,
    shouldShowBottomNav,

    // Platform detection
    isMobilePlatform,
    hasTouchCapability,
    isSmallViewport,
  };
}
