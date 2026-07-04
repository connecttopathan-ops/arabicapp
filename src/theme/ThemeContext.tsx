/**
 * Theme provider — selects the active token set from the user's settings and
 * exposes it via `useTheme()`. `useThemedStyles()` builds a StyleSheet from the
 * active tokens and re-memoizes when the theme changes, so styles swap live.
 */
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useSettings } from '@/context/SettingsContext';
import {
  darkColors,
  lightColors,
  jewelDark,
  jewelLight,
  type ThemeColors,
  type JewelSet,
} from './colors';

interface ThemeValue {
  colors: ThemeColors;
  jewel: JewelSet;
  mode: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeValue>({
  colors: darkColors,
  jewel: jewelDark,
  mode: 'dark',
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useSettings();
  const value = useMemo<ThemeValue>(
    () =>
      theme === 'light'
        ? { colors: lightColors, jewel: jewelLight, mode: 'light' }
        : { colors: darkColors, jewel: jewelDark, mode: 'dark' },
    [theme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  return useContext(ThemeContext);
}

/** Build a themed StyleSheet; recomputes when the active theme changes. */
export function useThemedStyles<T>(factory: (colors: ThemeColors, jewel: JewelSet) => T): T {
  const { colors, jewel } = useTheme();
  return useMemo(() => factory(colors, jewel), [colors, jewel]);
}
