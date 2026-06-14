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
import { colors, fontAssets } from '@/theme';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isAuthed, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;

    // Hide the splash now that fonts AND the auth check are both done.
    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthed && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (isAuthed && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthed, initializing, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="play/[id]" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="review" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="sentences" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
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
          <ProgressProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </ProgressProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
