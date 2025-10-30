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
  const isWeb = Platform.OS === 'web';

  console.log(`Initializing navigation hotkeys for platform: ${Platform.OS}`);

  // Navigation shortcuts (GitHub-style sequences)
  // Must register each hotkey individually (can't call hooks in loops)
  const navHotkeys = (NAVIGATION_CONFIG as any).hotkeys.navigation;
  
  useHotkeys(navHotkeys.dashboard?.keys || '', () => {
    console.log(`Navigation hotkey triggered: ${navHotkeys.dashboard.keys} -> ${navHotkeys.dashboard.route}`);
    router.push(navHotkeys.dashboard.route as any);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: Platform.OS === 'web' && !!navHotkeys.dashboard,
  });

  useHotkeys(navHotkeys.reservations?.keys || '', () => {
    router.push(navHotkeys.reservations.route as any);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: Platform.OS === 'web' && !!navHotkeys.reservations,
  });

  useHotkeys(navHotkeys.logbook?.keys || '', () => {
    router.push(navHotkeys.logbook.route as any);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: Platform.OS === 'web' && !!navHotkeys.logbook,
  });

  useHotkeys(navHotkeys.aircrafts?.keys || '', () => {
    router.push(navHotkeys.aircrafts.route as any);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: Platform.OS === 'web' && !!navHotkeys.aircrafts,
  });

  useHotkeys(navHotkeys.aerodromes?.keys || '', () => {
    router.push(navHotkeys.aerodromes.route as any);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: Platform.OS === 'web' && !!navHotkeys.aerodromes,
  });

  useHotkeys(navHotkeys.maintenance?.keys || '', () => {
    router.push(navHotkeys.maintenance.route as any);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: Platform.OS === 'web' && !!navHotkeys.maintenance,
  });

  useHotkeys(navHotkeys.routePlanner?.keys || '', () => {
    router.push(navHotkeys.routePlanner.route as any);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: Platform.OS === 'web' && !!navHotkeys.routePlanner,
  });

  // Global actions
  const hotkeysConfig = (NAVIGATION_CONFIG as any).hotkeys;

  useHotkeys(hotkeysConfig.actions.focusSearch?.keys || '', () => {
    console.log(`Search hotkey triggered: ${hotkeysConfig.actions.focusSearch.keys}`);
    onFocusSearch?.();
  }, {
    preventDefault: true,
    enableOnFormTags: true, // Allow in inputs for search focus
    enabled: isWeb && !!hotkeysConfig.actions.focusSearch,
  });

  useHotkeys(hotkeysConfig.actions.toggleAI?.keys || '', () => {
    console.log(`AI hotkey triggered: ${hotkeysConfig.actions.toggleAI.keys}`);
    onToggleAI?.();
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: isWeb && !!hotkeysConfig.actions.toggleAI,
  });

  // Context-aware "New" action
  useHotkeys(hotkeysConfig.actions.newItem?.keys || '', () => {
    console.log(`New item hotkey triggered: ${hotkeysConfig.actions.newItem.keys}`);
    const currentContext = hotkeysConfig.contextual[pathname as keyof typeof hotkeysConfig.contextual];
    if (currentContext?.newItem) {
      // Handle context-specific new item creation
      console.log(`Creating new item: ${currentContext.newItem.action}`);
      // TODO: Implement actual new item creation based on context
    }
  }, {
    enableOnFormTags: false,
    enabled: isWeb && !!hotkeysConfig.actions.newItem,
  });

  // Help shortcut
  useHotkeys(hotkeysConfig.actions.help?.keys || '', () => {
    console.log(`Help hotkey triggered: ${hotkeysConfig.actions.help.keys}`);
    router.push(hotkeysConfig.actions.help.route as any);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: isWeb && !!hotkeysConfig.actions.help,
  });

  // Close modals
  useHotkeys(hotkeysConfig.actions.closeModals?.keys || '', () => {
    console.log(`Close modal hotkey triggered: ${hotkeysConfig.actions.closeModals.keys}`);
    onCloseModals?.();
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: isWeb && !!hotkeysConfig.actions.closeModals,
  });
}
