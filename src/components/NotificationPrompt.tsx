/**
 * NotificationPrompt — a gentle, one-time ask to enable daily reminders.
 * Shown on Home after onboarding (not on first launch). Dismissing or enabling
 * marks it seen so it won't reappear.
 */
import { useEffect, useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Button } from './Button';
import { useSettings } from '@/context/SettingsContext';
import { ensurePermission } from '@/services/notificationsService';
import { formatTime } from '@/lib/time';
import { colors, spacing, radius } from '@/theme';

const SEEN_KEY = 'masar.reminderPromptSeen';

export function NotificationPrompt() {
  const { loading, onboarded, reminderEnabled, reminderHour, reminderMinute, updateReminder } =
    useSettings();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading || !onboarded || reminderEnabled) return;
    let active = true;
    AsyncStorage.getItem(SEEN_KEY).then((seen) => {
      if (active && !seen) setVisible(true);
    });
    return () => {
      active = false;
    };
  }, [loading, onboarded, reminderEnabled]);

  async function dismiss() {
    await AsyncStorage.setItem(SEEN_KEY, 'true');
    setVisible(false);
  }

  async function enable() {
    const granted = await ensurePermission();
    if (granted) await updateReminder(true, reminderHour, reminderMinute);
    await dismiss();
  }

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible onRequestClose={dismiss}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name="notifications" size={28} color={colors.primary} />
          </View>
          <AppText variant="title" style={styles.center}>
            Keep your streak alive
          </AppText>
          <AppText variant="body" color="textMuted" style={styles.center}>
            A gentle daily reminder helps the habit stick. We'll nudge you once a day
            around {formatTime(reminderHour, reminderMinute)} — never more.
          </AppText>
          <View style={styles.actions}>
            <Button label="Turn on reminders" onPress={enable} />
            <Button label="Not now" variant="ghost" onPress={dismiss} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius['2xl'],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing['2xl'],
    gap: spacing.md,
    alignItems: 'center',
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.well,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  center: {
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
