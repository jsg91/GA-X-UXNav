import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AerodromesScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <IconSymbol name="airport" size={64} color="#666" />
      <ThemedText type="title" style={{ marginTop: 20 }}>
        Aerodromes
      </ThemedText>
      <ThemedText style={{ marginTop: 10, textAlign: 'center' }}>
        Aerodrome directory and information coming soon...
      </ThemedText>
    </ThemedView>
  );
}

