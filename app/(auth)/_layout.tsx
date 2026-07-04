/**
 * Layout for the auth flow. A plain stack with no header — the sign-in screen
 * draws its own branding.
 */
import { Stack } from 'expo-router';
import { useTheme } from '@/theme';

export default function AuthLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
