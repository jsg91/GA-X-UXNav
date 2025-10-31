import { useState } from 'react';

/**
 * Modal state management hook
 * Handles all modal-related state and animations in the navigation system
 */
export interface ModalState {
  // Help overlay modal
  helpOverlay: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    show: () => void;
    hide: () => void;
  };

  // Hamburger menu/drawer
  hamburger: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    toggle: () => void;
    slideProgress: number;
    setSlideProgress: (progress: number) => void;
  };

  // Role switcher modal
  roleSwitcher: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    show: () => void;
    hide: () => void;
    slideProgress: number;
    setSlideProgress: (progress: number) => void;
  };

  // Utility actions
  closeAll: () => void;
  isAnyModalOpen: boolean;
}

export function useModalState(): ModalState {
  // Help overlay state
  const [showHelpOverlay, setShowHelpOverlay] = useState(false);

  // Hamburger menu/drawer state
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [drawerSlideProgress, setDrawerSlideProgress] = useState(0);

  // Role switcher modal state
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [roleSwitcherSlideProgress, setRoleSwitcherSlideProgress] = useState(0);

  // Computed values
  const isAnyModalOpen = showHelpOverlay || isHamburgerMenuOpen || isRoleSwitcherOpen;

  // Actions
  const closeAll = () => {
    setShowHelpOverlay(false);
    setIsHamburgerMenuOpen(false);
    setIsRoleSwitcherOpen(false);
    // Note: We don't reset slide progress here as it might be needed for animations
  };

  return {
    // Help overlay modal
    helpOverlay: {
      visible: showHelpOverlay,
      setVisible: setShowHelpOverlay,
      show: () => setShowHelpOverlay(true),
      hide: () => setShowHelpOverlay(false),
    },

    // Hamburger menu/drawer
    hamburger: {
      visible: isHamburgerMenuOpen,
      setVisible: setIsHamburgerMenuOpen,
      toggle: () => setIsHamburgerMenuOpen(prev => !prev),
      slideProgress: drawerSlideProgress,
      setSlideProgress: setDrawerSlideProgress,
    },

    // Role switcher modal
    roleSwitcher: {
      visible: isRoleSwitcherOpen,
      setVisible: setIsRoleSwitcherOpen,
      show: () => setIsRoleSwitcherOpen(true),
      hide: () => setIsRoleSwitcherOpen(false),
      slideProgress: roleSwitcherSlideProgress,
      setSlideProgress: setRoleSwitcherSlideProgress,
    },

    // Utility actions
    closeAll,
    isAnyModalOpen,
  };
}
