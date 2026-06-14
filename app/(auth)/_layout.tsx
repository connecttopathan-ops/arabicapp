/**
 * Layout for the auth flow. A plain stack with no header — the sign-in screen
 * draws its own branding.
 */
import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
