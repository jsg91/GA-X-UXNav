import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Button, YStack } from 'tamagui';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NAVIGATION_CONFIG } from '@/constants/NAVIGATION';

interface SidebarNavigationProps {
  onNavigate?: (href: string) => void;
  onExpansionChange?: (isExpanded: boolean) => void;
}

export function SidebarNavigation({ onNavigate, onExpansionChange }: SidebarNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

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
  const isTabActive = (href: string) => {
    if (href === '/(tabs)/' && pathname === '/') return true;
    if (href && pathname.includes(href.replace('/(tabs)/', ''))) return true;
    return href === pathname;
  };

  const visibleItems = NAVIGATION_CONFIG.tabBar.items.filter(item => {
    return ('largeScreen' in item && item.largeScreen) || item.visible;
  });

  return (
    <YStack
      backgroundColor="$background"
      position="absolute"
      left={0}
      top={0}
      bottom={0}
      borderRightWidth="$0.5"
      borderRightColor="$borderColor"
      shadowColor={isHovered ? "$shadowColor" : "transparent"}
      shadowOffset={{ width: 1, height: 0 }}
      shadowOpacity={isHovered ? 0.15 : 0}
      shadowRadius={2}
      width={isExpanded ? 240 : 72}
      zIndex={1000}
      animation="quick"
      opacity={isVisible ? 1 : 0}
      scale={isVisible ? 1 : 0.95}
      onMouseEnter={Platform.OS === 'web' ? handleMouseEnter : undefined}
      onMouseLeave={Platform.OS === 'web' ? handleMouseLeave : undefined}
      paddingVertical="$4"
      gap="$2"
      overflow="hidden"
      justifyContent="flex-start"
    >
      {/* Navigation Items */}
      <YStack flex={1} gap="$2">
        {visibleItems.map((item, index) => {
          const isActive = isTabActive(item.href);
          return (
            <Button
              key={item.id}
              flexDirection="row"
              alignItems="center"
              justifyContent="flex-start"
              paddingHorizontal="$4"
              paddingVertical="$3"
              backgroundColor={isActive ? "rgba(0, 122, 255, 0.1)" : "transparent"}
              borderRadius="$2"
              marginHorizontal="$2"
              gap="$3"
              onPress={() => handleTabPress(item.href)}
              hoverStyle={Platform.OS === 'web' ? {
                backgroundColor: isActive ? "rgba(0, 122, 255, 0.15)" : "rgba(0, 0, 0, 0.05)",
                scale: 1.02,
                userSelect: 'none',
              } : undefined}
              pressStyle={{
                backgroundColor: isActive ? "rgba(0, 122, 255, 0.15)" : "rgba(0, 0, 0, 0.05)",
                scale: 0.98,
              }}
              style={{
                userSelect: 'none',
              }}
              opacity={1}
            >
              <IconSymbol
                name={item.icon as any}
                size={24}
                color={isActive ? "$tint" : "$tabIconDefault"}
              />
            <ThemedText
              fontSize="$4"
              fontWeight={isActive ? "$5" : "$3"}
              color={isActive ? "$tint" : "$color"}
              numberOfLines={1}
              opacity={isExpanded ? 1 : 0}
              style={{
                userSelect: 'none',
              }}
            >
              {item.name}
            </ThemedText>
            </Button>
          );
        })}
      </YStack>

      {/* GA-X AI Assistant Button - Fixed at bottom, standalone */}
      <Button
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        paddingHorizontal="$4"
        paddingVertical="$3"
        backgroundColor="rgba(0, 122, 255, 0.1)"
        borderRadius="$2"
        marginHorizontal="$2"
        marginBottom="$2"
        gap={isExpanded ? "$3" : "$0"}
        onPress={() => {
          console.log('GA-X AI Assistant clicked');
          // TODO: Open AI assistant modal or navigate to AI page
        }}
        hoverStyle={Platform.OS === 'web' ? {
          backgroundColor: 'rgba(0, 122, 255, 0.2)',
          scale: 1.02,
          boxShadow: isExpanded ? '0 0 20px rgba(0, 122, 255, 0.4)' : '0 0 15px rgba(0, 122, 255, 0.3)',
          userSelect: 'none',
        } : {
          backgroundColor: 'rgba(0, 122, 255, 0.2)',
          scale: 1.02,
        }}
        pressStyle={{
          backgroundColor: 'rgba(0, 122, 255, 0.3)',
          scale: 0.98,
        }}
        style={Platform.OS === 'web' ? {
          boxShadow: isExpanded
            ? '0 0 15px rgba(0, 122, 255, 0.4), 0 0 30px rgba(0, 122, 255, 0.2)'
            : '0 0 10px rgba(0, 122, 255, 0.3)',
          userSelect: 'none',
        } : {}}
      >
        <IconSymbol
          name="brain"
          size={24}
          color="#007AFF"
        />
        {isExpanded && (
          <ThemedText
            fontSize="$4"
            fontWeight="$5"
            color="#007AFF"
            numberOfLines={1}
            style={{
              userSelect: 'none',
            }}
          >
            GA-X AI Assistant
          </ThemedText>
        )}
      </Button>
    </YStack>
  );
}

