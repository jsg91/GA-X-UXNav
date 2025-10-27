import React from 'react';
import { ScrollView } from 'react-native';
import { Button, XStack, YStack } from 'tamagui';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NAVIGATION_CONFIG } from '@/constants/NAVIGATION';

export default function TipsScreen() {
  const hotkeys = (NAVIGATION_CONFIG as any).hotkeys;

  const renderShortcutKey = (keyString: string) => {
    const keys = keyString.split(', ');

    return (
      <XStack gap="$1" flexWrap="wrap">
        {keys.map((key, index) => (
          <React.Fragment key={key}>
            <Button
              size="$1"
              backgroundColor="$background"
              borderWidth="$0.5"
              borderColor="$borderColor"
              borderRadius="$2"
              paddingHorizontal="$2"
              paddingVertical="$1"
              disabled
            >
              <ThemedText fontSize="$1" color="$color" style={{ fontFamily: 'monospace' }}>
                {key}
              </ThemedText>
            </Button>
            {index < keys.length - 1 && (
              <ThemedText fontSize="$1" color="$color" opacity={0.6}>
                or
              </ThemedText>
            )}
          </React.Fragment>
        ))}
      </XStack>
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <YStack gap="$6" paddingBottom="$8">

          {/* Header */}
          <YStack gap="$2" alignItems="center">
            <IconSymbol name="lightbulb" size={48} color="$tint" />
            <ThemedText type="title">Tips & Shortcuts</ThemedText>
            <ThemedText type="subtitle" textAlign="center" color="$color" opacity={0.8}>
              Master GA-X with keyboard shortcuts and AI assistance
            </ThemedText>
          </YStack>

          {/* AI Section */}
          <YStack gap="$3" padding="$4" backgroundColor="$background" borderRadius="$4" borderWidth="$0.5" borderColor="$borderColor">
            <XStack gap="$2" alignItems="center">
              <IconSymbol name="brain" size={24} color="#007AFF" />
              <ThemedText type="subtitle" fontWeight="600">AI Assistant</ThemedText>
            </XStack>

            <ThemedText color="$color">
              GA-X AI goes beyond what you can do manually. It can:
            </ThemedText>

            <YStack gap="$2" paddingLeft="$4">
              <ThemedText color="$color">• Analyze flight patterns and suggest optimizations</ThemedText>
              <ThemedText color="$color">• Predict maintenance needs based on usage data</ThemedText>
              <ThemedText color="$color">• Generate flight plans considering weather, NOTAMs, and regulations</ThemedText>
              <ThemedText color="$color">• Calculate weight & balance automatically with real-time adjustments</ThemedText>
              <ThemedText color="$color">• Cross-reference documents and find relevant regulations instantly</ThemedText>
              <ThemedText color="$color">• Suggest fuel stops and alternatives based on aircraft performance</ThemedText>
            </YStack>

            <ThemedText color="$color" opacity={0.8} fontSize="$2">
              Press <ThemedText fontWeight="600" color="$tint">⌘J</ThemedText> or <ThemedText fontWeight="600" color="$tint">Shift+Space</ThemedText> to open AI Assistant
            </ThemedText>
          </YStack>

          {/* Navigation Shortcuts */}
          <YStack gap="$3">
            <XStack gap="$2" alignItems="center">
              <IconSymbol name="keyboard" size={20} color="$color" />
              <ThemedText type="subtitle" fontWeight="600">Navigation</ThemedText>
            </XStack>

            <YStack gap="$2">
              {Object.entries(hotkeys?.navigation || {}).map(([key, config]: [string, any]) => (
                <XStack key={key} justifyContent="space-between" alignItems="center" padding="$2" backgroundColor="$background" borderRadius="$3">
                  <ThemedText color="$color">{config?.description}</ThemedText>
                  {renderShortcutKey(config?.keys)}
                </XStack>
              ))}
            </YStack>
          </YStack>

          {/* Global Actions */}
          <YStack gap="$3">
            <XStack gap="$2" alignItems="center">
              <IconSymbol name="zap" size={20} color="$color" />
              <ThemedText type="subtitle" fontWeight="600">Global Actions</ThemedText>
            </XStack>

            <YStack gap="$2">
              {Object.entries(hotkeys?.actions || {}).map(([key, config]: [string, any]) => (
                <XStack key={key} justifyContent="space-between" alignItems="center" padding="$2" backgroundColor="$background" borderRadius="$3">
                  <ThemedText color="$color">{config?.description}</ThemedText>
                  {renderShortcutKey(config?.keys)}
                </XStack>
              ))}
            </YStack>
          </YStack>

          {/* Context-Aware Actions */}
          <YStack gap="$3">
            <XStack gap="$2" alignItems="center">
              <IconSymbol name="target" size={20} color="$color" />
              <ThemedText type="subtitle" fontWeight="600">Context-Aware</ThemedText>
            </XStack>

            <ThemedText color="$color" opacity={0.8} fontSize="$2" paddingBottom="$2">
              These shortcuts change behavior based on your current page:
            </ThemedText>

            <YStack gap="$2">
              {Object.entries(hotkeys?.contextual || {}).map(([route, actions]: [string, any]) => (
                <YStack key={route} gap="$1" padding="$2" backgroundColor="$background" borderRadius="$3">
                  <ThemedText fontSize="$2" fontWeight="500" color="$tint">
                    {route.replace('/(tabs)/', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </ThemedText>
                  {Object.entries(actions || {}).map(([actionKey, actionConfig]: [string, any]) => (
                    <XStack key={actionKey} justifyContent="space-between" alignItems="center" paddingLeft="$2">
                      <ThemedText color="$color" opacity={0.9}>{actionConfig?.description}</ThemedText>
                      {renderShortcutKey(hotkeys?.actions?.[actionKey]?.keys)}
                    </XStack>
                  ))}
                </YStack>
              ))}
            </YStack>
          </YStack>

          {/* Pro Tips */}
          <YStack gap="$3" padding="$4" backgroundColor="$background" borderRadius="$4" borderWidth="$0.5" borderColor="$borderColor">
            <XStack gap="$2" alignItems="center">
              <IconSymbol name="star" size={20} color="$tint" />
              <ThemedText type="subtitle" fontWeight="600">Pro Tips</ThemedText>
            </XStack>

            <YStack gap="$2">
              <ThemedText color="$color">• Use <ThemedText fontWeight="600" color="$tint">G+D</ThemedText> to quickly return to Dashboard from anywhere</ThemedText>
              <ThemedText color="$color">• <ThemedText fontWeight="600" color="$tint">N</ThemedText> creates context-appropriate items (reservations, log entries, etc.)</ThemedText>
              <ThemedText color="$color">• <ThemedText fontWeight="600" color="$tint">⌘K</ThemedText> focuses search to find anything instantly</ThemedText>
              <ThemedText color="$color">• <ThemedText fontWeight="600" color="$tint">Shift+?</ThemedText> brings up this help anytime</ThemedText>
              <ThemedText color="$color">• <ThemedText fontWeight="600" color="$tint">Esc</ThemedText> closes any modal or overlay</ThemedText>
            </YStack>
          </YStack>

        </YStack>
      </ScrollView>
    </ThemedView>
  );
}
