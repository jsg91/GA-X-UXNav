import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function MaintenanceScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <IconSymbol name="wrench" size={64} color="#666" />
      <ThemedText type="title" style={{ marginTop: 20 }}>
        Maintenance
      </ThemedText>
      <ThemedText style={{ marginTop: 10, textAlign: 'center' }}>
        Aircraft maintenance management coming soon...
      </ThemedText>
    </ThemedView>
  );
}

