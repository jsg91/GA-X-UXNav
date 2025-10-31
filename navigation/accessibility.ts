import { BaseNavItem, GeneratedNavItem } from './types';
import { NAVIGATION_ACCESSIBILITY, NAVIGATION_CONSTANTS } from './constants';

/**
 * Accessibility helpers for navigation components
 * Provides ARIA labels, keyboard navigation, and screen reader support
 */

// ===== ACCESSIBILITY INTERFACES =====

/**
 * Accessibility properties for navigation items
 */
export interface NavigationAccessibilityProps {
  'aria-label'?: string;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-describedby'?: string;
  'aria-controls'?: string;
  role?: string;
  tabIndex?: number;
}

/**
 * Keyboard navigation configuration
 */
export interface KeyboardNavigationConfig {
  enableArrowKeys: boolean;
  enableHomeEndKeys: boolean;
  enableTabNavigation: boolean;
  loopNavigation: boolean;
  preventDefaultKeys: string[];
}

// ===== ACCESSIBILITY HELPERS =====

/**
 * Get accessibility properties for a navigation item
 */
export function getNavigationItemAccessibility(
  item: BaseNavItem | GeneratedNavItem,
  isActive: boolean = false,
  isExpanded: boolean = false
): NavigationAccessibilityProps {
  const baseProps: NavigationAccessibilityProps = {
    'aria-label': item.name,
    role: 'menuitem',
  };

  if (isActive) {
    baseProps['aria-current'] = 'page';
  }

  // Add expansion state for items that can expand
  if ('customPage' in item && !item.customPage) {
    // This is an entity-based navigation item that might have sub-items
    baseProps['aria-expanded'] = isExpanded;
    baseProps['aria-haspopup'] = 'menu';
  }

  return baseProps;
}

/**
 * Get accessibility properties for navigation containers
 */
export function getNavigationContainerAccessibility(
  type: 'sidebar' | 'bottom-nav' | 'drawer' | 'menu',
  isExpanded: boolean = true
): NavigationAccessibilityProps {
  const baseProps: NavigationAccessibilityProps = {
    role: 'navigation',
  };

  switch (type) {
    case 'sidebar':
      baseProps['aria-label'] = NAVIGATION_ACCESSIBILITY.navigationLabel;
      break;
    case 'bottom-nav':
      baseProps['aria-label'] = 'Bottom navigation';
      break;
    case 'drawer':
      baseProps['aria-label'] = 'Navigation drawer';
      baseProps['aria-expanded'] = isExpanded;
      break;
    case 'menu':
      baseProps['aria-label'] = 'Navigation menu';
      baseProps.role = 'menu';
      break;
  }

  return baseProps;
}

/**
 * Get keyboard navigation configuration
 */
export function getKeyboardNavigationConfig(
  navigationType: 'sidebar' | 'bottom-nav' | 'drawer'
): KeyboardNavigationConfig {
  const baseConfig: KeyboardNavigationConfig = {
    enableArrowKeys: true,
    enableHomeEndKeys: true,
    enableTabNavigation: true,
    loopNavigation: false,
    preventDefaultKeys: [],
  };

  switch (navigationType) {
    case 'sidebar':
      return {
        ...baseConfig,
        loopNavigation: true,
        preventDefaultKeys: ['ArrowUp', 'ArrowDown', 'Home', 'End'],
      };
    case 'bottom-nav':
      return {
        ...baseConfig,
        enableArrowKeys: false, // Bottom nav typically uses tab navigation
        preventDefaultKeys: ['Tab'],
      };
    case 'drawer':
      return {
        ...baseConfig,
        loopNavigation: true,
        preventDefaultKeys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'],
      };
  }
}

/**
 * Handle keyboard navigation for navigation items
 */
export function handleKeyboardNavigation(
  event: KeyboardEvent,
  items: (BaseNavItem | GeneratedNavItem)[],
  currentIndex: number,
  config: KeyboardNavigationConfig,
  onIndexChange: (newIndex: number) => void,
  onActivate?: (item: BaseNavItem | GeneratedNavItem) => void
): void {
  const { key } = event;
  let newIndex = currentIndex;

  // Handle arrow key navigation
  if (config.enableArrowKeys) {
    switch (key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : config.loopNavigation ? items.length - 1 : 0;
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : config.loopNavigation ? 0 : items.length - 1;
        break;
    }
  }

  // Handle Home/End keys
  if (config.enableHomeEndKeys) {
    switch (key) {
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
    }
  }

  // Handle activation (Enter/Space)
  if (key === 'Enter' || key === ' ') {
    event.preventDefault();
    const currentItem = items[currentIndex];
    if (currentItem && onActivate) {
      onActivate(currentItem);
    }
    return;
  }

  // Handle Escape (close drawer/menu)
  if (key === 'Escape' && config.preventDefaultKeys.includes('Escape')) {
    event.preventDefault();
    // Close functionality should be handled by parent component
    return;
  }

  // Update index if changed
  if (newIndex !== currentIndex) {
    onIndexChange(newIndex);
  }
}

/**
 * Generate unique IDs for accessibility
 */
export class AccessibilityIdGenerator {
  private static counter = 0;
  private static prefix = 'nav';

  static generate(type: 'item' | 'container' | 'menu' | 'button'): string {
    return `${this.prefix}-${type}-${++this.counter}`;
  }

  static reset(): void {
    this.counter = 0;
  }
}

/**
 * Screen reader announcements for navigation changes
 */
export class ScreenReaderAnnouncer {
  private static announcerElement: HTMLElement | null = null;

  private static getAnnouncerElement(): HTMLElement {
    if (!this.announcerElement && typeof document !== 'undefined') {
      this.announcerElement = document.createElement('div');
      this.announcerElement.setAttribute('aria-live', 'polite');
      this.announcerElement.setAttribute('aria-atomic', 'true');
      this.announcerElement.style.position = 'absolute';
      this.announcerElement.style.left = '-10000px';
      this.announcerElement.style.width = '1px';
      this.announcerElement.style.height = '1px';
      this.announcerElement.style.overflow = 'hidden';
      document.body.appendChild(this.announcerElement);
    }
    return this.announcerElement!;
  }

  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (typeof document === 'undefined') return;

    const announcer = this.getAnnouncerElement();
    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      if (announcer.textContent === message) {
        announcer.textContent = '';
      }
    }, NAVIGATION_CONSTANTS.ANIMATION_DELAYS.standard);
  }

  static announceNavigationChange(
    action: 'opened' | 'closed' | 'navigated',
    target: string
  ): void {
    const messages = {
      opened: `${target} navigation opened`,
      closed: `${target} navigation closed`,
      navigated: `Navigated to ${target}`,
    };

    this.announce(messages[action]);
  }
}

/**
 * Focus management utilities for navigation
 */
export class NavigationFocusManager {
  private static focusStack: HTMLElement[] = [];

  static saveFocus(): void {
    if (typeof document !== 'undefined') {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        this.focusStack.push(activeElement);
      }
    }
  }

  static restoreFocus(): void {
    const element = this.focusStack.pop();
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }

  static focusFirstFocusableElement(container: HTMLElement): void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement && typeof firstElement.focus === 'function') {
      firstElement.focus();
    }
  }

  static trapFocus(container: HTMLElement, event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      // Shift+Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
}

/**
 * High contrast mode detection and adjustments
 */
export function detectHighContrastMode(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for high contrast mode using CSS media queries
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Reduced motion detection for animations
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Generate accessibility summary for navigation
 */
export function generateNavigationSummary(items: (BaseNavItem | GeneratedNavItem)[]): string {
  const visibleItems = items.filter(item => 'visible' in item ? item.visible : true);
  const categories = visibleItems.reduce((acc, item) => {
    // Simple categorization - could be enhanced with more sophisticated logic
    if (item.id.includes('admin') || item.id.includes('settings')) {
      acc.admin++;
    } else if (item.id.includes('aircraft') || item.id.includes('logbook')) {
      acc.flight++;
    } else {
      acc.general++;
    }
    return acc;
  }, { admin: 0, flight: 0, general: 0 });

  return `Navigation menu with ${visibleItems.length} items: ${categories.flight} flight operations, ${categories.admin} administration, ${categories.general} general items.`;
}
