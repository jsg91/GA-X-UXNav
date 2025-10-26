import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NAVIGATION_CONFIG } from '@/constants/NAVIGATION';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

export function ProfileMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          // TODO: Implement actual logout logic
          console.log('User signed out');
          setIsVisible(false);
        }},
      ]
    );
  };

  const handleMenuItemPress = (item: typeof NAVIGATION_CONFIG.profileMenu.items[0]) => {
    setIsVisible(false);

    if (item.id === 'logout') {
      handleLogout();
      return;
    }

    // For other items, navigation will be handled by Link component
  };

  return (
    <>
      {/* Profile Menu Button */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <IconSymbol
          name="person.fill"
          size={24}
          color={Colors[theme].text}
        />
      </TouchableOpacity>

      {/* Profile Menu Modal */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <ThemedView style={[styles.menuContainer, { backgroundColor: Colors[theme].background }]}>
            <View style={styles.menuHeader}>
              <ThemedText type="subtitle" style={styles.menuTitle}>
                Profile Menu
              </ThemedText>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <IconSymbol
                  name="xmark"
                  size={20}
                  color={Colors[theme].text}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
              {NAVIGATION_CONFIG.profileMenu.items
                .filter(item => item.visible)
                .map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={() => handleMenuItemPress(item)}
                    disabled={!item.href && item.id !== 'logout'}
                  >
                    {item.href ? (
                      <Link href={item.href} style={styles.menuItemLink}>
                        <View style={styles.menuItemContent}>
                          <IconSymbol
                            name={item.icon as any}
                            size={20}
                            color={Colors[theme].text}
                          />
                          <ThemedText style={styles.menuItemText}>
                            {item.name}
                          </ThemedText>
                        </View>
                      </Link>
                    ) : (
                      <View style={styles.menuItemContent}>
                        <IconSymbol
                          name={item.icon as any}
                          size={20}
                          color={item.id === 'logout' ? '#FF3B30' : Colors[theme].text}
                        />
                        <ThemedText
                          style={[
                            styles.menuItemText,
                            item.id === 'logout' && styles.logoutText
                          ]}
                        >
                          {item.name}
                        </ThemedText>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    padding: 8,
    marginRight: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: '70%',
    maxWidth: 300,
    height: '100%',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  menuContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  menuItemLink: {
    width: '100%',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    flex: 1,
  },
  logoutText: {
    color: '#FF3B30',
  },
});

