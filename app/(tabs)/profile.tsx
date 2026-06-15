/**
 * Profile tab — account summary, daily goal, reminder settings, and sign-out.
 * (A dedicated settings screen will expand on this later.)
 */
import { View, Switch, Pressable, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Button, Card } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { ensurePermission, sendTestNotification } from '@/services/notificationsService';
import { formatTime } from '@/lib/time';
import { colors, spacing, radius } from '@/theme';

const TIME_PRESETS: { hour: number; minute: number }[] = [
  { hour: 8, minute: 0 },
  { hour: 18, minute: 0 },
  { hour: 19, minute: 30 },
  { hour: 20, minute: 0 },
  { hour: 21, minute: 0 },
];

export default function ProfileScreen() {
  const { user, isGuest, signOut } = useAuth();
  const { dailyGoalMinutes, reminderEnabled, reminderHour, reminderMinute, updateReminder } =
    useSettings();

  const displayName = isGuest ? 'Guest' : user?.email ?? 'Signed in';
  const subtitle = isGuest ? 'You’re exploring without an account' : 'Signed in with email';

  async function toggleReminder(value: boolean) {
    if (value) {
      const granted = await ensurePermission();
      if (!granted) {
        Alert.alert(
          'Notifications are off',
          'Enable notifications for Expo Go / MASAR in your phone’s Settings to receive reminders.',
        );
        return;
      }
      await updateReminder(true, reminderHour, reminderMinute);
    } else {
      await updateReminder(false, reminderHour, reminderMinute);
    }
  }

  async function pickTime(hour: number, minute: number) {
    const granted = await ensurePermission();
    if (!granted) return;
    await updateReminder(true, hour, minute);
  }

  async function test() {
    const granted = await ensurePermission();
    if (!granted) {
      Alert.alert('Notifications are off', 'Enable notifications to receive a test.');
      return;
    }
    await sendTestNotification();
    Alert.alert(
      'Test scheduled',
      'A test notification will arrive in about 8 seconds — you can background the app to see it.',
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name={isGuest ? 'person-outline' : 'person'} size={32} color={colors.primary} />
        </View>
        <AppText variant="title" style={styles.name} numberOfLines={1}>
          {displayName}
        </AppText>
        <AppText variant="body" color="textMuted" style={styles.subtitle}>
          {subtitle}
        </AppText>
      </View>

      <Card style={styles.goalCard}>
        <View style={styles.row}>
          <Ionicons name="flag-outline" size={20} color={colors.secondary} />
          <AppText variant="bodyStrong">Daily goal</AppText>
        </View>
        <AppText variant="body" color="textMuted">
          {dailyGoalMinutes} minutes a day
        </AppText>
      </Card>

      <Card style={styles.reminderCard}>
        <View style={styles.reminderHead}>
          <View style={styles.row}>
            <Ionicons name="notifications-outline" size={20} color={colors.secondary} />
            <AppText variant="bodyStrong">Daily reminder</AppText>
          </View>
          <Switch
            value={reminderEnabled}
            onValueChange={toggleReminder}
            trackColor={{ true: colors.secondary, false: colors.well }}
            thumbColor={colors.text}
          />
        </View>

        {reminderEnabled ? (
          <>
            <AppText variant="caption" color="textMuted">
              Reminding you at {formatTime(reminderHour, reminderMinute)}
            </AppText>
            <View style={styles.times}>
              {TIME_PRESETS.map((t) => {
                const active = t.hour === reminderHour && t.minute === reminderMinute;
                return (
                  <Pressable
                    key={`${t.hour}:${t.minute}`}
                    onPress={() => pickTime(t.hour, t.minute)}
                    style={[styles.timeChip, active && styles.timeChipActive]}
                  >
                    <AppText variant="label" color={active ? 'textOnAccent' : 'textMuted'}>
                      {formatTime(t.hour, t.minute)}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
            <Button label="Send a test notification" variant="secondary" onPress={test} />
          </>
        ) : (
          <AppText variant="caption" color="textMuted">
            Turn on a gentle daily nudge to keep your streak going.
          </AppText>
        )}
      </Card>

      {isGuest ? (
        <Card style={styles.guestCard}>
          <AppText variant="bodyStrong">Save your progress</AppText>
          <AppText variant="caption" color="textMuted">
            Create a free account to keep your streak and progress across devices.
          </AppText>
          <Button label="Sign out & create account" variant="secondary" onPress={signOut} />
        </Card>
      ) : (
        <Button label="Sign out" variant="secondary" onPress={signOut} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  name: {
    textAlign: 'center',
  },
  subtitle: {
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
  reminderCard: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  reminderHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  times: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.well,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  guestCard: {
    gap: spacing.md,
  },
});
