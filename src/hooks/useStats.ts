/**
 * useStats — loads the user's XP/level/streak and refreshes whenever the
 * screen regains focus (so it updates after a lesson or review).
 */
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { loadStats, levelInfo, type UserStats } from '@/services/statsService';

export function useStats() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [stats, setStats] = useState<UserStats>({ totalXp: 0, streak: 0, lastActivityDate: null });
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setStats(await loadStats(userId));
    } catch {
      // keep last-known values
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const info = levelInfo(stats.totalXp);

  return {
    loading,
    totalXp: stats.totalXp,
    streak: stats.streak,
    level: info.level,
    levelTitle: info.title,
    xpIntoLevel: info.xpIntoLevel,
    xpForLevel: info.xpForLevel,
    reload,
  };
}
