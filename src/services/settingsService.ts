/**
 * Settings service — onboarding state and preferences (daily goal, placement,
 * reminder time/toggle).
 *
 * The "onboarded" flag is device-local (controls the first-run flow). The daily
 * goal, placement, and reminder settings also sync to Supabase (`user_settings`)
 * for signed-in users so preferences follow them.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { cacheGet, cacheSet } from '@/lib/cache';
import type { Placement, UserSettings } from '@/types/content';

const ONBOARDED_KEY = 'masar.onboarded';
const LOCAL_PREFS = 'settings'; // cache helper namespaces this

export const DEFAULT_GOAL_MINUTES = 10;

/** A sensible evening default, nudged by how ambitious the daily goal is. */
export function defaultReminderTime(goalMinutes: number): { hour: number; minute: number } {
  if (goalMinutes >= 15) return { hour: 19, minute: 30 };
  if (goalMinutes <= 5) return { hour: 20, minute: 30 };
  return { hour: 20, minute: 0 };
}

interface LocalPrefs {
  dailyGoalMinutes: number;
  placement: Placement | null;
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
}

async function loadLocalPrefs(): Promise<LocalPrefs> {
  const local = await cacheGet<Partial<LocalPrefs>>(LOCAL_PREFS);
  const goal = local?.dailyGoalMinutes ?? DEFAULT_GOAL_MINUTES;
  const time = defaultReminderTime(goal);
  return {
    dailyGoalMinutes: goal,
    placement: local?.placement ?? null,
    reminderEnabled: local?.reminderEnabled ?? false,
    reminderHour: local?.reminderHour ?? time.hour,
    reminderMinute: local?.reminderMinute ?? time.minute,
  };
}

export async function loadSettings(userId: string | null): Promise<UserSettings> {
  const onboarded = (await AsyncStorage.getItem(ONBOARDED_KEY)) === 'true';
  const prefs = await loadLocalPrefs();

  if (userId) {
    try {
      const { data } = await supabase
        .from('user_settings')
        .select('daily_goal_minutes, placement, reminder_enabled, reminder_hour, reminder_minute')
        .eq('user_id', userId)
        .maybeSingle();
      if (data) {
        if (data.daily_goal_minutes != null) prefs.dailyGoalMinutes = data.daily_goal_minutes;
        if (data.placement != null) prefs.placement = data.placement;
        if (data.reminder_enabled != null) prefs.reminderEnabled = data.reminder_enabled;
        if (data.reminder_hour != null) prefs.reminderHour = data.reminder_hour;
        if (data.reminder_minute != null) prefs.reminderMinute = data.reminder_minute;
      } else if (onboarded) {
        await pushCloud(userId, prefs, true);
      }
    } catch {
      // offline — local values are fine
    }
  }

  return { onboarded, ...prefs };
}

async function pushCloud(userId: string, prefs: LocalPrefs, onboarded: boolean) {
  await supabase.from('user_settings').upsert(
    {
      user_id: userId,
      onboarded,
      daily_goal_minutes: prefs.dailyGoalMinutes,
      placement: prefs.placement,
      reminder_enabled: prefs.reminderEnabled,
      reminder_hour: prefs.reminderHour,
      reminder_minute: prefs.reminderMinute,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
}

export async function completeOnboarding(
  userId: string | null,
  dailyGoalMinutes: number,
  placement: Placement | null,
): Promise<void> {
  const time = defaultReminderTime(dailyGoalMinutes);
  const prefs: LocalPrefs = {
    dailyGoalMinutes,
    placement,
    reminderEnabled: false,
    reminderHour: time.hour,
    reminderMinute: time.minute,
  };
  await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
  await cacheSet<LocalPrefs>(LOCAL_PREFS, prefs);
  if (userId) {
    try {
      await pushCloud(userId, prefs, true);
    } catch {
      // best-effort
    }
  }
}

export async function saveReminder(
  userId: string | null,
  reminderEnabled: boolean,
  reminderHour: number,
  reminderMinute: number,
): Promise<void> {
  const prefs = await loadLocalPrefs();
  const next: LocalPrefs = { ...prefs, reminderEnabled, reminderHour, reminderMinute };
  await cacheSet<LocalPrefs>(LOCAL_PREFS, next);
  if (userId) {
    try {
      await supabase.from('user_settings').upsert(
        {
          user_id: userId,
          reminder_enabled: reminderEnabled,
          reminder_hour: reminderHour,
          reminder_minute: reminderMinute,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );
    } catch {
      // best-effort
    }
  }
}
