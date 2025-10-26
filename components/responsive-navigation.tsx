import { Link, Tabs, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Platform, TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { ProfileMenu } from '@/components/profile-menu';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NAVIGATION_CONFIG } from '@/constants/NAVIGATION';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Breakpoint for big screens (tablets and desktops)
const BIG_SCREEN_BREAKPOINT = 768;

interface ResponsiveNavigationProps {
  children: React.ReactNode;
}

export function ResponsiveNavigation({ children }: ResponsiveNavigationProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const pathname = usePathname();
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  // Determine if we're on a big screen
  const isBigScreen = isWeb ? width >= BIG_SCREEN_BREAKPOINT : false;

  // Filter visible navigation items and sort by order
  const visibleNavItems = NAVIGATION_CONFIG.tabBar.items
    .filter(item => item.visible)
    .sort((a, b) => a.order - b.order);

  const handleHomePress = () => {
    if (pathname !== '/(tabs)/' && pathname !== '/(tabs)/index') {
      router.replace('/(tabs)/');
    }
  };

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  if (isBigScreen) {
    // Big screen: Header navigation + Footer
    return (
      <ThemedView style={{ flex: 1 }}>
        {/* Header Navigation */}
        <ThemedView style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: Colors[theme].tint + '20',
          backgroundColor: Colors[theme].background,
        }}>
          {/* Clickable Title - All the way left */}
          <TouchableOpacity
            style={{
              paddingHorizontal: 0,
              paddingVertical: 8,
              borderRadius: 8,
              marginRight: 24,
              backgroundColor: 'transparent',
              borderBottomWidth: 2,
              borderBottomColor: isPressed ? Colors[theme].tint : 'transparent',
            }}
            onPress={handleHomePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel="Go to Home"
            accessibilityHint="Tap to return to the home screen"
          >
            <ThemedText
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: Colors[theme].text,
              }}
            >
              GA-X UXNav
            </ThemedText>
          </TouchableOpacity>

          {/* Navigation Items - Centered */}
          <ThemedView style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            justifyContent: 'center',
          }}>
            {visibleNavItems.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                pathname={pathname}
              />
            ))}
          </ThemedView>

          {/* Profile Menu - Right */}
          <ProfileMenu />
        </ThemedView>

        {/* Main Content */}
        <ThemedView style={{ flex: 1 }}>
          {children}
        </ThemedView>

        {/* Footer */}
        <Footer />
      </ThemedView>
    );
  }

  // Small screen: Bottom tab navigation (default behavior)
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: true,
        headerTitle: '',
        headerLeft: () => (
          <TouchableOpacity
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              marginLeft: 8,
              backgroundColor: 'transparent',
              borderBottomWidth: 2,
              borderBottomColor: isPressed ? Colors[theme].tint : 'transparent',
            }}
            onPress={handleHomePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel="Go to Home"
            accessibilityHint="Tap to return to the home screen"
          >
            <ThemedText
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: Colors[theme].text,
              }}
            >
              GA-X UXNav
            </ThemedText>
          </TouchableOpacity>
        ),
        headerRight: () => <ProfileMenu />,
        tabBarButton: HapticTab,
      }}>
      {visibleNavItems.map((item) => (
        <Tabs.Screen
          key={item.id}
          name={item.id === 'dashboard' ? 'index' : item.id}
          options={{
            title: item.name,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name={item.icon as any} color={color} />
            ),
          }}
        />
      ))}

      {/* Keep existing explore screen for now */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />

      {/* Hidden screens - exclude profile menu items completely from mobile tabs */}
      {NAVIGATION_CONFIG.tabBar.items
        .filter(item => !item.visible)
        .map((item) => (
          <Tabs.Screen
            key={item.id}
            name={item.id === 'dashboard' ? 'index' : item.id}
            options={{
              href: null,
            }}
          />
        ))}

      {/* Hide all profile menu screens from mobile tab navigation */}
      {NAVIGATION_CONFIG.profileMenu.items.map((item) => (
        <Tabs.Screen
          key={item.id}
          name={item.id}
          options={{
            href: null, // Completely hide from tab bar
          }}
        />
      ))}
    </Tabs>
  );
}

interface NavigationItemProps {
  item: typeof NAVIGATION_CONFIG.tabBar.items[0];
  pathname: string;
}

function NavigationItem({ item, pathname }: NavigationItemProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';

  // Handle dashboard -> index mapping for navigation
  const navigationHref = item.id === 'dashboard' ? '/(tabs)/' : item.href;
  const isActive = item.id === 'dashboard' ? pathname === '/(tabs)/' || pathname === '/(tabs)/index' : pathname === item.href;

  return (
    <Link href={navigationHref}>
      <ThemedView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          backgroundColor: isActive ? Colors[theme].tint + '15' : 'transparent',
        }}
      >
        <IconSymbol
          name={item.icon as any}
          size={20}
          color={isActive ? Colors[theme].tint : Colors[theme].text}
        />
        <ThemedText
          style={{
            fontSize: 14,
            fontWeight: isActive ? '600' : '400',
            color: isActive ? Colors[theme].tint : Colors[theme].text,
          }}
        >
          {item.name}
        </ThemedText>
      </ThemedView>
    </Link>
  );
}

function Footer() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';

  return (
    <ThemedView
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: Colors[theme].tint + '20',
        backgroundColor: Colors[theme].background,
      }}
    >
      {/* Centered text */}
      <ThemedView style={{ flex: 1, alignItems: 'center' }}>
        <ThemedText
          style={{
            fontSize: 12,
            color: Colors[theme].text + '80',
            fontWeight: '400',
          }}
        >
          by Swiss Aviation Ventures
        </ThemedText>
      </ThemedView>

      {/* Footer content can be customized here */}
      <ThemedText
        style={{
          fontSize: 12,
          color: Colors[theme].text + '80',
          fontWeight: '400',
        }}
      >
        Aviation Management Platform
      </ThemedText>
    </ThemedView>
  );
}
