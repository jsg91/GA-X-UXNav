import { AlertUtils } from '@/components/ui/alert-utils';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NAVIGATION_CONFIG } from '@/constants/NAVIGATION';
import { useThemeContext } from '@/hooks/use-theme-context';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal
} from 'react-native';
import {
  Button,
  ScrollView,
  Text as TamaguiText,
  View,
  XStack,
  YStack
} from 'tamagui';

export function ProfileMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const { resolvedTheme } = useThemeContext();

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

    // For other items, navigation will be handled by Link component
  };

  return (
    <>
      {/* Profile Menu Button */}
      <Button
        onPress={() => setIsVisible(true)}
        backgroundColor="transparent"
        height="100%"
        hoverStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          transform: 'scale(1.02)',
        }}
        marginRight="$2"
        padding="$2"
        pressStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          transform: 'scale(0.98)',
        }}
        size="$2"
      >
        <IconSymbol
          name="account"
          color="$color"
          size={24}
        />
      </Button>

      {/* Profile Menu Modal */}
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
          justifyContent="flex-start"
          left={0}
          paddingRight={0}
          paddingTop="$12"
          position="absolute"
          right={0}
          top={0}
        >
          <View
            onPress={(e: any) => e.stopPropagation()}
            backgroundColor="$background"
            borderBottomLeftRadius="$5"
            borderTopLeftRadius="$5"
            height="100%"
            marginLeft="auto"
            maxWidth={300}
            shadowColor="$shadowColor"
            shadowOffset={{ width: -2, height: 0 }}
            shadowOpacity={0.25}
            shadowRadius={10}
            width="70%"
          >
            <YStack borderBottomColor="$borderColor" borderBottomWidth="$0.5" paddingBottom="$5" paddingHorizontal="$5" paddingTop="$5">
              <XStack alignItems="center" justifyContent="space-between">
                <TamaguiText color="$color" fontSize="$8" fontWeight="$5">
                  Profile Menu
                </TamaguiText>
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

            <ScrollView flex={1} paddingHorizontal="$5" showsVerticalScrollIndicator={false}>
              {NAVIGATION_CONFIG.profileMenu.items
                .filter(item => item.visible)
                .map((item) => (
                  <Button
                    key={item.id}
                    onPress={() => {
                      if (item.href || item.id === 'logout') {
                        handleMenuItemPress(item as any);
                      }
                    }}
                    disabled={!item.href && item.id !== 'logout'}
                    backgroundColor="transparent"
                    borderBottomColor="rgba(0, 0, 0, 0.05)"
                    borderBottomWidth="$0.5"
                    justifyContent="flex-start"
                    paddingHorizontal={0}
                    paddingVertical="$3"
                  >
                    {item.href ? (
                      <Link href={item.href} style={{ width: '100%' }}>
                        <XStack alignItems="center" gap="$3" width="100%">
                          <IconSymbol
                            name={item.icon as any}
                            color="$color"
                            size={20}
                          />
                          <TamaguiText color="$color" flex={1} fontSize="$3.5" fontWeight="$4">
                            {item.name}
                          </TamaguiText>
                        </XStack>
                      </Link>
                    ) : (
                      <XStack alignItems="center" gap="$3" width="100%">
                        <IconSymbol
                          name={item.icon as any}
                          color={item.id === 'logout' ? (resolvedTheme === 'dark' ? '#FF453A' : '#FF3B30') : '$color'}
                          size={20}
                        />
                        <TamaguiText
                          color={item.id === 'logout' ? (resolvedTheme === 'dark' ? '#FF453A' : '#FF3B30') : '$color'}
                          flex={1}
                          fontSize="$3.5"
                          fontWeight="$4"
                        >
                          {item.name}
                        </TamaguiText>
                      </XStack>
                    )}
                  </Button>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
