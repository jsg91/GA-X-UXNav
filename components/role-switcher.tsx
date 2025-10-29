import { ThemedText } from '@/components/themed-text';
import { AlertUtils } from '@/components/ui/alert-utils';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ROLE_CONFIG, Role } from '@/constants/NAVIGATION';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const groupedRoles = useMemo(() => {
    return ROLE_CONFIG.groups.map(group => ({
      ...group,
      roles: group.roles.filter(role => role.visible)
    })).filter(group => group.roles.length > 0);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleRoleSelect = (role: Role) => {
    console.log('RoleSwitcher: handleRoleSelect called with role:', role);

    // Check if role requires permission
    if ('permissionRequired' in role && role.permissionRequired === true) {
      console.log('RoleSwitcher: role requires permission');
      AlertUtils.showPermissionRequired(role.name);
      setIsOpen(false);
      return;
    }

    console.log('RoleSwitcher: changing role to:', role);
    onRoleChange(role);
    setIsOpen(false);
  };

  return (
    <YStack position="relative" zIndex={1000} ref={dropdownRef}>
      <Button
        size="$2"
        backgroundColor="rgba(0, 122, 255, 0.1)"
        borderWidth="$0.5"
        borderColor="rgba(0, 122, 255, 0.3)"
        borderRadius="$3"
        paddingHorizontal="$3"
        paddingVertical="$2.5"
        hoverStyle={{
          backgroundColor: 'rgba(0, 122, 255, 0.15)',
          borderColor: 'rgba(0, 122, 255, 0.5)',
        }}
        pressStyle={{
          backgroundColor: 'rgba(0, 122, 255, 0.2)',
        }}
        onPress={() => {
          console.log('RoleSwitcher: trigger pressed, toggling dropdown');
          setIsOpen(!isOpen);
        }}
      >
        <XStack alignItems="center" gap="$1.5">
          <IconSymbol
            name={currentRole.icon as any}
            size={20}
            color="$tint"
          />
          <ThemedText fontSize="$3" color="$tint">
            {currentRole.label}
          </ThemedText>
          <IconSymbol
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color="$tint"
          />
        </XStack>
      </Button>

      {isOpen && (
        <YStack
          position="absolute"
          top="100%"
          left={0}
          marginTop="$2"
          minWidth={360}
          maxWidth={420}
          backgroundColor="$background"
          borderRadius="$4"
          borderWidth="$1"
          borderColor="$borderColor"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.15}
          shadowRadius={8}
          zIndex={1001}
          maxHeight="calc(100vh - 120px)"
        >
          <YStack 
            padding="$4" 
            paddingBottom="$3"
            borderBottomWidth="$0.5"
            borderBottomColor="$borderColor"
          >
            <ThemedText fontSize="$5" fontWeight="$6" color="$color">
              Switch Role
            </ThemedText>
          </YStack>

          {groupedRoles.map((group, groupIndex) => (
            <YStack key={group.name}>
              {/* Group Header - Tree Parent Node */}
              <YStack
                paddingVertical="$2.5"
                paddingHorizontal="$4"
                backgroundColor="rgba(0, 0, 0, 0.02)"
                borderTopWidth={groupIndex > 0 ? "$0.5" : 0}
                borderTopColor="rgba(0, 0, 0, 0.08)"
              >
                <XStack alignItems="center" gap="$2.5">
                  <IconSymbol
                    name="chevron-down"
                    size={16}
                    color="$color"
                    style={{ opacity: 0.5 }}
                  />
                  <IconSymbol
                    name={group.icon as any}
                    size={18}
                    color="$color"
                  />
                  <ThemedText fontSize="$4" fontWeight="$7" color="$color" style={{ opacity: 0.8 }}>
                    {group.name}
                  </ThemedText>
                </XStack>
              </YStack>

              {/* Group Roles - Tree Child Nodes */}
              {group.roles.map((role, roleIndex) => {
                const isLastInGroup = roleIndex === group.roles.length - 1;

                return (
                  <Button
                    key={role.id}
                    backgroundColor="transparent"
                    padding="$3"
                    paddingVertical="$3"
                    paddingLeft="$6"
                    borderBottomWidth={0}
                    borderRadius={0}
                    hoverStyle={{
                      backgroundColor: 'rgba(0, 122, 255, 0.08)',
                    }}
                    pressStyle={{
                      backgroundColor: 'rgba(0, 122, 255, 0.12)',
                    }}
                    onPress={() => handleRoleSelect(role)}
                  >
                    <XStack alignItems="center" gap="$3" flex={1}>
                      <IconSymbol
                        name={role.icon as any}
                        size={18}
                        color={currentRole.id === role.id ? '$tint' : '$color'}
                        style={{ opacity: currentRole.id === role.id ? 1 : 0.7 }}
                      />
                      <ThemedText
                        flex={1}
                        fontSize="$4"
                        color={currentRole.id === role.id ? '$tint' : '$color'}
                        fontWeight={currentRole.id === role.id ? '$6' : '$4'}
                      >
                        {role.label}
                      </ThemedText>
                      {'permissionRequired' in role && role.permissionRequired === true && (
                        <IconSymbol
                          name="lock"
                          size={14}
                          color="$tabIconDefault"
                          style={{ opacity: 0.6 }}
                        />
                      )}
                      {currentRole.id === role.id && (
                        <IconSymbol
                          name="check"
                          size={16}
                          color="$tint"
                        />
                      )}
                    </XStack>
                  </Button>
                );
              })}
            </YStack>
          ))}
        </YStack>
      )}
    </YStack>
  );
}

