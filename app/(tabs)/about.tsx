import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <IconSymbol
            name="info"
            size={80}
            color={Colors[theme].tint}
            style={styles.headerIcon}
          />
          <ThemedText type="title" style={styles.title}>
            About GA-X
          </ThemedText>
          <ThemedText style={styles.version}>
            Version 1.0.0
          </ThemedText>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            What is GA-X?
          </ThemedText>
          <ThemedText style={styles.description}>
            GA-X is a comprehensive aviation management platform designed specifically
            for general aviation pilots, clubs, and aerodrome operators. Our mission is to
            streamline aviation operations through intuitive design and powerful functionality.
          </ThemedText>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Key Features
          </ThemedText>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <IconSymbol name="view-dashboard" size={24} color={Colors[theme].tint} />
              <ThemedText style={styles.featureText}>
                Comprehensive Dashboard
              </ThemedText>
            </View>

            <View style={styles.featureItem}>
              <IconSymbol name="calendar-check" size={24} color={Colors[theme].tint} />
              <ThemedText style={styles.featureText}>
                Reservation Management
              </ThemedText>
            </View>

            <View style={styles.featureItem}>
              <IconSymbol name="airplane-edit" size={24} color={Colors[theme].tint} />
              <ThemedText style={styles.featureText}>
                Aircraft Management
              </ThemedText>
            </View>

            <View style={styles.featureItem}>
              <IconSymbol name="book" size={24} color={Colors[theme].tint} />
              <ThemedText style={styles.featureText}>
                Digital Logbook
              </ThemedText>
            </View>

            <View style={styles.featureItem}>
              <IconSymbol name="wrench" size={24} color={Colors[theme].tint} />
              <ThemedText style={styles.featureText}>
                Maintenance Tracking
              </ThemedText>
            </View>

            <View style={styles.featureItem}>
              <IconSymbol name="map" size={24} color={Colors[theme].tint} />
              <ThemedText style={styles.featureText}>
                Route Planning Tools
              </ThemedText>
            </View>

            <View style={styles.featureItem}>
              <IconSymbol name="account-group" size={24} color={Colors[theme].tint} />
              <ThemedText style={styles.featureText}>
                Club Management
              </ThemedText>
            </View>

            <View style={styles.featureItem}>
              <IconSymbol name="airport" size={24} color={Colors[theme].tint} />
              <ThemedText style={styles.featureText}>
                Aerodrome Directory
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Mission Section */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Our Mission
          </ThemedText>
          <ThemedText style={styles.description}>
            To empower general aviation professionals with modern, user-friendly tools that
            enhance safety, efficiency, and enjoyment of flying. We believe in making
            complex aviation management tasks simple and accessible to everyone.
          </ThemedText>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Get in Touch
          </ThemedText>
          <ThemedText style={styles.description}>
            Have questions or suggestions? We&apos;d love to hear from you!
          </ThemedText>
          <ThemedText style={styles.contactInfo}>
            • Visit our support center for help{'\n'}
            • Request new features through our feature request system{'\n'}
            • Follow us for updates and aviation tips
          </ThemedText>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            © 2025 GA-X. Built for the aviation community.
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  headerIcon: {
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Arial',
  },
  version: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
    fontFamily: 'Arial',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
    fontFamily: 'Arial',
  },
  featureList: {
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'Arial',
  },
  contactInfo: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    opacity: 0.8,
    fontFamily: 'Arial',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
    fontFamily: 'Arial',
  },
});

