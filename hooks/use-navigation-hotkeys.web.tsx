import { usePathname } from 'expo-router';
import { useHotkeys } from 'react-hotkeys-hook';

import { NAVIGATION_CONFIG } from '@/navigation';
import { isWeb } from '@/utils/platform';
import { navigateTo } from '@/utils/router';

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
  const pathname = usePathname();

  if (__DEV__) {
    console.log(`Initializing navigation hotkeys for platform: ${isWeb ? 'web' : 'mobile'}`);
  }

  // Navigation shortcuts (GitHub-style sequences)
  // Must register each hotkey individually (can't call hooks in loops)
  const navHotkeys = (NAVIGATION_CONFIG as any).hotkeys.navigation;
  
  useHotkeys(navHotkeys.dashboard?.keys || '', () => {
    console.log(`Navigation hotkey triggered: ${navHotkeys.dashboard.keys} -> ${navHotkeys.dashboard.route}`);
    navigateTo(navHotkeys.dashboard.route);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: isWeb && !!navHotkeys.dashboard,
  });

  useHotkeys(navHotkeys.reservations?.keys || '', () => {
    navigateTo(navHotkeys.reservations.route);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: isWeb && !!navHotkeys.reservations,
  });

  useHotkeys(navHotkeys.logbook?.keys || '', () => {
    navigateTo(navHotkeys.logbook.route);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: isWeb && !!navHotkeys.logbook,
  });

  useHotkeys(navHotkeys.aircrafts?.keys || '', () => {
    navigateTo(navHotkeys.aircrafts.route);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: isWeb && !!navHotkeys.aircrafts,
  });

  useHotkeys(navHotkeys.aerodromes?.keys || '', () => {
    navigateTo(navHotkeys.aerodromes.route);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: isWeb && !!navHotkeys.aerodromes,
  });

  useHotkeys(navHotkeys.maintenance?.keys || '', () => {
    navigateTo(navHotkeys.maintenance.route);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: isWeb && !!navHotkeys.maintenance,
  });

  useHotkeys(navHotkeys.routePlanner?.keys || '', () => {
    navigateTo(navHotkeys.routePlanner.route);
  }, {
    preventDefault: true,
    enableOnFormTags: false,
    enabled: isWeb && !!navHotkeys.routePlanner,
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
    navigateTo(hotkeysConfig.actions.help.route);
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

