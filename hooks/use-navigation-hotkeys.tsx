/**
 * Mobile/Expo Go version - No-op implementation
 * Hotkeys are web-only feature, so this file provides a stub for mobile platforms
 * The .web.tsx version will be used automatically on web platform by Expo's file resolution
 */
interface NavigationHotkeysProps {
  onToggleAI?: () => void;
  onFocusSearch?: () => void;
  onCloseModals?: () => void;
}

export function useNavigationHotkeys({
  onToggleAI,
  onFocusSearch,
  onCloseModals
}: NavigationHotkeysProps = {}) {
  // No-op for mobile platforms - hotkeys are web-only
  // The .web.tsx version will be automatically used on web
  if (__DEV__) {
    console.log('Navigation hotkeys disabled on mobile platform (web-only feature)');
  }
}
