/**
 * Settings service — onboarding state and preferences.
 *
 * The "onboarded" flag is device-local (controls the first-run flow). All other
 * preferences (daily goal, placement, reminder, transliteration, audio, theme)
 * persist locally and sync to Supabase (`user_settings`) for signed-in users.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { cacheGet, cacheSet } from '@/lib/cache';
import type { Placement, ThemePreference, UserSettings } from '@/types/content';

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
  transliterationEnabled: boolean;
  audioEnabled: boolean;
  theme: ThemePreference;
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
    transliterationEnabled: local?.transliterationEnabled ?? true,
    audioEnabled: local?.audioEnabled ?? true,
    theme: local?.theme ?? 'dark',
  };
}

/** Map camelCase prefs to the snake_case `user_settings` columns. */
function toCloud(partial: Partial<LocalPrefs>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if ('dailyGoalMinutes' in partial) out.daily_goal_minutes = partial.dailyGoalMinutes;
  if ('placement' in partial) out.placement = partial.placement;
  if ('reminderEnabled' in partial) out.reminder_enabled = partial.reminderEnabled;
  if ('reminderHour' in partial) out.reminder_hour = partial.reminderHour;
  if ('reminderMinute' in partial) out.reminder_minute = partial.reminderMinute;
  if ('transliterationEnabled' in partial) out.transliteration_enabled = partial.transliterationEnabled;
  if ('audioEnabled' in partial) out.audio_enabled = partial.audioEnabled;
  if ('theme' in partial) out.theme = partial.theme;
  return out;
}

export async function loadSettings(userId: string | null): Promise<UserSettings> {
  const onboarded = (await AsyncStorage.getItem(ONBOARDED_KEY)) === 'true';
  const prefs = await loadLocalPrefs();

  if (userId) {
    try {
      const { data } = await supabase
        .from('user_settings')
        .select(
          'daily_goal_minutes, placement, reminder_enabled, reminder_hour, reminder_minute, transliteration_enabled, audio_enabled, theme',
        )
        .eq('user_id', userId)
        .maybeSingle();
      if (data) {
        if (data.daily_goal_minutes != null) prefs.dailyGoalMinutes = data.daily_goal_minutes;
        if (data.placement != null) prefs.placement = data.placement;
        if (data.reminder_enabled != null) prefs.reminderEnabled = data.reminder_enabled;
        if (data.reminder_hour != null) prefs.reminderHour = data.reminder_hour;
        if (data.reminder_minute != null) prefs.reminderMinute = data.reminder_minute;
        if (data.transliteration_enabled != null)
          prefs.transliterationEnabled = data.transliteration_enabled;
        if (data.audio_enabled != null) prefs.audioEnabled = data.audio_enabled;
        if (data.theme != null) prefs.theme = data.theme;
      } else if (onboarded) {
        await supabase
          .from('user_settings')
          .upsert(
            { user_id: userId, onboarded: true, ...toCloud(prefs), updated_at: new Date().toISOString() },
            { onConflict: 'user_id' },
          );
      }
    } catch {
      // offline — local values are fine
    }
  }

  return { onboarded, ...prefs };
}

export async function completeOnboarding(
  userId: string | null,
  dailyGoalMinutes: number,
  placement: Placement | null,
): Promise<void> {
  const time = defaultReminderTime(dailyGoalMinutes);
  const prefs = await loadLocalPrefs();
  const next: LocalPrefs = {
    ...prefs,
    dailyGoalMinutes,
    placement,
    reminderHour: time.hour,
    reminderMinute: time.minute,
  };
  await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
  await cacheSet<LocalPrefs>(LOCAL_PREFS, next);
  if (userId) {
    try {
      await supabase
        .from('user_settings')
        .upsert(
          { user_id: userId, onboarded: true, ...toCloud(next), updated_at: new Date().toISOString() },
          { onConflict: 'user_id' },
        );
    } catch {
      // best-effort
    }
  }
}

/** Merge a partial preference change into local storage (and cloud if signed in). */
export async function updateSettings(
  userId: string | null,
  partial: Partial<LocalPrefs>,
): Promise<void> {
  const prefs = await loadLocalPrefs();
  const next = { ...prefs, ...partial };
  await cacheSet<LocalPrefs>(LOCAL_PREFS, next);
  if (userId) {
    try {
      await supabase
        .from('user_settings')
        .upsert(
          { user_id: userId, ...toCloud(partial), updated_at: new Date().toISOString() },
          { onConflict: 'user_id' },
        );
    } catch {
      // best-effort
    }
  }
}
