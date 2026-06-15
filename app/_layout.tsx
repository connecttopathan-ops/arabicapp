/**
 * Root layout — runs once, wraps the whole app.
 *
 * Responsibilities:
 *  1. Load custom fonts (splash stays up until they're ready).
 *  2. Provide auth state to every screen via <AuthProvider>.
 *  3. Gate navigation: signed-out users see the (auth) flow; everyone else
 *     sees the (tabs) app. The splash is held until we know which.
 */
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ProgressProvider } from '@/context/ProgressContext';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { NotificationsManager } from '@/components';
import { colors, fontAssets } from '@/theme';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isAuthed, initializing } = useAuth();
  const { onboarded, loading: settingsLoading } = useSettings();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing || settingsLoading) return;

    // Hide the splash now that fonts, auth, and settings are all ready.
    SplashScreen.hideAsync();

    const first = segments[0];

    // First-run onboarding takes precedence over everything.
    if (!onboarded) {
      if (first !== 'onboarding') router.replace('/onboarding');
      return;
    }
    if (first === 'onboarding') {
      router.replace(isAuthed ? '/(tabs)' : '/(auth)/sign-in');
      return;
    }

    const inAuthGroup = first === '(auth)';
    if (!isAuthed && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (isAuthed && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthed, initializing, onboarded, settingsLoading, segments, router]);

  return (
    <>
      <NotificationsManager />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="play/[id]" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="review" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="sentences" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  // Wait for fonts before rendering anything (splash covers this).
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <SettingsProvider>
            <ProgressProvider>
              <StatusBar style="light" />
              <RootNavigator />
            </ProgressProvider>
          </SettingsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
