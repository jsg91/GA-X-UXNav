import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, View, YStack } from 'tamagui';

import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_EXPANDED_WIDTH, ICON_SIZES } from '@/constants/layout';
import { SIDEBAR_SHADOW } from '@/constants/shadow-styles';
import { ANIMATION_DELAYS } from '@/constants/animation-delays';
import { Z_INDEX } from '@/constants/z-index';
import { OPACITY } from '@/constants/opacity';
import { TRANSFORM_SCALES } from '@/constants/transform-scales';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Role } from '@/navigation';
import { useNavigationItems } from '@/hooks/use-navigation-items';
import { getIconColor } from '@/utils/icons';
import { isWeb } from '@/utils/platform';
import { getItemHref, isTabActive } from '@/utils/navigation';
import { INTERACTIVE_COLORS } from '@/utils/interactive-colors';
import { navigateTo } from '@/utils/router';
import { useThemeContext } from '@/hooks/use-theme-context';

interface SidebarNavigationProps {
  currentRole?: Role;
  onNavigate?: (href: string) => void;
  onExpansionChange?: (isExpanded: boolean) => void;
}

export function SidebarNavigation({ currentRole, onNavigate, onExpansionChange }: SidebarNavigationProps) {
  const { resolvedTheme } = useThemeContext();
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Generate navigation items based on current role (for large screen/sidebar)
  const navigationItems = useNavigationItems(currentRole, { forLargeScreen: true });

  const handleTabPress = (href: string) => {
    navigateTo(href);
    if (onNavigate) {
      onNavigate(href);
    }
    // Keep sidebar expanded for a moment after navigation so user sees the selection
    setIsExpanded(true);
    setTimeout(() => {
      if (!isHovered) {
        setIsExpanded(false);
      }
    }, ANIMATION_DELAYS.feedback);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hasInitialized) {
      setTimeout(() => setIsExpanded(true), ANIMATION_DELAYS.quick);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsExpanded(false);
  };


  // Initial entrance animation
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
      setHasInitialized(true);
    }, ANIMATION_DELAYS.standard);
  }, []);

  // Notify parent of expansion changes
  useEffect(() => {
    onExpansionChange?.(isExpanded);
  }, [isExpanded, onExpansionChange]);

  // Check if a tab is active using shared utility
  const checkTabActive = (href: string | null | undefined) => isTabActive(href, pathname);

  const visibleItems = navigationItems;

  // Sidebar starts at top of content area (which is already below header)
  const SIDEBAR_TOP_OFFSET = 0;

  return (
    <YStack
      onMouseEnter={isWeb ? handleMouseEnter : undefined}
      onMouseLeave={isWeb ? handleMouseLeave : undefined}
      animation="slow"
      backgroundColor="$backgroundSecondary"
      borderBottomRightRadius="$5"
      borderLeftColor={resolvedTheme === 'dark' ? '#333333' : '$borderColor'}
      borderLeftWidth="$0.5"
      borderRightColor={resolvedTheme === 'dark' ? '#333333' : '$borderColor'}
      borderRightWidth="$0.5"
      borderTopColor={resolvedTheme === 'dark' ? '#333333' : '$borderColor'}
      borderTopWidth="$0.5"
      borderBottomColor={resolvedTheme === 'dark' ? '#333333' : '$borderColor'}
      borderBottomWidth="$0.5"
      gap="$2"
      justifyContent="flex-start"
      left={0}
      opacity={isVisible ? 1 : 0}
      overflow="hidden"
      paddingBottom="$4"
      paddingTop={0}
      position="absolute"
      scale={isVisible ? TRANSFORM_SCALES.normal : TRANSFORM_SCALES.initial}
      shadowColor={isHovered ? (resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : SIDEBAR_SHADOW.shadowColor) : "transparent"}
      shadowOffset={SIDEBAR_SHADOW.shadowOffset}
      shadowOpacity={isHovered ? (resolvedTheme === 'dark' ? 0.3 : SIDEBAR_SHADOW.shadowOpacity) : 0}
      shadowRadius={SIDEBAR_SHADOW.shadowRadius}
      top={SIDEBAR_TOP_OFFSET}
      transition="width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      width={isExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH}
      zIndex={Z_INDEX.sidebar}
    >
      {/* Navigation Items */}
      <YStack gap={0}>
        {visibleItems.map((item, index) => {
          const href = getItemHref(item);
          const isActive = checkTabActive(href);
          const isLast = index === visibleItems.length - 1;
          return (
            <React.Fragment key={item.id}>
              <Button
                style={{
                  userSelect: 'none',
                }}
                onPress={() => handleTabPress(href || '')}
                alignItems="center"
                backgroundColor="transparent"
                borderRadius={0}
                flexDirection="row"
                gap="$3"
                hoverStyle={isWeb ? {
                  backgroundColor: INTERACTIVE_COLORS.hover,
                  scale: TRANSFORM_SCALES.hover,
                  userSelect: 'none',
                } : undefined}
                justifyContent="flex-start"
                marginHorizontal="$2"
                opacity={OPACITY.full}
                paddingHorizontal="$4"
                paddingVertical="$4"
                pressStyle={{
                  backgroundColor: INTERACTIVE_COLORS.hover,
                  scale: TRANSFORM_SCALES.press,
                }}
              >
                <IconSymbol
                  name={(item.icon || (item as any).icon) as any}
                  color={getIconColor(isActive, resolvedTheme)}
                  size={ICON_SIZES.xlarge}
                />
                <ThemedText
                  style={{
                    userSelect: 'none',
                  }}
                  color={resolvedTheme === 'dark' ? '#FFFFFF' : '$color'}
                  fontSize="$4"
                  fontWeight="$3"
                  numberOfLines={1}
                  opacity={isExpanded ? 1 : 0}
                >
                  {item.name || item.label || (item as any).name}
                </ThemedText>
              </Button>
              {!isLast && (
                <View
                  backgroundColor={resolvedTheme === 'dark' ? '#333333' : INTERACTIVE_COLORS.groupHeaderBorder}
                  height={1}
                  marginHorizontal="$2"
                  marginVertical="$1"
                />
              )}
            </React.Fragment>
          );
        })}
      </YStack>
    </YStack>
  );
}

