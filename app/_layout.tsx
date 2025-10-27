import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PortalProvider, TamaguiProvider } from 'tamagui';

import { tamaguiConfig } from '@/constants/theme';
import { ThemeProvider as CustomThemeProvider, useThemeContext } from '@/hooks/use-theme-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppLayout() {
  const { resolvedTheme } = useThemeContext();
  const [loaded, error] = useFonts({
    ...MaterialCommunityIcons.font,
  });

  // Log any font loading errors
  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={resolvedTheme}>
      <PortalProvider>
        <ThemeProvider value={resolvedTheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'GA-X' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PortalProvider>
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
