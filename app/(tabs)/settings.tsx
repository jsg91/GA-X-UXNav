import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, View, XStack, YStack } from 'tamagui';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeContext } from '@/hooks/use-theme-context';

export default function SettingsScreen() {
  const { theme, setTheme, resolvedTheme } = useThemeContext();

  return (
    <ScrollView style={{ flex: 1 }}>
      <YStack padding="$4" gap="$4" backgroundColor="$background">
        {/* Header */}
        <YStack gap="$2">
          <Text fontSize="$8" fontWeight="$5" color="$color" fontFamily="$body">
            Settings
          </Text>
          <Text fontSize="$3" color="$color" opacity={0.7} fontFamily="$body">
            Customize your app experience
          </Text>
        </YStack>

        {/* Appearance Section */}
        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="$4" color="$color" fontFamily="$body">
            Appearance
          </Text>

          {/* Theme Selection */}
          <YStack gap="$2">
            <Text fontSize="$3" color="$color" opacity={0.8} fontFamily="$body">
              Theme
            </Text>
            <YStack gap="$1">
              <Button
                backgroundColor={theme === 'light' ? 'rgba(0, 122, 255, 0.1)' : 'transparent'}
                borderWidth="$0.5"
                borderColor={theme === 'light' ? 'rgba(0, 122, 255, 0.3)' : '$borderColor'}
                borderRadius="$4"
                padding="$3"
                onPress={() => setTheme('light')}
                justifyContent="flex-start"
              >
                <XStack alignItems="center" gap="$3" flex={1}>
                  <IconSymbol
                    name="weather-sunny"
                    size={20}
                    color={theme === 'light' ? '$tint' : '$color'}
                  />
                  <Text color={theme === 'light' ? '$tint' : '$color'} fontSize="$3" fontWeight="$4" fontFamily="$body">
                    Light
                  </Text>
                  {theme === 'light' && (
                    <Text marginLeft="auto" color="$tint" fontSize="$2" fontFamily="$body">
                      Current
                    </Text>
                  )}
                </XStack>
              </Button>

              <Button
                backgroundColor={theme === 'dark' ? 'rgba(10, 132, 255, 0.1)' : 'transparent'}
                borderWidth="$0.5"
                borderColor={theme === 'dark' ? 'rgba(10, 132, 255, 0.3)' : '$borderColor'}
                borderRadius="$4"
                padding="$3"
                onPress={() => setTheme('dark')}
                justifyContent="flex-start"
              >
                <XStack alignItems="center" gap="$3" flex={1}>
                  <IconSymbol
                    name="weather-night"
                    size={20}
                    color={theme === 'dark' ? '$tint' : '$color'}
                  />
                  <Text color={theme === 'dark' ? '$tint' : '$color'} fontSize="$3" fontWeight="$4" fontFamily="$body">
                    Dark
                  </Text>
                  {theme === 'dark' && (
                    <Text marginLeft="auto" color="$tint" fontSize="$2" fontFamily="$body">
                      Current
                    </Text>
                  )}
                </XStack>
              </Button>

              <Button
                backgroundColor={theme === 'system' ? 'rgba(0, 122, 255, 0.1)' : 'transparent'}
                borderWidth="$0.5"
                borderColor={theme === 'system' ? 'rgba(0, 122, 255, 0.3)' : '$borderColor'}
                borderRadius="$4"
                padding="$3"
                onPress={() => setTheme('system')}
                justifyContent="flex-start"
              >
                <XStack alignItems="center" gap="$3" flex={1}>
                  <IconSymbol
                    name="theme-light-dark"
                    size={20}
                    color={theme === 'system' ? '$tint' : '$color'}
                  />
                  <Text color={theme === 'system' ? '$tint' : '$color'} fontSize="$3" fontWeight="$4" fontFamily="$body">
                    System
                  </Text>
                  {theme === 'system' && (
                    <Text marginLeft="auto" color="$tint" fontSize="$2" fontFamily="$body">
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
            borderWidth="$0.5"
            borderColor="$borderColor"
            borderRadius="$4"
            padding="$3"
          >
            <Text fontSize="$3" color="$color" opacity={0.8} fontFamily="$body">
              Current theme: {resolvedTheme} {theme === 'system' ? '(system)' : '(manual)'}
            </Text>
          </View>
        </YStack>

        {/* App Info Section */}
        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="$4" color="$color" fontFamily="$body">
            About
          </Text>

          <View
            backgroundColor="$background"
            borderWidth="$0.5"
            borderColor="$borderColor"
            borderRadius="$4"
            padding="$3"
          >
            <XStack alignItems="center" gap="$3">
              <IconSymbol name="information" size={20} color="$color" />
              <YStack flex={1}>
                <Text fontSize="$3" fontWeight="$4" color="$color" fontFamily="$body">
                  GA-X Aviation Platform
                </Text>
                <Text fontSize="$2" color="$color" opacity={0.7} fontFamily="$body">
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

