import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

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
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((storedTheme) => {
      if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
        setTheme(storedTheme as Theme);
      }
      setMounted(true);
    });
  }, []);

  // Save theme preference to storage when changed
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
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
