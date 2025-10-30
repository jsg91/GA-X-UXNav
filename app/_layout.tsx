import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { PortalProvider, TamaguiProvider, Theme } from 'tamagui';

import { tamaguiConfig } from '@/constants/theme';
import { ThemeProvider as CustomThemeProvider, useThemeContext } from '@/hooks/use-theme-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppLayout() {
  const { resolvedTheme } = useThemeContext();
  const [loaded, error] = useFonts({
    ...MaterialCommunityIcons.font,
  });

  // Set body/html background color for web
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const backgroundColor = resolvedTheme === 'dark' ? '#000000' : '#FFFFFF';
      document.documentElement.style.backgroundColor = backgroundColor;
      document.body.style.backgroundColor = backgroundColor;
    }
  }, [resolvedTheme]);

  // Log any font loading errors
  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      hideAsync();
    }
  }, [loaded]);

  // Hide Android navigation bar for immersive experience
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden').catch((error) => {
        console.warn('Failed to hide navigation bar:', error);
      });
      NavigationBar.setBehaviorAsync('overlay-swipe').catch((error) => {
        console.warn('Failed to set navigation bar behavior:', error);
      });
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={resolvedTheme}>
      <Theme name={resolvedTheme}>
        <PortalProvider>
          <ThemeProvider value={resolvedTheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'GA-X' }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </PortalProvider>
      </Theme>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <AppLayout />
    </CustomThemeProvider>
  );
}
