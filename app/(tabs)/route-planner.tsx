import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function RoutePlannerScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <IconSymbol name="map" size={64} color="#666" />
      <ThemedText type="title" style={{ marginTop: 20 }}>
        Route Planner
      </ThemedText>
      <ThemedText style={{ marginTop: 10, textAlign: 'center' }}>
        Flight route planning tools coming soon...
      </ThemedText>
    </ThemedView>
  );
}

