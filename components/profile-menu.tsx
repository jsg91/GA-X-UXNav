import { AlertUtils } from '@/components/ui/alert-utils';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { HEADER_HEIGHT, HEADER_PADDING, ICON_SIZES, MODAL_PANEL_DIMENSIONS } from '@/constants/layout';
import { NAVIGATION_CONFIG } from '@/navigation';
import { MODAL_PANEL_SHADOW } from '@/constants/shadow-styles';
import { TRANSFORM_SCALES } from '@/constants/transform-scales';
import { useThemeContext } from '@/hooks/use-theme-context';
import { stopPropagation } from '@/utils/event-handlers';
import { getDestructiveColor, INTERACTIVE_COLORS } from '@/utils/interactive-colors';
import { getMenuItemHoverStyle, getMenuItemPressStyle, MENU_ITEM_BUTTON_STYLES } from '@/utils/menu-item-styles';
import { isTabActive } from '@/utils/navigation';
import { filterVisibleItems } from '@/utils/navigation-items';
import { calculateMaxPanelHeight } from '@/utils/panel-calculations';
import { navigateTo } from '@/utils/router';
import { createCloseHandler, createToggleHandler } from '@/utils/state-helpers';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, useWindowDimensions } from 'react-native';
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
  const maxPanelHeight = calculateMaxPanelHeight(windowHeight);

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
      navigateTo(item.href);
    }
  };

  const isItemActive = (item: typeof NAVIGATION_CONFIG.profileMenu.items[number]) => {
    return isTabActive(item.href, pathname);
  };

  const visibleItems = filterVisibleItems(NAVIGATION_CONFIG.profileMenu.items);

  const renderDropdownContent = () => (
    <>
      <YStack 
        borderBottomColor={resolvedTheme === 'dark' ? '#333333' : '$borderColor'} 
        borderBottomWidth="$0.5"
        padding="$4"
        paddingBottom="$3"
      >
        <XStack justifyContent="space-between">
          <ThemedText
            type="title"
            level="primary"
            color={resolvedTheme === 'dark' ? '#FFFFFF' : undefined}
          >
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
              size={ICON_SIZES.medium}
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
          const isLogout = item.id === 'logout';

          return (
            <Button
              key={item.id}
              onPress={() => handleMenuItemPress(item)}
              {...MENU_ITEM_BUTTON_STYLES}
              hoverStyle={getMenuItemHoverStyle(true)}
              pressStyle={getMenuItemPressStyle(true)}
            >
              <XStack alignItems="left" gap="$3" justifyContent="flex-start" width="100%">
                <IconSymbol
                  name={item.icon as any}
                  color={isLogout
                    ? getDestructiveColor(resolvedTheme === 'dark')
                    : (isActive ? '$tint' : (resolvedTheme === 'dark' ? '#FFFFFF' : '$color'))
                  }
                  size={ICON_SIZES.small}
                />
                <ThemedText
                  color={isLogout
                    ? getDestructiveColor(resolvedTheme === 'dark')
                    : (resolvedTheme === 'dark' ? '#FFFFFF' : (isActive ? '$color' : '$color'))
                  }
                  flex={1}
                  fontSize="$4"
                  fontWeight={isActive ? '$6' : '$4'}
                  textAlign="left"
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
        onPress={createToggleHandler(setIsVisible)}
        alignItems="center"
        backgroundColor="transparent"
        height="100%"
        hoverStyle={{
          backgroundColor: INTERACTIVE_COLORS.hover,
          transform: `scale(${TRANSFORM_SCALES.hover})`,
        }}
        justifyContent="center"
        padding="$2"
        pressStyle={{
          backgroundColor: INTERACTIVE_COLORS.press,
          transform: `scale(${TRANSFORM_SCALES.press})`,
        }}
        size="$2"
      >
        <IconSymbol
          name="account"
          color={resolvedTheme === 'dark' ? '#FFFFFF' : '$color'}
          size={ICON_SIZES.xlarge}
        />
      </Button>

      {/* Modal with side panel - works on all platforms, same style as role switcher */}
      <Modal
        onRequestClose={createCloseHandler(setIsVisible)}
        animationType="fade"
        transparent={true}
        visible={isVisible}
      >
        <View
          onPress={createCloseHandler(setIsVisible)}
          alignItems="flex-end"
          backgroundColor={INTERACTIVE_COLORS.modalOverlay}
          bottom={0}
          flex={1}
          justifyContent="flex-start"
          left={0}
          position="absolute"
          right={0}
          top={0}
        >
          <View
            onPress={stopPropagation}
            backgroundColor="$backgroundSecondary"
            borderColor={resolvedTheme === 'dark' ? '#333333' : undefined}
            borderWidth={resolvedTheme === 'dark' ? '$0.5' : 0}
            borderRadius="$5"
            maxHeight={maxPanelHeight}
            maxWidth={MODAL_PANEL_DIMENSIONS.maxWidth}
            minWidth={MODAL_PANEL_DIMENSIONS.minWidth}
            right={HEADER_PADDING}
            {...MODAL_PANEL_SHADOW}
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
