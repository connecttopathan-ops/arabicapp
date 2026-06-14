/**
 * Review service — SM-2 spaced-repetition scheduling and persistence.
 *
 * Scheduling state lives in the `review_state` table for signed-in users (RLS
 * keeps it private) and in local storage for guests. Due-item selection and the
 * question-building helper live here too so the UI stays thin.
 */
import { supabase } from '@/lib/supabase';
import { cacheGet, cacheSet } from '@/lib/cache';
import type {
  Letter,
  Word,
  LessonStep,
  StepOption,
  ReviewItem,
  ReviewState,
} from '@/types/content';

const GUEST_KEY = 'review_guest';

export function reviewKey(type: string, id: string): string {
  return `${type}:${id}`;
}

/**
 * SM-2 (simplified). Correct → interval grows (1 → 6 → ×ease) and ease nudges
 * up; wrong → repetition resets, ease drops (min 1.3), and it's due again soon.
 */
export function computeNext(
  prev: ReviewState | null,
  correct: boolean,
): Pick<ReviewState, 'easeFactor' | 'intervalDays' | 'repetition' | 'nextReviewAt'> {
  let ease = prev?.easeFactor ?? 2.5;
  let interval = prev?.intervalDays ?? 0;
  let repetition = prev?.repetition ?? 0;

  if (correct) {
    repetition += 1;
    if (repetition <= 1) interval = 1;
    else if (repetition === 2) interval = 6;
    else interval = Math.max(1, Math.round(interval * ease));
    ease = Math.min(3.0, ease + 0.1);
  } else {
    repetition = 0;
    interval = 0;
    ease = Math.max(1.3, ease - 0.2);
  }

  // interval 0 → come back very soon (10 min); otherwise N days out.
  const ms = interval > 0 ? interval * 86_400_000 : 10 * 60_000;
  return {
    easeFactor: ease,
    intervalDays: interval,
    repetition,
    nextReviewAt: new Date(Date.now() + ms).toISOString(),
  };
}

export async function loadReviewStates(
  userId: string | null,
): Promise<Record<string, ReviewState>> {
  if (userId) {
    const { data, error } = await supabase
      .from('review_state')
      .select('item_type, item_id, ease_factor, interval_days, repetition, next_review_at');
    if (error) throw error;
    const map: Record<string, ReviewState> = {};
    (data ?? []).forEach((r) => {
      const state: ReviewState = {
        itemType: r.item_type,
        itemId: String(r.item_id),
        easeFactor: r.ease_factor,
        intervalDays: r.interval_days,
        repetition: r.repetition,
        nextReviewAt: r.next_review_at,
      };
      map[reviewKey(state.itemType, state.itemId)] = state;
    });
    return map;
  }
  return (await cacheGet<Record<string, ReviewState>>(GUEST_KEY)) ?? {};
}

export async function saveReviewState(userId: string | null, state: ReviewState): Promise<void> {
  if (userId) {
    const now = new Date().toISOString();
    const { error } = await supabase.from('review_state').upsert(
      {
        user_id: userId,
        item_type: state.itemType,
        item_id: state.itemId,
        ease_factor: state.easeFactor,
        interval_days: state.intervalDays,
        repetition: state.repetition,
        next_review_at: state.nextReviewAt,
        last_reviewed_at: now,
        updated_at: now,
      },
      { onConflict: 'user_id,item_type,item_id' },
    );
    if (error) throw error;
    return;
  }
  const map = (await cacheGet<Record<string, ReviewState>>(GUEST_KEY)) ?? {};
  map[reviewKey(state.itemType, state.itemId)] = state;
  await cacheSet(GUEST_KEY, map);
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Turn a due item into a recall question (a synthetic LessonStep) so it can be
 * rendered by the existing StepChoice component. Randomly picks a multiple-
 * choice or listen-and-choose variant.
 */
export function buildReviewStep(
  item: ReviewItem,
  allLetters: Letter[],
  allWords: Word[],
): LessonStep {
  const listen = Math.random() < 0.5;

  if (item.itemType === 'letter') {
    const correct = item.content as Letter;
    const distractors = shuffle(allLetters.filter((l) => l.id !== correct.id)).slice(0, 3);
    const options: StepOption[] = shuffle([correct, ...distractors]).map((l) => ({
      id: l.id,
      arabic: l.letter,
      correct: l.id === correct.id,
    }));
    return {
      id: `rev-letter-${correct.id}`,
      seq: 0,
      type: listen ? 'listen_choose' : 'multiple_choice',
      prompt: listen
        ? 'Listen and tap the letter you hear.'
        : `Which letter makes the “${correct.transliteration ?? correct.name}” sound?`,
      options,
      itemType: 'letter',
      itemId: correct.id,
      item: correct,
    };
  }

  const correct = item.content as Word;
  const distractors = shuffle(allWords.filter((w) => w.id !== correct.id)).slice(0, 3);

  if (listen) {
    const options: StepOption[] = shuffle([correct, ...distractors]).map((w) => ({
      id: w.id,
      arabic: w.arabic,
      correct: w.id === correct.id,
    }));
    return {
      id: `rev-word-${correct.id}`,
      seq: 0,
      type: 'listen_choose',
      prompt: 'Listen and tap the word you hear.',
      options,
      itemType: 'word',
      itemId: correct.id,
      item: correct,
    };
  }

  const options: StepOption[] = shuffle([correct, ...distractors]).map((w) => ({
    id: w.id,
    label: w.english ?? '—',
    correct: w.id === correct.id,
  }));
  return {
    id: `rev-word-${correct.id}`,
    seq: 0,
    type: 'multiple_choice',
    prompt: 'What does this word mean?',
    options,
    itemType: 'word',
    itemId: correct.id,
    item: correct,
  };
}
