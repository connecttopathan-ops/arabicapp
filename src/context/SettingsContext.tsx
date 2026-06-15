/**
 * SettingsContext — onboarding state + preferences, available app-wide.
 * Drives the first-run gate and exposes the daily goal / placement.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  loadSettings,
  completeOnboarding as persistOnboarding,
  DEFAULT_GOAL_MINUTES,
} from '@/services/settingsService';
import type { Placement, UserSettings } from '@/types/content';

interface SettingsContextValue extends UserSettings {
  loading: boolean;
  completeOnboarding: (dailyGoalMinutes: number, placement: Placement | null) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [settings, setSettings] = useState<UserSettings>({
    onboarded: false,
    dailyGoalMinutes: DEFAULT_GOAL_MINUTES,
    placement: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadSettings(userId)
      .then((s) => active && setSettings(s))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [userId]);

  const completeOnboarding = useCallback(
    async (dailyGoalMinutes: number, placement: Placement | null) => {
      setSettings({ onboarded: true, dailyGoalMinutes, placement });
      await persistOnboarding(userId, dailyGoalMinutes, placement);
    },
    [userId],
  );

  const value = useMemo<SettingsContextValue>(
    () => ({ ...settings, loading, completeOnboarding }),
    [settings, loading, completeOnboarding],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
