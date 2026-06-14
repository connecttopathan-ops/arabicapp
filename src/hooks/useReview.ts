/**
 * useReview — the review queue.
 *
 * Combines learned items (from progress) with their schedule state to compute
 * what's due now, and persists updates after each answer. Works for signed-in
 * users (Supabase) and guests (local), chosen automatically.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLetters, useWords } from './useContent';
import { useAuth } from '@/context/AuthContext';
import { useProgress } from '@/context/ProgressContext';
import {
  loadReviewStates,
  saveReviewState,
  computeNext,
  reviewKey,
} from '@/services/reviewService';
import type { ReviewItem, ReviewState } from '@/types/content';

export function useReview() {
  const letters = useLetters();
  const words = useWords();
  const { session } = useAuth();
  const progress = useProgress();
  const userId = session?.user?.id ?? null;

  const [states, setStates] = useState<Record<string, ReviewState>>({});
  const [statesLoading, setStatesLoading] = useState(true);

  const reload = useCallback(async () => {
    setStatesLoading(true);
    try {
      setStates(await loadReviewStates(userId));
    } catch {
      // keep whatever we have
    } finally {
      setStatesLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const loading =
    statesLoading || letters.loading || words.loading || progress.loading;

  const due = useMemo<ReviewItem[]>(() => {
    if (loading) return [];
    const now = Date.now();
    const out: ReviewItem[] = [];

    letters.data.forEach((l) => {
      if (!progress.isLearned('letter', l.id)) return;
      const st = states[reviewKey('letter', l.id)] ?? null;
      if (!st || new Date(st.nextReviewAt).getTime() <= now) {
        out.push({ itemType: 'letter', itemId: l.id, content: l, state: st });
      }
    });
    words.data.forEach((w) => {
      if (!progress.isLearned('word', w.id)) return;
      const st = states[reviewKey('word', w.id)] ?? null;
      if (!st || new Date(st.nextReviewAt).getTime() <= now) {
        out.push({ itemType: 'word', itemId: w.id, content: w, state: st });
      }
    });
    return out;
  }, [loading, letters.data, words.data, states, progress]);

  const submit = useCallback(
    async (item: ReviewItem, correct: boolean) => {
      const sched = computeNext(item.state, correct);
      const newState: ReviewState = { itemType: item.itemType, itemId: item.itemId, ...sched };
      setStates((prev) => ({ ...prev, [reviewKey(item.itemType, item.itemId)]: newState }));
      try {
        await saveReviewState(userId, newState);
      } catch {
        // best-effort; local state already updated
      }
    },
    [userId],
  );

  return {
    loading,
    due,
    dueCount: due.length,
    submit,
    reload,
    allLetters: letters.data,
    allWords: words.data,
  };
}
