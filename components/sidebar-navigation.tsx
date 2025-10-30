import { usePathname, useRouter } from 'expo-router';
import React, { useMemo, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Button, View, YStack } from 'tamagui';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NAVIGATION_CONFIG, Role, generateNavigationForRole } from '@/constants/NAVIGATION';

interface SidebarNavigationProps {
  currentRole?: Role;
  onNavigate?: (href: string) => void;
  onExpansionChange?: (isExpanded: boolean) => void;
}

export function SidebarNavigation({ currentRole, onNavigate, onExpansionChange }: SidebarNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Generate navigation items based on current role
  const navigationItems = useMemo(() => {
    if (currentRole) {
      return generateNavigationForRole(currentRole);
    }
    // Fallback to old navigation config if no role
    return NAVIGATION_CONFIG.tabBar.items.filter(item => {
      return ('largeScreen' in item && item.largeScreen) || item.visible;
    });
  }, [currentRole]);

  const handleTabPress = (href: string) => {
    router.push(href as any);
    if (onNavigate) {
      onNavigate(href);
    }
    // Keep sidebar expanded for a moment after navigation so user sees the selection
    setIsExpanded(true);
    setTimeout(() => {
      if (!isHovered) {
        setIsExpanded(false);
      }
    }, 1000);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hasInitialized) {
      setTimeout(() => setIsExpanded(true), 50); // Small delay for smooth expansion
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
    }, 100);
  }, []);

  // Notify parent of expansion changes
  useEffect(() => {
    onExpansionChange?.(isExpanded);
  }, [isExpanded, onExpansionChange]);

  // Check if a tab is active
  const isTabActive = (href: string | null | undefined) => {
    if (!href) return false;
    if (href === '/(tabs)/' && pathname === '/') return true;
    if (href && pathname.includes(href.replace('/(tabs)/', ''))) return true;
    return href === pathname;
  };

  const visibleItems = navigationItems;

  // Header height - matches the header minHeight in responsive-navigation
  const HEADER_HEIGHT = 56;
  // Sidebar starts at top of content area (which is already below header)
  const SIDEBAR_TOP_OFFSET = 0;

  return (
    <YStack
      onMouseEnter={Platform.OS === 'web' ? handleMouseEnter : undefined}
      onMouseLeave={Platform.OS === 'web' ? handleMouseLeave : undefined}
      animation="slow"
      backgroundColor="$background"
      borderBottomRightRadius="$5"
      borderRightColor="$borderColor"
      borderRightWidth="$0.5"
      gap="$2"
      justifyContent="flex-start"
      left={0}
      opacity={isVisible ? 1 : 0}
      overflow="hidden"
      paddingBottom="$4"
      paddingTop={0}
      position="absolute"
      scale={isVisible ? 1 : 0.95}
      shadowColor={isHovered ? "$shadowColor" : "transparent"}
      shadowOffset={{ width: 1, height: 0 }}
      shadowOpacity={isHovered ? 0.15 : 0}
      shadowRadius={2}
      top={SIDEBAR_TOP_OFFSET}
      transition="width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      width={isExpanded ? 240 : 72}
      zIndex={1000}
    >
      {/* Navigation Items */}
      <YStack gap={0}>
        {visibleItems.map((item, index) => {
          const isActive = isTabActive(item.href);
          const isLast = index === visibleItems.length - 1;
          return (
            <React.Fragment key={item.id}>
              <Button
                style={{
                  userSelect: 'none',
                }}
                onPress={() => handleTabPress('href' in item ? item.href : (item as any).href)}
                alignItems="center"
                backgroundColor="transparent"
                borderRadius={0}
                flexDirection="row"
                gap="$3"
                hoverStyle={Platform.OS === 'web' ? {
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  scale: 1.02,
                  userSelect: 'none',
                } : undefined}
                justifyContent="flex-start"
                marginHorizontal="$2"
                opacity={1}
                paddingHorizontal="$4"
                paddingVertical="$4"
                pressStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  scale: 0.98,
                }}
              >
                <IconSymbol
                  name={(item.icon || (item as any).icon) as any}
                  color={isActive ? "$tint" : "$tabIconDefault"}
                  size={24}
                />
                <ThemedText
                  style={{
                    userSelect: 'none',
                  }}
                  color="$color"
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
                  backgroundColor="rgba(0, 0, 0, 0.08)"
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

