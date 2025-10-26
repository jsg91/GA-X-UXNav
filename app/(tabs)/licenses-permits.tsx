import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LicensesPermitsScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <IconSymbol name="certificate" size={64} color="#666" />
      <ThemedText type="title" style={{ marginTop: 20 }}>
        Licenses & Permits
      </ThemedText>
      <ThemedText style={{ marginTop: 10, textAlign: 'center' }}>
        License and permit management coming soon...
      </ThemedText>
    </ThemedView>
  );
}

