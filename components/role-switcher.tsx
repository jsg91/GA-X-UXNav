import { ThemedText } from '@/components/themed-text';
import { AlertUtils } from '@/components/ui/alert-utils';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { HEADER_HEIGHT, HEADER_PADDING, SIDEBAR_BREAKPOINT, ICON_SIZES, MENU_ITEM_MIN_HEIGHT, MODAL_PANEL_DIMENSIONS } from '@/constants/layout';
import { MODAL_PANEL_SHADOW } from '@/constants/shadow-styles';
import { OPACITY } from '@/constants/opacity';
import { Z_INDEX } from '@/constants/z-index';
import { ROLE_CONFIG, Role } from '@/constants/NAVIGATION';
import { calculateMaxPanelHeight } from '@/utils/panel-calculations';
import { stopPropagation } from '@/utils/event-handlers';
import { createCloseHandler, createToggleHandler } from '@/utils/state-helpers';
import { filterVisibleItems } from '@/utils/navigation-items';
import { getActiveColor, getActiveFontWeight, getActiveOpacity } from '@/utils/active-state';
import { getMenuItemHoverStyle, getMenuItemPressStyle, MENU_ITEM_WITH_HEIGHT_STYLES } from '@/utils/menu-item-styles';
import { INTERACTIVE_COLORS, getTintBackground, getTintBackgroundHover, getTintBackgroundPress, getTintBorder, getTintBorderHover } from '@/utils/interactive-colors';
import { isWeb } from '@/utils/platform';
import { useThemeContext } from '@/hooks/use-theme-context';
import React, { useMemo, useState } from 'react';
import { Modal, useWindowDimensions } from 'react-native';
import {
  Button,
  ScrollView,
  View,
  XStack,
  YStack
} from 'tamagui';

interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useThemeContext();
  const isDark = resolvedTheme === 'dark';
  const { height: windowHeight, width } = useWindowDimensions();
  
  const isSmallScreen = width < SIDEBAR_BREAKPOINT;
  const maxPanelHeight = calculateMaxPanelHeight(windowHeight);

  const groupedRoles = useMemo(() => {
    return ROLE_CONFIG.groups.map(group => ({
      ...group,
      roles: filterVisibleItems(group.roles as readonly Role[]),
    })).filter(group => group.roles.length > 0);
  }, []);

  const handleRoleSelect = (role: Role) => {
    // Check if role requires permission
    if ('permissionRequired' in role && role.permissionRequired === true) {
      AlertUtils.showPermissionRequired(role.name);
      setIsOpen(false);
      return;
    }

    onRoleChange(role);
    setIsOpen(false);
  };

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
            User Context
          </ThemedText>
          <Button
            onPress={() => setIsOpen(false)}
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
        {groupedRoles.map((group, groupIndex) => (
          <YStack key={group.name}>
            {/* Group Header - Tree Parent Node */}
            <YStack
              backgroundColor={INTERACTIVE_COLORS.groupHeaderBackground}
              borderTopColor={INTERACTIVE_COLORS.groupHeaderBorder}
              borderTopWidth={groupIndex > 0 ? "$0.5" : 0}
              justifyContent="center"
              minHeight={MENU_ITEM_MIN_HEIGHT}
              paddingHorizontal="$4"
              paddingVertical={15}
            >
              <XStack alignItems="center" gap="$2.5">
                <IconSymbol
                  style={{ opacity: OPACITY.veryLight }}
                  name="chevron-down"
                  color="$color"
                  size={ICON_SIZES.medium}
                />
                <IconSymbol
                  name={group.icon as any}
                  color="$color"
                  size={ICON_SIZES.large}
                />
                <ThemedText style={{ opacity: OPACITY.subtle }} color="$color" fontSize="$5" fontWeight="$7" marginLeft="$1">
                  {group.name}
                </ThemedText>
              </XStack>
            </YStack>

            {/* Group Roles - Tree Child Nodes */}
            {group.roles.map((role) => {
              const isSelected = currentRole.id === role.id;
              return (
                <Button
                  key={role.id}
                  onPress={() => handleRoleSelect(role)}
                  {...MENU_ITEM_WITH_HEIGHT_STYLES}
                  hoverStyle={getMenuItemHoverStyle(true)}
                  pressStyle={getMenuItemPressStyle(true)}
                >
                  <XStack alignItems="center" gap="$3" justifyContent="flex-start" width="100%">
                    {/* Spacer to align role icons with group icons: chevron (16px) + gap ($2.5 = 10px) = 26px */}
                    <XStack width={10} />
                    <IconSymbol
                      style={{ opacity: getActiveOpacity(isSelected) }}
                      name={role.icon as any}
                      color={getActiveColor(isSelected)}
                      size={ICON_SIZES.large}
                    />
                    <ThemedText
                      color={getActiveColor(isSelected)}
                      flex={1}
                      fontSize="$5"
                      fontWeight={getActiveFontWeight(isSelected) as any}
                      textAlign="left"
                    >
                      {role.label}
                    </ThemedText>
                    {'permissionRequired' in role && role.permissionRequired === true && (
                      <IconSymbol
                        style={{ opacity: OPACITY.light }}
                        name="lock"
                        color="$tabIconDefault"
                        size={ICON_SIZES.small}
                      />
                    )}
                    {isSelected && (
                      <IconSymbol
                        name="check"
                        color="$tint"
                        size={ICON_SIZES.medium}
                      />
                    )}
                </XStack>
              </Button>
              );
            })}
          </YStack>
        ))}
      </ScrollView>
    </>
  );

  return (
    <>
      <YStack height="100%" position="relative" zIndex={Z_INDEX.sidebar}>
        <Button
          onPress={createToggleHandler(setIsOpen)}
          backgroundColor={getTintBackground(isDark)}
          borderColor={getTintBorder(isDark)}
          borderRadius="$3"
          borderWidth="$0.5"
          height="100%"
          hoverStyle={isWeb ? {
            backgroundColor: getTintBackgroundHover(isDark),
            borderColor: getTintBorderHover(isDark),
          } : undefined}
          paddingHorizontal={isSmallScreen ? "$2" : "$3"}
          paddingVertical="$1.5"
          pressStyle={{
            backgroundColor: getTintBackgroundPress(isDark),
          }}
        >
          <XStack alignItems="center" gap="$1.5">
            <IconSymbol
              name={currentRole.icon as any}
              color="$tint"
              size={ICON_SIZES.medium}
            />
            {!isSmallScreen && (
              <ThemedText color="$tint" fontSize="$3" marginLeft="$2">
                {currentRole.label}
              </ThemedText>
            )}
            <IconSymbol
              name={isOpen ? "chevron-up" : "chevron-down"}
              color="$tint"
              size={16}
            />
          </XStack>
        </Button>
      </YStack>

      {/* Modal with side panel - works on all platforms */}
      <Modal
        onRequestClose={createCloseHandler(setIsOpen)}
        animationType="fade"
        transparent={true}
        visible={isOpen}
      >
        <View
          onPress={createCloseHandler(setIsOpen)}
          alignItems="flex-start"
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
            borderRadius="$5"
            left={HEADER_PADDING}
            maxHeight={maxPanelHeight}
            maxWidth={MODAL_PANEL_DIMENSIONS.maxWidth}
            minWidth={MODAL_PANEL_DIMENSIONS.minWidth}
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

