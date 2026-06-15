/**
 * Profile tab — account summary, daily goal, and a link into Settings.
 */
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Card } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useTheme, useThemedStyles, spacing, radius, type ThemeColors } from '@/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isGuest } = useAuth();
  const { dailyGoalMinutes, reminderEnabled } = useSettings();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const displayName = isGuest ? 'Guest' : user?.email ?? 'Signed in';
  const subtitle = isGuest ? 'You’re exploring without an account' : 'Signed in with email';

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name={isGuest ? 'person-outline' : 'person'} size={32} color={colors.primary} />
        </View>
        <AppText variant="title" style={styles.center} numberOfLines={1}>
          {displayName}
        </AppText>
        <AppText variant="body" color="textMuted" style={styles.center}>
          {subtitle}
        </AppText>
      </View>

      <Card style={styles.goalCard}>
        <View style={styles.row}>
          <Ionicons name="flag-outline" size={20} color={colors.accent} />
          <AppText variant="bodyStrong">Daily goal</AppText>
        </View>
        <AppText variant="body" color="textMuted">
          {dailyGoalMinutes} minutes a day · reminders {reminderEnabled ? 'on' : 'off'}
        </AppText>
      </Card>

      <Pressable
        onPress={() => router.push('/settings')}
        accessibilityRole="button"
        style={({ pressed }) => [styles.settingsRow, pressed && styles.pressed]}
      >
        <Ionicons name="settings-outline" size={20} color={colors.accent} />
        <AppText variant="bodyStrong" style={styles.settingsLabel}>
          Settings
        </AppText>
        <Ionicons name="chevron-forward" size={20} color={colors.textFaint} />
      </Pressable>
    </Screen>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  center: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  goalCard: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.9,
  },
  settingsLabel: {
    flex: 1,
  },
});
