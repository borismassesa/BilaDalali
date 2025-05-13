import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Theme colors
export const lightTheme = {
  primary: '#1A73E8',
  secondary: '#F5F5F5',
  accent: '#FF7043',
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  notification: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  disabled: '#BDBDBD',
  mapMarker: '#1A73E8',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme = {
  primary: '#4285F4',
  secondary: '#2C2C2C',
  accent: '#FF7043',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#424242',
  notification: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  disabled: '#757575',
  mapMarker: '#4285F4',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export type Theme = typeof lightTheme;

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (scheme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');

  // Update theme based on system changes when in 'system' mode
  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(colorScheme === 'dark');
    }
  }, [colorScheme, themeMode]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
    setThemeMode(isDark ? 'light' : 'dark');
  };

  const setTheme = (scheme: 'light' | 'dark' | 'system') => {
    setThemeMode(scheme);
    if (scheme === 'system') {
      setIsDark(colorScheme === 'dark');
    } else {
      setIsDark(scheme === 'dark');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: isDark ? darkTheme : lightTheme,
        isDark,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}