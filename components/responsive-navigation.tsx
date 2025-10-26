import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, View, XStack } from 'tamagui';

import { ProfileMenu } from '@/components/profile-menu';
import { RoleSwitcher } from '@/components/role-switcher';
import { ThemedText } from '@/components/themed-text';
import { AlertUtils } from '@/components/ui/alert-utils';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { NAVIGATION_CONFIG, ROLE_CONFIG, Role } from '@/constants/NAVIGATION';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ResponsiveNavigationProps {
  children: React.ReactNode;
}

// Breakpoint for showing sidebar vs bottom nav
const SIDEBAR_BREAKPOINT = 768;

export function ResponsiveNavigation({ children }: ResponsiveNavigationProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const router = useRouter();
  const pathname = usePathname();
  const [notificationCount] = useState(3); // Mock notification count
  const [messageCount] = useState(2); // Mock message count
  const [currentRole, setCurrentRole] = useState<Role>(ROLE_CONFIG.roles[0]); // Default to Pilot


  const handleNotificationPress = () => {
    AlertUtils.showNotification(notificationCount, 'notification');
  };

  const handleMessagePress = () => {
    AlertUtils.showNotification(messageCount, 'message');
  };

  const handleTabPress = (href: string) => {
    router.push(href as any);
  };

  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    // Here you could add logic to update permissions, load role-specific data, etc.
  };

  // Get current tab index based on pathname
  const getCurrentTabIndex = () => {
    const tabItems = NAVIGATION_CONFIG.tabBar.items.filter(item => item.visible);
    const currentIndex = tabItems.findIndex(item => {
      // Handle root path
      if (item.href === '/(tabs)/' && pathname === '/') return true;
      // Handle other tab paths
      if (item.href && pathname.includes(item.href.replace('/(tabs)/', ''))) return true;
      return item.href === pathname;
    });
    return currentIndex >= 0 ? currentIndex : 0;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />

      {/* Header */}
      <View
        backgroundColor="$background"
        borderBottomWidth="$0.5"
        borderBottomColor="$borderColor"
        position="relative"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.1}
        shadowRadius={2}
      >
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="$4"
          paddingVertical="$3"
          minHeight={56}
        >
          <XStack width={140} alignItems="center" justifyContent="flex-start" gap="$2">
            <RoleSwitcher
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
            />
            <Button
              size="$2"
              backgroundColor="transparent"
              padding="$2"
              onPress={AlertUtils.showAviationUpdates}
            >
              <IconSymbol
                name="newspaper"
                size={20}
                color="$color"
              />
            </Button>
          </XStack>

          <View width={70} alignItems="flex-end" justifyContent="center">
            <XStack alignItems="center" gap="$2">
              {/* Messages Icon */}
              <NotificationBadge
                count={messageCount}
                icon="message-text"
                onPress={handleMessagePress}
              />

              {/* Notification Bell Icon */}
              <NotificationBadge
                count={notificationCount}
                icon="bell"
                onPress={handleNotificationPress}
              />

              {/* Profile Menu */}
              <ProfileMenu />
            </XStack>
          </View>
        </XStack>

        {/* Absolutely positioned title for perfect centering */}
        <View
          position="absolute"
          left={0}
          right={0}
          top={0}
          bottom={0}
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={156}
        >
          <ThemedText type="title" textAlign="center">
            GA-X
          </ThemedText>
        </View>
      </View>

      {/* Main Content */}
      <View flex={1} paddingBottom={0}>
        {children}
      </View>

      {/* Bottom Tab Bar */}
      <View
        backgroundColor="$background"
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        paddingHorizontal="$4"
        paddingVertical="$2"
        borderTopWidth="$0.5"
        borderTopColor="$borderColor"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: -1 }}
        shadowOpacity={0.1}
        shadowRadius={2}
      >
        {NAVIGATION_CONFIG.tabBar.items
          .filter(item => item.visible)
          .map((item, index) => {
            const isActive = getCurrentTabIndex() === index;
            return (
              <Button
                key={item.id}
                flex={1}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                paddingVertical="$2"
                minHeight={64}
                gap="$1"
                backgroundColor="transparent"
                onPress={() => handleTabPress(item.href)}
              >
                <IconSymbol
                  name={item.icon as any}
                  size={24}
                  color={isActive ? "$tint" : "$tabIconDefault"}
                />
                <ThemedText
                  fontSize="$2"
                  textAlign="center"
                  color={isActive ? "$tint" : "$tabIconDefault"}
                >
                  {item.name}
                </ThemedText>
              </Button>
            );
          })}
      </View>
    </SafeAreaView>
  );
}

