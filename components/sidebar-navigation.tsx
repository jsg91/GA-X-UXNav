import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Button, View, YStack } from 'tamagui';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NAVIGATION_CONFIG } from '@/constants/NAVIGATION';

interface SidebarNavigationProps {
  onNavigate?: (href: string) => void;
}

export function SidebarNavigation({ onNavigate }: SidebarNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTabPress = (href: string) => {
    router.push(href as any);
    if (onNavigate) {
      onNavigate(href);
    }
  };

  // Check if a tab is active
  const isTabActive = (href: string) => {
    if (href === '/(tabs)/' && pathname === '/') return true;
    if (href && pathname.includes(href.replace('/(tabs)/', ''))) return true;
    return href === pathname;
  };

  const visibleItems = NAVIGATION_CONFIG.tabBar.items.filter(item => item.visible);

  return (
    <YStack
      backgroundColor="$background"
      height="100%"
      borderRightWidth="$0.5"
      borderRightColor="$borderColor"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 1, height: 0 }}
      shadowOpacity={0.1}
      shadowRadius={2}
      width={isExpanded ? 240 : 72}
      animation="quick"
      onMouseEnter={Platform.OS === 'web' ? () => setIsExpanded(true) : undefined}
      onMouseLeave={Platform.OS === 'web' ? () => setIsExpanded(false) : undefined}
      paddingVertical="$4"
      gap="$2"
      overflow="hidden"
    >
      {visibleItems.map((item) => {
        const isActive = isTabActive(item.href);
        return (
          <Button
            key={item.id}
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            paddingHorizontal="$4"
            paddingVertical="$3"
            backgroundColor={isActive ? "rgba(0, 123, 255, 0.1)" : "transparent"}
            borderRadius="$2"
            marginHorizontal="$2"
            gap="$3"
            onPress={() => handleTabPress(item.href)}
            hoverStyle={Platform.OS === 'web' ? {
              backgroundColor: isActive ? "rgba(0, 123, 255, 0.15)" : "rgba(0, 0, 0, 0.05)",
            } : undefined}
            pressStyle={{
              backgroundColor: isActive ? "rgba(0, 123, 255, 0.15)" : "rgba(0, 0, 0, 0.05)",
            }}
          >
            <View width={24} height={24} alignItems="center" justifyContent="center">
              <IconSymbol
                name={item.icon as any}
                size={24}
                color={isActive ? "$tint" : "$tabIconDefault"}
              />
            </View>
            {isExpanded && (
              <ThemedText
                fontSize="$4"
                fontWeight={isActive ? "$5" : "$3"}
                color={isActive ? "$tint" : "$color"}
                numberOfLines={1}
                animation="quick"
                opacity={isExpanded ? 1 : 0}
              >
                {item.name}
              </ThemedText>
            )}
          </Button>
        );
      })}
    </YStack>
  );
}

