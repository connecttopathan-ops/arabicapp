/**
 * Stats service — user-level aggregates: total XP, level, and daily streak.
 *
 * Stored in `user_stats` for signed-in users (RLS-private) and locally for
 * guests. XP is added when lessons are completed and review sessions finish;
 * the streak counts consecutive days with any activity.
 */
import { supabase } from '@/lib/supabase';
import { cacheGet, cacheSet } from '@/lib/cache';

const GUEST_KEY = 'stats_guest';

export const XP_PER_LEVEL = 200;
export const REVIEW_XP_PER_CORRECT = 5;

export interface UserStats {
  totalXp: number;
  streak: number;
  /** Local date (YYYY-MM-DD) of the last activity, or null. */
  lastActivityDate: string | null;
}

const EMPTY: UserStats = { totalXp: 0, streak: 0, lastActivityDate: null };

const LEVEL_TITLES = [
  'New Learner',
  'Beginner Reader',
  'Letter Explorer',
  'Word Builder',
  'Confident Reader',
  'Fluent Reader',
];

export function levelInfo(totalXp: number) {
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = totalXp % XP_PER_LEVEL;
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] ?? 'Reader';
  return { level, xpIntoLevel, xpForLevel: XP_PER_LEVEL, title };
}

function localDate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysBetween(from: string, to: string): number {
  const a = new Date(`${from}T00:00:00`).getTime();
  const b = new Date(`${to}T00:00:00`).getTime();
  return Math.round((b - a) / 86_400_000);
}

export async function loadStats(userId: string | null): Promise<UserStats> {
  if (userId) {
    const { data, error } = await supabase
      .from('user_stats')
      .select('total_xp, streak_count, last_activity_date')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return EMPTY;
    return {
      totalXp: data.total_xp ?? 0,
      streak: data.streak_count ?? 0,
      lastActivityDate: data.last_activity_date ?? null,
    };
  }
  return (await cacheGet<UserStats>(GUEST_KEY)) ?? EMPTY;
}

async function saveStats(userId: string | null, stats: UserStats): Promise<void> {
  if (userId) {
    const { error } = await supabase.from('user_stats').upsert(
      {
        user_id: userId,
        total_xp: stats.totalXp,
        streak_count: stats.streak,
        last_activity_date: stats.lastActivityDate,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
    if (error) throw error;
    return;
  }
  await cacheSet(GUEST_KEY, stats);
}

/**
 * Record an activity (finishing a lesson or a review session). Adds XP and
 * updates the streak: +1 if the last activity was yesterday, unchanged if it
 * was already today, reset to 1 if a day was missed (or first ever).
 */
export async function recordActivity(
  userId: string | null,
  xpDelta: number,
): Promise<UserStats> {
  const prev = await loadStats(userId);
  const today = localDate();

  let streak: number;
  if (prev.lastActivityDate === today) {
    streak = Math.max(prev.streak, 1); // already counted today
  } else if (prev.lastActivityDate && daysBetween(prev.lastActivityDate, today) === 1) {
    streak = prev.streak + 1;
  } else {
    streak = 1; // first activity or a day was missed
  }

  const next: UserStats = {
    totalXp: prev.totalXp + Math.max(0, xpDelta),
    streak,
    lastActivityDate: today,
  };
  await saveStats(userId, next);
  return next;
}
