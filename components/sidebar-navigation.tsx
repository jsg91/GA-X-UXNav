import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Button, View, YStack } from 'tamagui';

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
      onMouseEnter={Platform.OS === 'web' ? handleMouseEnter : undefined}
      onMouseLeave={Platform.OS === 'web' ? handleMouseLeave : undefined}
      animation="quick"
      backgroundColor="$background"
      borderRightColor="$borderColor"
      borderRightWidth="$0.5"
      bottom={0}
      gap="$2"
      justifyContent="flex-start"
      left={0}
      opacity={isVisible ? 1 : 0}
      overflow="hidden"
      paddingVertical="$4"
      position="absolute"
      scale={isVisible ? 1 : 0.95}
      shadowColor={isHovered ? "$shadowColor" : "transparent"}
      shadowOffset={{ width: 1, height: 0 }}
      shadowOpacity={isHovered ? 0.15 : 0}
      shadowRadius={2}
      top={0}
      width={isExpanded ? 240 : 72}
      zIndex={1000}
    >
      {/* Navigation Items */}
      <YStack flex={1} gap={0}>
        {visibleItems.map((item, index) => {
          const isActive = isTabActive(item.href);
          const isLast = index === visibleItems.length - 1;
          return (
            <React.Fragment key={item.id}>
              <Button
                style={{
                  userSelect: 'none',
                }}
                onPress={() => handleTabPress(item.href)}
                alignItems="center"
                backgroundColor={isActive ? "rgba(0, 122, 255, 0.1)" : "transparent"}
                borderRadius={0}
                flexDirection="row"
                gap="$3"
                hoverStyle={Platform.OS === 'web' ? {
                  backgroundColor: isActive ? "rgba(0, 122, 255, 0.15)" : "rgba(0, 0, 0, 0.05)",
                  scale: 1.02,
                  userSelect: 'none',
                } : undefined}
                justifyContent="flex-start"
                marginHorizontal="$2"
                opacity={1}
                paddingHorizontal="$4"
                paddingVertical="$3"
                pressStyle={{
                  backgroundColor: isActive ? "rgba(0, 122, 255, 0.15)" : "rgba(0, 0, 0, 0.05)",
                  scale: 0.98,
                }}
              >
                <IconSymbol
                  name={item.icon as any}
                  color={isActive ? "$tint" : "$tabIconDefault"}
                  size={24}
                />
                <ThemedText
                  style={{
                    userSelect: 'none',
                  }}
                  color={isActive ? "$tint" : "$color"}
                  fontSize="$4"
                  fontWeight={isActive ? "$5" : "$3"}
                  numberOfLines={1}
                  opacity={isExpanded ? 1 : 0}
                >
                  {item.name}
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

      {/* Divider before AI Assistant */}
      <View
        backgroundColor="rgba(0, 0, 0, 0.08)"
        height={1}
        marginHorizontal="$2"
        marginVertical="$2"
      />

      {/* GA-X AI Assistant Button - Fixed at bottom, standalone */}
      <Button
        style={Platform.OS === 'web' ? {
          boxShadow: isExpanded
            ? '0 0 15px rgba(0, 122, 255, 0.4), 0 0 30px rgba(0, 122, 255, 0.2)'
            : '0 0 10px rgba(0, 122, 255, 0.3)',
          userSelect: 'none',
        } : {}}
        onPress={() => {
          console.log('GA-X AI Assistant clicked');
          // TODO: Open AI assistant modal or navigate to AI page
        }}
        alignItems="center"
        backgroundColor="rgba(0, 122, 255, 0.1)"
        borderRadius="$2"
        flexDirection="row"
        gap={isExpanded ? "$3" : "$0"}
        hoverStyle={Platform.OS === 'web' ? {
          backgroundColor: 'rgba(0, 122, 255, 0.2)',
          scale: 1.02,
          boxShadow: isExpanded ? '0 0 20px rgba(0, 122, 255, 0.4)' : '0 0 15px rgba(0, 122, 255, 0.3)',
          userSelect: 'none',
        } : {
          backgroundColor: 'rgba(0, 122, 255, 0.2)',
          scale: 1.02,
        }}
        justifyContent="flex-start"
        marginBottom="$2"
        marginHorizontal="$2"
        paddingHorizontal="$4"
        paddingVertical="$3"
        pressStyle={{
          backgroundColor: 'rgba(0, 122, 255, 0.3)',
          scale: 0.98,
        }}
      >
        <IconSymbol
          name="brain"
          color="#007AFF"
          size={24}
        />
        {isExpanded && (
          <ThemedText
            style={{
              userSelect: 'none',
            }}
            color="#007AFF"
            fontSize="$4"
            fontWeight="$5"
            numberOfLines={1}
          >
            GA-X AI Assistant
          </ThemedText>
        )}
      </Button>
    </YStack>
  );
}

