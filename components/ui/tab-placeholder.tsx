import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface TabPlaceholderProps {
  icon: string;
  title: string;
  description: string;
}

export function TabPlaceholder({ icon, title, description }: TabPlaceholderProps) {
  return (
    <ThemedView style={styles.container}>
      <IconSymbol name={icon} color="#fff" size={64} />
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText style={styles.description}>
        {description}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginTop: 20,
  },
  description: {
    marginTop: 10,
    textAlign: 'center',
  },
});


