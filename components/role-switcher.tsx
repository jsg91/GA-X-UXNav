import { ThemedText } from '@/components/themed-text';
import { AlertUtils } from '@/components/ui/alert-utils';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ROLE_CONFIG, Role } from '@/constants/NAVIGATION';
import React, { useMemo, useState } from 'react';
import { Modal, Platform, useWindowDimensions } from 'react-native';
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
  const { height: windowHeight, width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  
  // Same breakpoint as in responsive-navigation.tsx
  const SIDEBAR_BREAKPOINT = 768;
  const isSmallScreen = width < SIDEBAR_BREAKPOINT;
  
  // Header height - matches the header minHeight in responsive-navigation
  const HEADER_HEIGHT = 56;
  // Header padding ($3) - matches paddingHorizontal in responsive-navigation header
  const HEADER_PADDING = 12; // $3 = 12px
  const maxPanelHeight = windowHeight > 0 ? windowHeight - HEADER_HEIGHT - 20 : 600;

  const groupedRoles = useMemo(() => {
    return ROLE_CONFIG.groups.map(group => ({
      ...group,
      roles: group.roles.filter(role => role.visible)
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
              size={20}
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
              backgroundColor="rgba(0, 0, 0, 0.02)"
              borderTopColor="rgba(0, 0, 0, 0.08)"
              borderTopWidth={groupIndex > 0 ? "$0.5" : 0}
              paddingHorizontal="$4"
              paddingVertical={15}
              minHeight={45}
              justifyContent="center"
            >
              <XStack alignItems="center" gap="$2.5">
                <IconSymbol
                  style={{ opacity: 0.5 }}
                  name="chevron-down"
                  color="$color"
                  size={20}
                />
                <IconSymbol
                  name={group.icon as any}
                  color="$color"
                  size={22}
                />
                <ThemedText style={{ opacity: 0.8 }} color="$color" fontSize="$5" fontWeight="$7" marginLeft="$1">
                  {group.name}
                </ThemedText>
              </XStack>
            </YStack>

            {/* Group Roles - Tree Child Nodes */}
            {group.roles.map((role) => (
              <Button
                key={role.id}
                onPress={() => handleRoleSelect(role)}
                backgroundColor="transparent"
                borderBottomWidth={0}
                borderRadius={0}
                hoverStyle={isWeb ? {
                  backgroundColor: 'rgba(0, 122, 255, 0.08)',
                } : undefined}
                paddingHorizontal="$4"
                paddingVertical={15}
                minHeight={45}
                pressStyle={{
                  backgroundColor: 'rgba(0, 122, 255, 0.12)',
                }}
              >
                <XStack alignItems="center" gap="$3" justifyContent="flex-start" width="100%">
                  {/* Spacer to align role icons with group icons: chevron (16px) + gap ($2.5 = 10px) = 26px */}
                  <XStack width={10} />
                  <IconSymbol
                    style={{ opacity: currentRole.id === role.id ? 1 : 0.7 }}
                    name={role.icon as any}
                    color={currentRole.id === role.id ? '$tint' : '$color'}
                    size={22}
                  />
                  <ThemedText
                    color={currentRole.id === role.id ? '$tint' : '$color'}
                    flex={1}
                    textAlign="left"
                    fontSize="$5"
                    fontWeight={currentRole.id === role.id ? '$6' : '$4'}
                  >
                    {role.label}
                  </ThemedText>
                  {'permissionRequired' in role && role.permissionRequired === true && (
                    <IconSymbol
                      style={{ opacity: 0.6 }}
                      name="lock"
                      color="$tabIconDefault"
                      size={18}
                    />
                  )}
                  {currentRole.id === role.id && (
                    <IconSymbol
                      name="check"
                      color="$tint"
                      size={20}
                    />
                  )}
                </XStack>
              </Button>
            ))}
          </YStack>
        ))}
      </ScrollView>
    </>
  );

  return (
    <>
      <YStack height="100%" position="relative" zIndex={1000}>
        <Button
          onPress={() => setIsOpen(!isOpen)}
          backgroundColor="rgba(0, 122, 255, 0.1)"
          borderColor="rgba(0, 122, 255, 0.3)"
          borderRadius="$3"
          borderWidth="$0.5"
          height="100%"
          hoverStyle={isWeb ? {
            backgroundColor: 'rgba(0, 122, 255, 0.15)',
            borderColor: 'rgba(0, 122, 255, 0.5)',
          } : undefined}
          paddingHorizontal={isSmallScreen ? "$2" : "$3"}
          paddingVertical="$1.5"
          pressStyle={{
            backgroundColor: 'rgba(0, 122, 255, 0.2)',
          }}
        >
          <XStack alignItems="center" gap="$1.5">
            <IconSymbol
              name={currentRole.icon as any}
              color="$tint"
              size={20}
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
        onRequestClose={() => setIsOpen(false)}
        animationType="fade"
        transparent={true}
        visible={isOpen}
      >
        <View
          onPress={() => setIsOpen(false)}
          alignItems="flex-start"
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
            left={HEADER_PADDING}
            maxHeight={maxPanelHeight}
            maxWidth={380}
            minWidth={280}
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

