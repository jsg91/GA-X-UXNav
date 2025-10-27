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
    setTimeout(() => setIsExpanded(true), 50); // Small delay for smooth expansion
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsExpanded(false);
  };

  const handleClick = () => {
    // Toggle expansion state on click for better UX
    setIsExpanded(!isExpanded);
  };

  // Initial entrance animation
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
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

  const visibleItems = NAVIGATION_CONFIG.tabBar.items.filter(item => item.visible);

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
      animation={[
        isVisible ? "quick" : "lazy",
        {
          opacity: {
            overshootClamping: true,
          },
          width: {
            overshootClamping: true,
          },
          scale: {
            overshootClamping: true,
          },
        },
      ]}
      opacity={isVisible ? 1 : 0}
      scale={isVisible ? 1 : 0.95}
      onMouseEnter={Platform.OS === 'web' ? handleMouseEnter : undefined}
      onMouseLeave={Platform.OS === 'web' ? handleMouseLeave : undefined}
      onPress={handleClick}
      paddingVertical="$4"
      gap="$2"
      overflow="hidden"
      justifyContent="flex-start"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
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
            backgroundColor={isActive ? "rgba(0, 123, 255, 0.1)" : "transparent"}
            borderRadius="$2"
            marginHorizontal="$2"
            gap="$3"
            onPress={() => handleTabPress(item.href)}
            hoverStyle={Platform.OS === 'web' ? {
              backgroundColor: isActive ? "rgba(0, 123, 255, 0.15)" : "rgba(0, 0, 0, 0.05)",
              scale: 1.02,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            } : undefined}
            pressStyle={{
              backgroundColor: isActive ? "rgba(0, 123, 255, 0.15)" : "rgba(0, 0, 0, 0.05)",
              scale: 0.98,
            }}
            animation={[
              "quick",
              {
                opacity: {
                  delay: isVisible ? 200 + (index * 50) : 0,
                  duration: 300,
                },
                transform: {
                  delay: isVisible ? 200 + (index * 50) : 0,
                  duration: 300,
                },
              },
            ]}
            opacity={1}
            transform="translateY(0px)"
          >
            <IconSymbol
              name={item.icon as any}
              size={24}
              color={isActive ? "$tint" : "$tabIconDefault"}
              animation="quick"
            />
            <ThemedText
              fontSize="$4"
              fontWeight={isActive ? "$5" : "$3"}
              color={isActive ? "$tint" : "$color"}
              numberOfLines={1}
              animation={[
                "quick",
                {
                  opacity: {
                    delay: isExpanded ? 150 : 0,
                    duration: 200,
                  },
                },
              ]}
              opacity={isExpanded ? 1 : 0}
              scale={isExpanded ? 1 : 0.95}
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              {item.name}
            </ThemedText>
          </Button>
        );
      })}
    </YStack>
  );
}

