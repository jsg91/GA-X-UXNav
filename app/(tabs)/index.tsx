import { ScrollView, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to GA-X!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">About GA-X</ThemedText>
        <ThemedText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </ThemedText>
        <ThemedText>
          GA-X is a comprehensive aviation management platform designed to streamline operations for flight schools, aircraft clubs, and individual pilots. Our system provides integrated solutions for flight logbook management, aircraft maintenance tracking, aerodrome information, and regulatory compliance.
        </ThemedText>
        <ThemedText>
          Built with modern technology and user experience in mind, GA-X helps aviation professionals save time, reduce errors, and maintain complete records of their aviation activities. Whether you're tracking flight hours, scheduling maintenance, or managing aircraft reservations, GA-X provides the tools you need.
        </ThemedText>
      </ThemedView>

      {/* Demo of improved dark theme colors */}
      <ThemedView variant="secondary" style={[styles.stepContainer, styles.demoContainer]}>
        <ThemedText type="subtitle">Theme Demo</ThemedText>
        <ThemedText level="primary">Primary text - main content</ThemedText>
        <ThemedText level="secondary">Secondary text - supporting information</ThemedText>
        <ThemedText level="tertiary">Tertiary text - metadata and hints</ThemedText>
        <ThemedText>
          This section demonstrates the theme system capabilities, showing how different text levels provide visual hierarchy and improve readability across light and dark modes.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Features</ThemedText>
        <ThemedText>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </ThemedText>
        <ThemedText>
          Key features include comprehensive flight logbook management with digital signatures, automated maintenance scheduling based on flight hours and calendar dates, real-time aerodrome information including NOTAMs and weather data, and document management for licenses, certificates, and aircraft documentation.
        </ThemedText>
        <ThemedText>
          Our platform also offers advanced reporting capabilities, allowing users to generate custom reports for regulatory compliance, financial tracking, and operational analysis. Integration with external systems ensures seamless data flow and reduces manual data entry.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Getting Started</ThemedText>
        <ThemedText>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </ThemedText>
        <ThemedText>
          To get started with GA-X, simply navigate through the sidebar menu to access different sections of the platform. Use the role selector in the top navigation to switch between different user contexts such as Pilot, Instructor, or Maintenance Engineer, each providing access to relevant features and data.
        </ThemedText>
        <ThemedText>
          Explore the dynamic navigation system that adapts to your role, giving you quick access to the tools and information you need most. Use the search functionality to quickly find aircraft, aerodromes, documents, or other resources across the platform.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  demoContainer: {
    padding: 16,
    borderRadius: 8,
  },
});
