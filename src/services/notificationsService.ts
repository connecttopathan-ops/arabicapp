/**
 * Notifications service — local daily practice reminders (no push/server).
 *
 * Schedules a single repeating local notification at the user's chosen time.
 * Permission is requested gently from the UI (after onboarding / first streak),
 * not here. A test helper fires one notification a few seconds out so reminders
 * can be verified on-device.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Show reminders even when the app is foregrounded. Guarded so a module-load
// failure can never crash app startup.
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch {
  // ignore — notifications simply won't show a foreground banner
}

const CHANNEL_ID = 'reminders';

async function ensureChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Practice reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }
}

function triggerExtras() {
  return Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {};
}

/** Request notification permission. Returns true if granted. */
export async function ensurePermission(): Promise<boolean> {
  await ensureChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.status === 'granted') return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted || requested.status === 'granted';
}

function reminderBody(streak?: number): string {
  if (streak && streak > 0) {
    return `You're on a ${streak}-day streak 🔥 A few minutes of reading keeps it alive.`;
  }
  return 'A few minutes of Arabic reading goes a long way — let’s practice today.';
}

/** Schedule (or reschedule) the daily reminder at hour:minute. */
export async function scheduleDailyReminder(
  hour: number,
  minute: number,
  streak?: number,
): Promise<void> {
  await ensureChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to practice ✨',
      body: reminderBody(streak),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      ...triggerExtras(),
    },
  });
}

export async function cancelReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/** Fire a one-off notification ~8s out to verify delivery on-device. */
export async function sendTestNotification(): Promise<void> {
  await ensureChannel();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'MASAR test 🔔',
      body: 'Reminders are working. See you at practice time!',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 8,
      repeats: false,
      ...triggerExtras(),
    },
  });
}
