import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AircraftsScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <IconSymbol name="airplane-edit" size={64} color="#666" />
      <ThemedText type="title" style={{ marginTop: 20 }}>
        Aircrafts
      </ThemedText>
      <ThemedText style={{ marginTop: 10, textAlign: 'center' }}>
        Aircraft management coming soon...
      </ThemedText>
    </ThemedView>
  );
}

