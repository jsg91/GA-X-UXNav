import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_preference';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);
  const systemTheme = useColorScheme();

  // Load theme preference from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        let storedTheme: string | null = null;
        if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
          storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        } else {
          storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        }
        if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
          setTheme(storedTheme as Theme);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setMounted(true);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference to storage when changed
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } else {
        AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      }
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Resolve the actual theme (system or manual override)
  const resolvedTheme = mounted
    ? (theme === 'system' ? (systemTheme ?? 'light') : theme)
    : 'light';

  return (
    <ThemeContext.Provider value={{
      theme,
      resolvedTheme,
      setTheme: handleSetTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

// For backward compatibility with existing components
export function useColorSchemeOverride() {
  const { resolvedTheme } = useThemeContext();
  return resolvedTheme;
}
