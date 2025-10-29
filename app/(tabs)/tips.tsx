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
      <XStack flexWrap="wrap" gap="$1">
        {keys.map((key, index) => (
          <React.Fragment key={key}>
            <Button
              disabled
              backgroundColor="$background"
              borderColor="$borderColor"
              borderRadius="$2"
              borderWidth="$0.5"
              paddingHorizontal="$2"
              paddingVertical="$1"
              size="$1"
            >
              <ThemedText style={{ fontFamily: 'monospace' }} color="$color" fontSize="$1">
                {key}
              </ThemedText>
            </Button>
            {index < keys.length - 1 && (
              <ThemedText color="$color" fontSize="$1" opacity={0.6}>
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
          <YStack alignItems="center" gap="$2">
            <IconSymbol name="lightbulb" color="$tint" size={48} />
            <ThemedText type="title">Tips & Shortcuts</ThemedText>
            <ThemedText color="$color" opacity={0.8} textAlign="center" type="subtitle">
              Master GA-X with keyboard shortcuts and AI assistance
            </ThemedText>
          </YStack>

          {/* AI Section */}
          <YStack backgroundColor="$background" borderColor="$borderColor" borderRadius="$4" borderWidth="$0.5" gap="$3" padding="$4">
            <XStack alignItems="center" gap="$2">
              <IconSymbol name="brain" color="#007AFF" size={24} />
              <ThemedText fontWeight="600" type="subtitle">AI Assistant</ThemedText>
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

            <ThemedText color="$color" fontSize="$2" opacity={0.8}>
              Press <ThemedText color="$tint" fontWeight="600">⌘J</ThemedText> or <ThemedText color="$tint" fontWeight="600">Shift+Space</ThemedText> to open AI Assistant
            </ThemedText>
          </YStack>

          {/* Navigation Shortcuts */}
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <IconSymbol name="keyboard" color="$color" size={20} />
              <ThemedText fontWeight="600" type="subtitle">Navigation</ThemedText>
            </XStack>

            <YStack gap="$2">
              {Object.entries(hotkeys?.navigation || {}).map(([key, config]: [string, any]) => (
                <XStack key={key} alignItems="center" backgroundColor="$background" borderRadius="$3" justifyContent="space-between" padding="$2">
                  <ThemedText color="$color">{config?.description}</ThemedText>
                  {renderShortcutKey(config?.keys)}
                </XStack>
              ))}
            </YStack>
          </YStack>

          {/* Global Actions */}
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <IconSymbol name="zap" color="$color" size={20} />
              <ThemedText fontWeight="600" type="subtitle">Global Actions</ThemedText>
            </XStack>

            <YStack gap="$2">
              {Object.entries(hotkeys?.actions || {}).map(([key, config]: [string, any]) => (
                <XStack key={key} alignItems="center" backgroundColor="$background" borderRadius="$3" justifyContent="space-between" padding="$2">
                  <ThemedText color="$color">{config?.description}</ThemedText>
                  {renderShortcutKey(config?.keys)}
                </XStack>
              ))}
            </YStack>
          </YStack>

          {/* Context-Aware Actions */}
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <IconSymbol name="target" color="$color" size={20} />
              <ThemedText fontWeight="600" type="subtitle">Context-Aware</ThemedText>
            </XStack>

            <ThemedText color="$color" fontSize="$2" opacity={0.8} paddingBottom="$2">
              These shortcuts change behavior based on your current page:
            </ThemedText>

            <YStack gap="$2">
              {Object.entries(hotkeys?.contextual || {}).map(([route, actions]: [string, any]) => (
                <YStack key={route} backgroundColor="$background" borderRadius="$3" gap="$1" padding="$2">
                  <ThemedText color="$tint" fontSize="$2" fontWeight="500">
                    {route.replace('/(tabs)/', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </ThemedText>
                  {Object.entries(actions || {}).map(([actionKey, actionConfig]: [string, any]) => (
                    <XStack key={actionKey} alignItems="center" justifyContent="space-between" paddingLeft="$2">
                      <ThemedText color="$color" opacity={0.9}>{actionConfig?.description}</ThemedText>
                      {renderShortcutKey(hotkeys?.actions?.[actionKey]?.keys)}
                    </XStack>
                  ))}
                </YStack>
              ))}
            </YStack>
          </YStack>

          {/* Pro Tips */}
          <YStack backgroundColor="$background" borderColor="$borderColor" borderRadius="$4" borderWidth="$0.5" gap="$3" padding="$4">
            <XStack alignItems="center" gap="$2">
              <IconSymbol name="star" color="$tint" size={20} />
              <ThemedText fontWeight="600" type="subtitle">Pro Tips</ThemedText>
            </XStack>

            <YStack gap="$2">
              <ThemedText color="$color">• Use <ThemedText color="$tint" fontWeight="600">G+D</ThemedText> to quickly return to Dashboard from anywhere</ThemedText>
              <ThemedText color="$color">• <ThemedText color="$tint" fontWeight="600">N</ThemedText> creates context-appropriate items (reservations, log entries, etc.)</ThemedText>
              <ThemedText color="$color">• <ThemedText color="$tint" fontWeight="600">⌘K</ThemedText> focuses search to find anything instantly</ThemedText>
              <ThemedText color="$color">• <ThemedText color="$tint" fontWeight="600">Shift+?</ThemedText> brings up this help anytime</ThemedText>
              <ThemedText color="$color">• <ThemedText color="$tint" fontWeight="600">Esc</ThemedText> closes any modal or overlay</ThemedText>
            </YStack>
          </YStack>

        </YStack>
      </ScrollView>
    </ThemedView>
  );
}
