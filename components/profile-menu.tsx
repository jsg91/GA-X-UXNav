import { AlertUtils } from '@/components/ui/alert-utils';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NAVIGATION_CONFIG } from '@/constants/NAVIGATION';
import { useThemeContext } from '@/hooks/use-theme-context';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Platform, useWindowDimensions } from 'react-native';
import {
  Button,
  ScrollView,
  View,
  XStack,
  YStack
} from 'tamagui';
import { ThemedText } from './themed-text';

export function ProfileMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const { resolvedTheme } = useThemeContext();
  const router = useRouter();
  const pathname = usePathname();
  const { height: windowHeight } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  
  // Header height - matches the header minHeight in responsive-navigation
  const HEADER_HEIGHT = 56;
  // Header padding ($3) - matches paddingHorizontal in responsive-navigation header
  const HEADER_PADDING = 12; // $3 = 12px
  const maxPanelHeight = windowHeight > 0 ? windowHeight - HEADER_HEIGHT - 20 : 600;

  const handleLogout = () => {
    AlertUtils.showLogoutConfirmation(() => {
      // TODO: Implement actual logout logic
      console.log('User signed out');
      setIsVisible(false);
    });
  };

  const handleMenuItemPress = (item: typeof NAVIGATION_CONFIG.profileMenu.items[number]) => {
    setIsVisible(false);

    if (item.id === 'logout') {
      handleLogout();
      return;
    }

    // Navigate to the route if href exists
    if (item.href) {
      router.push(item.href as any);
    }
  };

  const isItemActive = (item: typeof NAVIGATION_CONFIG.profileMenu.items[number]) => {
    if (!item.href) return false;
    if (item.href === '/(tabs)/' && pathname === '/') return true;
    if (item.href && pathname.includes(item.href.replace('/(tabs)/', ''))) return true;
    return item.href === pathname;
  };

  const visibleItems = NAVIGATION_CONFIG.profileMenu.items.filter(item => item.visible);

  const renderDropdownContent = () => (
    <>
      <YStack 
        borderBottomColor="$borderColor" 
        borderBottomWidth="$0.5"
        padding="$4"
        paddingBottom="$3"
      >
        <XStack justifyContent="space-between">
          <ThemedText color="$color" fontSize="$5" fontWeight="$6">
            Profile Menu
          </ThemedText>
          <Button
            onPress={() => setIsVisible(false)}
            backgroundColor="transparent"
            padding="$1"
            size="$2"
          >
            <IconSymbol
              name="close"
              color="$color"
              size={20}
            />
          </Button>
        </XStack>
      </YStack>

      <ScrollView 
        flex={1} 
        showsVerticalScrollIndicator={false}
      >
        {visibleItems.map((item) => {
          const isActive = isItemActive(item);
          return (
            <Button
              key={item.id}
              onPress={() => handleMenuItemPress(item)}
              backgroundColor="transparent"
              borderBottomWidth={0}
              borderRadius={0}
              hoverStyle={isWeb ? {
                backgroundColor: 'rgba(0, 122, 255, 0.08)',
              } : undefined}
              paddingHorizontal="$4"
              paddingVertical="$3"
              pressStyle={{
                backgroundColor: 'rgba(0, 122, 255, 0.12)',
              }}
            >
              <XStack alignItems="center" gap="$3" justifyContent="flex-start" width="100%">
                <IconSymbol
                  name={item.icon as any}
                  color={item.id === 'logout' 
                    ? (resolvedTheme === 'dark' ? '#FF453A' : '#FF3B30') 
                    : (isActive ? "$tint" : "$color")}
                  size={18}
                />
                <ThemedText
                  color={item.id === 'logout' ? (resolvedTheme === 'dark' ? '#FF453A' : '#FF3B30') : '$color'}
                  flex={1}
                  textAlign="left"
                  fontSize="$4"
                  fontWeight="$4"
                >
                  {item.name}
                </ThemedText>
              </XStack>
            </Button>
          );
        })}
      </ScrollView>
    </>
  );

  return (
    <>
      {/* Profile Menu Button */}
      <Button
        onPress={() => setIsVisible(!isVisible)}
        backgroundColor="transparent"
        height="100%"
        hoverStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          transform: 'scale(1.02)',
        }}
        padding="$2"
        pressStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          transform: 'scale(0.98)',
        }}
        size="$2"
        alignItems="center"
        justifyContent="center"
      >
        <IconSymbol
          name="account"
          color="$color"
          size={24}
        />
      </Button>

      {/* Modal with side panel - works on all platforms, same style as role switcher */}
      <Modal
        onRequestClose={() => setIsVisible(false)}
        animationType="fade"
        transparent={true}
        visible={isVisible}
      >
        <View
          onPress={() => setIsVisible(false)}
          alignItems="flex-end"
          backgroundColor="rgba(0, 0, 0, 0.4)"
          bottom={0}
          flex={1}
          justifyContent="flex-start"
          left={0}
          position="absolute"
          right={0}
          top={0}
        >
          <View
            onPress={(e: any) => e.stopPropagation()}
            backgroundColor="$background"
            borderRadius="$5"
            maxHeight={maxPanelHeight}
            maxWidth={380}
            minWidth={280}
            right={HEADER_PADDING}
            shadowColor="$shadowColor"
            shadowOffset={{ width: 2, height: 0 }}
            shadowOpacity={0.25}
            shadowRadius={10}
            top={HEADER_HEIGHT}
            width="auto"
          >
            {renderDropdownContent()}
          </View>
        </View>
      </Modal>
    </>
  );
}
