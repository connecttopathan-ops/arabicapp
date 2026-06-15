/**
 * Settings service — onboarding state and preferences (daily goal, placement).
 *
 * The "onboarded" flag is device-local (controls the first-run flow), so each
 * device shows onboarding once. The daily goal and placement also sync to
 * Supabase (`user_settings`) for signed-in users so preferences follow them.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { cacheGet, cacheSet } from '@/lib/cache';
import type { Placement, UserSettings } from '@/types/content';

const ONBOARDED_KEY = 'masar.onboarded';
const LOCAL_PREFS = 'settings'; // cache helper namespaces this

export const DEFAULT_GOAL_MINUTES = 10;

interface LocalPrefs {
  dailyGoalMinutes: number;
  placement: Placement | null;
}

export async function loadSettings(userId: string | null): Promise<UserSettings> {
  const onboarded = (await AsyncStorage.getItem(ONBOARDED_KEY)) === 'true';
  const local = (await cacheGet<LocalPrefs>(LOCAL_PREFS)) ?? null;

  let dailyGoalMinutes = local?.dailyGoalMinutes ?? DEFAULT_GOAL_MINUTES;
  let placement = local?.placement ?? null;

  if (userId) {
    try {
      const { data } = await supabase
        .from('user_settings')
        .select('daily_goal_minutes, placement')
        .eq('user_id', userId)
        .maybeSingle();
      if (data) {
        if (data.daily_goal_minutes != null) dailyGoalMinutes = data.daily_goal_minutes;
        if (data.placement != null) placement = data.placement;
      } else if (onboarded) {
        // First sign-in after onboarding on this device: push local prefs up.
        await supabase
          .from('user_settings')
          .upsert(
            {
              user_id: userId,
              onboarded: true,
              daily_goal_minutes: dailyGoalMinutes,
              placement,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' },
          );
      }
    } catch {
      // offline / not signed in — local values are fine
    }
  }

  return { onboarded, dailyGoalMinutes, placement };
}

export async function completeOnboarding(
  userId: string | null,
  dailyGoalMinutes: number,
  placement: Placement | null,
): Promise<void> {
  await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
  await cacheSet<LocalPrefs>(LOCAL_PREFS, { dailyGoalMinutes, placement });

  if (userId) {
    try {
      await supabase.from('user_settings').upsert(
        {
          user_id: userId,
          onboarded: true,
          daily_goal_minutes: dailyGoalMinutes,
          placement,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );
    } catch {
      // best-effort; saved locally
    }
  }
}
