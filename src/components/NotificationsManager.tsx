/**
 * NotificationsManager — keeps the scheduled daily reminder in sync with the
 * user's settings. Renders nothing; mounted once near the app root.
 */
import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { loadStats } from '@/services/statsService';
import { scheduleDailyReminder, cancelReminders } from '@/services/notificationsService';

export function NotificationsManager() {
  const { loading, reminderEnabled, reminderHour, reminderMinute } = useSettings();
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  useEffect(() => {
    if (loading) return;
    let active = true;

    (async () => {
      if (!reminderEnabled) {
        await cancelReminders().catch(() => {});
        return;
      }
      let streak = 0;
      try {
        streak = (await loadStats(userId)).streak;
      } catch {
        // no stats yet — generic message
      }
      if (active) {
        await scheduleDailyReminder(reminderHour, reminderMinute, streak).catch(() => {});
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, reminderEnabled, reminderHour, reminderMinute, userId]);

  return null;
}
