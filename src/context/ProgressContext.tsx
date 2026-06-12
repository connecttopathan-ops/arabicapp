/**
 * ProgressContext — the app's live view of what the user has learned.
 *
 * Loads on launch (and whenever the account changes), exposes helpers to
 * check/toggle items, and persists every change via the progress service.
 * Toggling is optimistic: the UI updates instantly and rolls back if the
 * save fails.
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
import { loadProgress, persistLearned, progressKey } from '@/services/progressService';
import type { ProgressItemType } from '@/types/content';

interface ProgressContextValue {
  loading: boolean;
  isLearned: (type: ProgressItemType, id: string) => boolean;
  toggle: (type: ProgressItemType, id: string) => void;
  learnedCount: (type: ProgressItemType) => number;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { session, initializing } = useAuth();
  const signedIn = !!session;

  const [learnedKeys, setLearnedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // (Re)load whenever the account changes (sign in/out swaps the backend).
  useEffect(() => {
    if (initializing) return;
    let active = true;
    setLoading(true);
    loadProgress(signedIn)
      .then((keys) => {
        if (active) {
          setLearnedKeys(new Set(keys));
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [signedIn, initializing]);

  const isLearned = useCallback(
    (type: ProgressItemType, id: string) => learnedKeys.has(progressKey(type, id)),
    [learnedKeys],
  );

  const toggle = useCallback(
    (type: ProgressItemType, id: string) => {
      const key = progressKey(type, id);
      const willLearn = !learnedKeys.has(key);

      const next = new Set(learnedKeys);
      if (willLearn) next.add(key);
      else next.delete(key);
      setLearnedKeys(next);

      persistLearned(signedIn, type, id, willLearn, Array.from(next)).catch(() => {
        // Roll back on failure.
        setLearnedKeys((curr) => {
          const reverted = new Set(curr);
          if (willLearn) reverted.delete(key);
          else reverted.add(key);
          return reverted;
        });
      });
    },
    [learnedKeys, signedIn],
  );

  const learnedCount = useCallback(
    (type: ProgressItemType) => {
      let n = 0;
      const prefix = `${type}:`;
      for (const k of learnedKeys) if (k.startsWith(prefix)) n++;
      return n;
    },
    [learnedKeys],
  );

  const value = useMemo<ProgressContextValue>(
    () => ({ loading, isLearned, toggle, learnedCount }),
    [loading, isLearned, toggle, learnedCount],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
