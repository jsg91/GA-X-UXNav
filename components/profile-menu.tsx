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
        size="$2"
        backgroundColor="transparent"
        padding="$2"
        marginRight="$2"
        height="100%"
        onPress={() => setIsVisible(true)}
        hoverStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          transform: 'scale(1.02)',
        }}
        pressStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          transform: 'scale(0.98)',
        }}
      >
        <IconSymbol
          name="account"
          size={24}
          color="$color"
        />
      </Button>

      {/* Profile Menu Modal */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(0, 0, 0, 0.4)"
          justifyContent="flex-start"
          alignItems="flex-end"
          paddingTop="$12"
          paddingRight={0}
          onPress={() => setIsVisible(false)}
        >
          <View
            onPress={(e: any) => e.stopPropagation()}
            width="70%"
            maxWidth={300}
            height="100%"
            borderTopLeftRadius="$5"
            borderBottomLeftRadius="$5"
            backgroundColor="$background"
            shadowColor="$shadowColor"
            shadowOffset={{ width: -2, height: 0 }}
            shadowOpacity={0.25}
            shadowRadius={10}
            marginLeft="auto"
          >
            <YStack paddingHorizontal="$5" paddingTop="$5" paddingBottom="$5" borderBottomWidth="$0.5" borderBottomColor="$borderColor">
              <XStack justifyContent="space-between" alignItems="center">
                <TamaguiText fontSize="$8" fontWeight="$5" color="$color">
                  Profile Menu
                </TamaguiText>
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

            <ScrollView flex={1} paddingHorizontal="$5" showsVerticalScrollIndicator={false}>
              {NAVIGATION_CONFIG.profileMenu.items
                .filter(item => item.visible)
                .map((item) => (
                  <Button
                    key={item.id}
                    paddingVertical="$3"
                    paddingHorizontal={0}
                    backgroundColor="transparent"
                    borderBottomWidth="$0.5"
                    borderBottomColor="rgba(0, 0, 0, 0.05)"
                    disabled={!item.href && item.id !== 'logout'}
                    onPress={() => {
                      if (item.href || item.id === 'logout') {
                        handleMenuItemPress(item as any);
                      }
                    }}
                    justifyContent="flex-start"
                  >
                    {item.href ? (
                      <Link href={item.href} style={{ width: '100%' }}>
                        <XStack alignItems="center" gap="$3" width="100%">
                          <IconSymbol
                            name={item.icon as any}
                            size={20}
                            color="$color"
                          />
                          <TamaguiText flex={1} color="$color" fontSize="$3.5" fontWeight="$4">
                            {item.name}
                          </TamaguiText>
                        </XStack>
                      </Link>
                    ) : (
                      <XStack alignItems="center" gap="$3" width="100%">
                        <IconSymbol
                          name={item.icon as any}
                          size={20}
                          color={item.id === 'logout' ? (resolvedTheme === 'dark' ? '#FF453A' : '#FF3B30') : '$color'}
                        />
                        <TamaguiText
                          flex={1}
                          color={item.id === 'logout' ? (resolvedTheme === 'dark' ? '#FF453A' : '#FF3B30') : '$color'}
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
