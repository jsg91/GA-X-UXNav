import React, { useState } from 'react';
import { Modal } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AlertUtils } from '@/components/ui/alert-utils';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ROLE_CONFIG, Role } from '@/constants/NAVIGATION';
import {
  Button,
  XStack,
  YStack
} from 'tamagui';

interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleRolePress = (role: Role) => {
    // Check if role requires permission
    if ((role as any).permissionRequired === true) {
      AlertUtils.showPermissionRequired(role.name);
      return;
    }

    onRoleChange(role);
    setIsVisible(false);
  };

  const visibleRoles = ROLE_CONFIG.roles.filter(role => role.visible);

  return (
    <>
      {/* Role Switcher Button */}
      <Button
        size="$2"
        backgroundColor="rgba(0, 123, 255, 0.1)"
        borderWidth="$0.5"
        borderColor="rgba(0, 123, 255, 0.3)"
        borderRadius="$2"
        padding="$2"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.2}
        shadowRadius={2}
        onPress={() => setIsVisible(true)}
      >
        <XStack alignItems="center" gap="$1.5">
          <IconSymbol
            name={currentRole.icon as any}
            size={22}
            color="$tint"
          />
          <IconSymbol
            name="chevron-down"
            size={16}
            color="$tint"
          />
        </XStack>
      </Button>

      {/* Role Switcher Modal */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Button
          flex={1}
          backgroundColor="rgba(0, 0, 0, 0.4)"
          justifyContent="flex-start"
          alignItems="flex-start"
          paddingTop="$12"
          paddingLeft="$4"
          onPress={() => setIsVisible(false)}
        >
          <ThemedView
            width={280}
            maxHeight={400}
            borderBottomLeftRadius="$3"
            borderBottomRightRadius="$3"
            backgroundColor="$background"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.25}
            shadowRadius={10}
          >
            <YStack paddingHorizontal="$4" paddingVertical="$3" borderBottomWidth="$0.5" borderBottomColor="$borderColor">
              <XStack justifyContent="space-between" alignItems="center">
                <ThemedText type="subtitle">
                  Switch Role
                </ThemedText>
                <Button
                  size="$2"
                  backgroundColor="transparent"
                  padding="$1"
                  onPress={() => setIsVisible(false)}
                >
                  <IconSymbol
                    name="close"
                    size={20}
                    color="$color"
                  />
                </Button>
              </XStack>
            </YStack>

            <YStack paddingHorizontal="$4" paddingVertical="$2">
              {visibleRoles.map((role) => (
                <Button
                  key={role.id}
                  paddingVertical="$3.5"
                  paddingHorizontal={currentRole.id === role.id ? "$3" : "$1"}
                  backgroundColor={currentRole.id === role.id ? "rgba(0, 123, 255, 0.1)" : "transparent"}
                  borderRadius={currentRole.id === role.id ? "$2" : 0}
                  marginHorizontal={currentRole.id === role.id ? -12 : 0}
                  borderBottomWidth="$0.5"
                  borderBottomColor="rgba(0, 0, 0, 0.05)"
                  onPress={() => handleRolePress(role)}
                  justifyContent="flex-start"
                >
                  <XStack alignItems="center" gap="$2.5">
                    <IconSymbol
                      name={role.icon as any}
                      size={20}
                      color={currentRole.id === role.id ? "$tint" : "$color"}
                    />
                    <ThemedText
                      flex={1}
                      color={currentRole.id === role.id ? "$tint" : "$color"}
                    >
                      {role.label}
                    </ThemedText>
                    {(role as any).permissionRequired === true && (
                      <IconSymbol
                        name="lock"
                        size={16}
                        color="$tabIconDefault"
                      />
                    )}
                  </XStack>
                </Button>
              ))}
            </YStack>
          </ThemedView>
        </Button>
      </Modal>
    </>
  );
}

