import { usePathname, useRouter } from 'expo-router';
import { useHotkeys } from 'react-hotkeys-hook';
import { Platform } from 'react-native';

import { NAVIGATION_CONFIG } from '@/constants/NAVIGATION';

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
  const router = useRouter();
  const pathname = usePathname();

  // Only enable hotkeys on web platform
  if (Platform.OS !== 'web') {
    console.log('Hotkeys disabled - not on web platform');
    return;
  }

  console.log('Initializing navigation hotkeys for web platform');

  // Navigation shortcuts (GitHub-style sequences)
  Object.entries((NAVIGATION_CONFIG as any).hotkeys.navigation).forEach(([key, config]: [string, any]) => {
    console.log(`Registering navigation hotkey: ${config.keys} -> ${config.route}`);
    useHotkeys(config.keys, () => {
      console.log(`Navigation hotkey triggered: ${config.keys} -> ${config.route}`);
      router.push(config.route as any);
    }, {
      preventDefault: true,
      enableOnFormTags: false // Don't trigger when typing in inputs
    });
  });

  // Global actions
  const hotkeysConfig = (NAVIGATION_CONFIG as any).hotkeys;

  console.log(`Registering search hotkey: ${hotkeysConfig.actions.focusSearch.keys}`);
  useHotkeys(hotkeysConfig.actions.focusSearch.keys, () => {
    console.log(`Search hotkey triggered: ${hotkeysConfig.actions.focusSearch.keys}`);
    onFocusSearch?.();
  }, {
    preventDefault: true,
    enableOnFormTags: true // Allow in inputs for search focus
  });

  console.log(`Registering AI hotkey: ${hotkeysConfig.actions.toggleAI.keys}`);
  useHotkeys(hotkeysConfig.actions.toggleAI.keys, () => {
    console.log(`AI hotkey triggered: ${hotkeysConfig.actions.toggleAI.keys}`);
    onToggleAI?.();
  }, {
    preventDefault: true,
    enableOnFormTags: false
  });

  console.log(`Registering new item hotkey: ${hotkeysConfig.actions.newItem.keys}`);
  // Context-aware "New" action
  useHotkeys(hotkeysConfig.actions.newItem.keys, () => {
    console.log(`New item hotkey triggered: ${hotkeysConfig.actions.newItem.keys}`);
    const currentContext = hotkeysConfig.contextual[pathname as keyof typeof hotkeysConfig.contextual];
    if (currentContext?.newItem) {
      // Handle context-specific new item creation
      console.log(`Creating new item: ${currentContext.newItem.action}`);
      // TODO: Implement actual new item creation based on context
    }
  }, {
    enableOnFormTags: false
  });

  console.log(`Registering help hotkey: ${hotkeysConfig.actions.help.keys}`);
  // Help shortcut
  useHotkeys(hotkeysConfig.actions.help.keys, () => {
    console.log(`Help hotkey triggered: ${hotkeysConfig.actions.help.keys}`);
    router.push(hotkeysConfig.actions.help.route as any);
  }, {
    preventDefault: true,
    enableOnFormTags: false
  });

  console.log(`Registering close modal hotkey: ${hotkeysConfig.actions.closeModals.keys}`);
  // Close modals
  useHotkeys(hotkeysConfig.actions.closeModals.keys, () => {
    console.log(`Close modal hotkey triggered: ${hotkeysConfig.actions.closeModals.keys}`);
    onCloseModals?.();
  }, {
    preventDefault: true,
    enableOnFormTags: false
  });
}
