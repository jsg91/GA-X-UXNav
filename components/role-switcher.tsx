import { AlertUtils } from '@/components/ui/alert-utils';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ROLE_CONFIG, Role } from '@/constants/NAVIGATION';
import React, { useMemo } from 'react';
import {
  Adapt,
  Select,
  Sheet,
  XStack,
  YStack
} from 'tamagui';

interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

// Custom chevron components using IconSymbol
const ChevronDown = () => (
  <IconSymbol name="chevron-down" size={16} color="$tint" />
);

const ChevronUp = () => (
  <IconSymbol name="chevron-up" size={16} color="$color" />
);

const CheckIcon = () => (
  <IconSymbol name="check" size={16} color="$color" />
);

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const visibleRoles = useMemo(
    () => ROLE_CONFIG.roles.filter(role => role.visible),
    []
  );

  const handleValueChange = (roleId: string) => {
    const selectedRole = visibleRoles.find(role => role.id === roleId);
    
    if (!selectedRole) return;

    // Check if role requires permission (safely check with optional chaining)
    if ('permissionRequired' in selectedRole && selectedRole.permissionRequired === true) {
      AlertUtils.showPermissionRequired(selectedRole.name);
      return;
    }

    onRoleChange(selectedRole);
  };

  return (
    <YStack position="relative">
      <Select
        value={currentRole.id}
        onValueChange={handleValueChange}
        disablePreventBodyScroll
      >
        <Select.Trigger
        size="$2"
        backgroundColor="rgba(0, 123, 255, 0.1)"
        borderWidth="$0.5"
        borderColor="rgba(0, 123, 255, 0.3)"
        borderRadius="$3"
        paddingHorizontal="$3"
        paddingVertical="$2.5"
        iconAfter={ChevronDown}
        hoverStyle={{
          backgroundColor: 'rgba(0, 123, 255, 0.15)',
          borderColor: 'rgba(0, 123, 255, 0.5)',
        }}
        pressStyle={{
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
        }}
      >
        <XStack alignItems="center" gap="$1.5">
          <IconSymbol
            name={currentRole.icon as any}
            size={20}
            color="$tint"
          />
        </XStack>
      </Select.Trigger>

      <Adapt when="sm">
        <Sheet
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame padding="$0">
            <Select.Viewport
              maxHeight={300}
              backgroundColor="$background"
              borderRadius="$4"
              borderWidth="$1"
              borderColor="$borderColor"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.15}
              shadowRadius={8}
            >
              <Select.Group>
                <Select.Label
                  padding="$3"
                  paddingBottom="$2"
                  fontSize="$4"
                  fontFamily="$sans"
                  fontWeight="$6"
                  color="$color"
                  borderBottomWidth="$0.5"
                  borderBottomColor="$borderColor"
                  backgroundColor="rgba(0, 0, 0, 0.02)"
                >
                  Switch Role
                </Select.Label>
                {visibleRoles.map((role, index) => (
                  <Select.Item
                    key={role.id}
                    index={index}
                    value={role.id}
                    padding="$3"
                    paddingVertical="$3.5"
                    borderBottomWidth={index === visibleRoles.length - 1 ? 0 : '$0.5'}
                    borderBottomColor="rgba(0, 0, 0, 0.05)"
                    hoverStyle={{
                      backgroundColor: 'rgba(0, 123, 255, 0.08)',
                    }}
                    pressStyle={{
                      backgroundColor: 'rgba(0, 123, 255, 0.12)',
                    }}
                  >
                    <XStack alignItems="center" gap="$3" flex={1}>
                      <IconSymbol
                        name={role.icon as any}
                        size={20}
                        color={currentRole.id === role.id ? '$tint' : '$color'}
                      />
                      <Select.ItemText
                        flex={1}
                        fontSize="$3.5"
                        fontFamily="$sans"
                        color={currentRole.id === role.id ? '$tint' : '$color'}
                        fontWeight={currentRole.id === role.id ? '$5' : '$4'}
                      >
                        {role.label}
                      </Select.ItemText>
                      {'permissionRequired' in role && role.permissionRequired === true && (
                        <IconSymbol
                          name="lock"
                          size={16}
                          color="$tabIconDefault"
                        />
                      )}
                    </XStack>
                    <Select.ItemIndicator marginLeft="auto">
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Viewport>
          </Sheet.Frame>
          <Sheet.Overlay
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Adapt when="gtSm">
        <Sheet
          modal={false}
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame padding="$0" position="absolute" top="100%" left={0} right={0} marginTop="$1">
            <Select.Viewport
              maxHeight={300}
              backgroundColor="$background"
              borderRadius="$4"
              borderWidth="$1"
              borderColor="$borderColor"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.15}
              shadowRadius={8}
            >
              <Select.Group>
                <Select.Label
                  padding="$3"
                  paddingBottom="$2"
                  fontSize="$4"
                  fontFamily="$sans"
                  fontWeight="$6"
                  color="$color"
                  borderBottomWidth="$0.5"
                  borderBottomColor="$borderColor"
                  backgroundColor="rgba(0, 0, 0, 0.02)"
                >
                  Switch Role
                </Select.Label>
                {visibleRoles.map((role, index) => (
                  <Select.Item
                    key={role.id}
                    index={index}
                    value={role.id}
                    padding="$3"
                    paddingVertical="$3.5"
                    borderBottomWidth={index === visibleRoles.length - 1 ? 0 : '$0.5'}
                    borderBottomColor="rgba(0, 0, 0, 0.05)"
                    hoverStyle={{
                      backgroundColor: 'rgba(0, 123, 255, 0.08)',
                    }}
                    pressStyle={{
                      backgroundColor: 'rgba(0, 123, 255, 0.12)',
                    }}
                  >
                    <XStack alignItems="center" gap="$3" flex={1}>
                      <IconSymbol
                        name={role.icon as any}
                        size={20}
                        color={currentRole.id === role.id ? '$tint' : '$color'}
                      />
                      <Select.ItemText
                        flex={1}
                        fontSize="$3.5"
                        fontFamily="$sans"
                        color={currentRole.id === role.id ? '$tint' : '$color'}
                        fontWeight={currentRole.id === role.id ? '$5' : '$4'}
                      >
                        {role.label}
                      </Select.ItemText>
                      {'permissionRequired' in role && role.permissionRequired === true && (
                        <IconSymbol
                          name="lock"
                          size={16}
                          color="$tabIconDefault"
                        />
                      )}
                    </XStack>
                    <Select.ItemIndicator marginLeft="auto">
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Viewport>
          </Sheet.Frame>
          <Sheet.Overlay
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>


    </Select>
    </YStack>
  );
}

