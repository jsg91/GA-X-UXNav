import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, View, XStack, YStack } from 'tamagui';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeContext } from '@/hooks/use-theme-context';

export default function SettingsScreen() {
  const { theme, setTheme, resolvedTheme } = useThemeContext();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: resolvedTheme === 'dark' ? '#000000' : '#FFFFFF' }}>
      <YStack backgroundColor="$background" gap="$4" padding="$4" minHeight="100%">
        {/* Header */}
        <YStack gap="$2">
          <Text color={resolvedTheme === 'dark' ? '#FFFFFF' : '$color'} fontFamily="$body" fontSize="$8" fontWeight="$5">
            Settings
          </Text>
          <Text color={resolvedTheme === 'dark' ? '#CCCCCC' : '$color'} fontFamily="$body" fontSize="$3" opacity={resolvedTheme === 'dark' ? 1 : 0.7}>
            Customize your app experience
          </Text>
        </YStack>

        {/* Appearance Section */}
        <YStack gap="$3">
          <Text color={resolvedTheme === 'dark' ? '#FFFFFF' : '$color'} fontFamily="$body" fontSize="$5" fontWeight="$4">
            Appearance
          </Text>

          {/* Theme Selection */}
          <YStack gap="$2">
            <Text color={resolvedTheme === 'dark' ? '#CCCCCC' : '$color'} fontFamily="$body" fontSize="$3" opacity={resolvedTheme === 'dark' ? 1 : 0.8}>
              Theme
            </Text>
            <YStack gap="$1">
              <Button
                onPress={() => setTheme('light')}
                backgroundColor={theme === 'light' ? 'rgba(0, 122, 255, 0.1)' : 'transparent'}
                borderColor={theme === 'light' ? 'rgba(0, 122, 255, 0.3)' : '$borderColor'}
                borderRadius="$4"
                borderWidth="$0.5"
                justifyContent="flex-start"
                padding="$3"
              >
                <XStack alignItems="center" flex={1} gap="$3">
                  <IconSymbol
                    name="weather-sunny"
                    color={theme === 'light' ? '$tint' : (resolvedTheme === 'dark' ? '#FFFFFF' : '$color')}
                    size={20}
                  />
                  <Text color={theme === 'light' ? '$tint' : (resolvedTheme === 'dark' ? '#FFFFFF' : '$color')} fontFamily="$body" fontSize="$3" fontWeight="$4">
                    Light
                  </Text>
                  {theme === 'light' && (
                    <Text color="$tint" fontFamily="$body" fontSize="$2" marginLeft="auto">
                      Current
                    </Text>
                  )}
                </XStack>
              </Button>

              <Button
                onPress={() => setTheme('dark')}
                backgroundColor={theme === 'dark' ? (resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 122, 255, 0.1)') : 'transparent'}
                borderColor={theme === 'dark' ? (resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 122, 255, 0.3)') : '$borderColor'}
                borderRadius="$4"
                borderWidth="$0.5"
                justifyContent="flex-start"
                padding="$3"
              >
                <XStack alignItems="center" flex={1} gap="$3">
                  <IconSymbol
                    name="weather-night"
                    color={theme === 'dark' ? '$tint' : (resolvedTheme === 'dark' ? '#FFFFFF' : '$color')}
                    size={20}
                  />
                  <Text color={theme === 'dark' ? '$tint' : (resolvedTheme === 'dark' ? '#FFFFFF' : '$color')} fontFamily="$body" fontSize="$3" fontWeight="$4">
                    Dark
                  </Text>
                  {theme === 'dark' && (
                    <Text color="$tint" fontFamily="$body" fontSize="$2" marginLeft="auto">
                      Current
                    </Text>
                  )}
                </XStack>
              </Button>

              <Button
                onPress={() => setTheme('system')}
                backgroundColor={theme === 'system' ? 'rgba(0, 122, 255, 0.1)' : 'transparent'}
                borderColor={theme === 'system' ? 'rgba(0, 122, 255, 0.3)' : '$borderColor'}
                borderRadius="$4"
                borderWidth="$0.5"
                justifyContent="flex-start"
                padding="$3"
              >
                <XStack alignItems="center" flex={1} gap="$3">
                  <IconSymbol
                    name="theme-light-dark"
                    color={theme === 'system' ? '$tint' : (resolvedTheme === 'dark' ? '#FFFFFF' : '$color')}
                    size={20}
                  />
                  <Text color={theme === 'system' ? '$tint' : (resolvedTheme === 'dark' ? '#FFFFFF' : '$color')} fontFamily="$body" fontSize="$3" fontWeight="$4">
                    System
                  </Text>
                  {theme === 'system' && (
                    <Text color="$tint" fontFamily="$body" fontSize="$2" marginLeft="auto">
                      Current
                    </Text>
                  )}
                </XStack>
              </Button>
            </YStack>
          </YStack>

          {/* Current Theme Status */}
          <View
            backgroundColor="$background"
            borderColor="$borderColor"
            borderRadius="$4"
            borderWidth="$0.5"
            padding="$3"
          >
            <Text color={resolvedTheme === 'dark' ? '#CCCCCC' : '$color'} fontFamily="$body" fontSize="$3" opacity={resolvedTheme === 'dark' ? 1 : 0.8}>
              Current theme: {resolvedTheme} {theme === 'system' ? '(system)' : '(manual)'}
            </Text>
          </View>
        </YStack>

        {/* App Info Section */}
        <YStack gap="$3">
          <Text color={resolvedTheme === 'dark' ? '#FFFFFF' : '$color'} fontFamily="$body" fontSize="$5" fontWeight="$4">
            About
          </Text>

          <View
            backgroundColor="$background"
            borderColor="$borderColor"
            borderRadius="$4"
            borderWidth="$0.5"
            padding="$3"
          >
            <XStack alignItems="center" gap="$3">
              <IconSymbol name="information" color={resolvedTheme === 'dark' ? '#FFFFFF' : '$color'} size={20} />
              <YStack flex={1}>
                <Text color={resolvedTheme === 'dark' ? '#FFFFFF' : '$color'} fontFamily="$body" fontSize="$3" fontWeight="$4">
                  GA-X Aviation Platform
                </Text>
                <Text color={resolvedTheme === 'dark' ? '#CCCCCC' : '$color'} fontFamily="$body" fontSize="$2" opacity={resolvedTheme === 'dark' ? 1 : 0.7}>
                  Version 1.0.0
                </Text>
              </YStack>
            </XStack>
          </View>
        </YStack>
      </YStack>
    </ScrollView>
  );
}

