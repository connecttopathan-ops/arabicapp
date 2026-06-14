/**
 * Sentence service — example sentences and cloze (fill-in-the-blank) exercises.
 *
 * Reads from the `sentences` table. For cloze practice it also builds a pool of
 * distractor word-forms (other sentences' cloze targets) so questions can be
 * generated client-side — no SQL helper needed.
 */
import { supabase } from '@/lib/supabase';
import type { Sentence, LessonStep, StepOption } from '@/types/content';

const SENTENCE_COLS = 'id, word_id, arabic, transliteration, translation, cloze_target';

function mapSentence(r: any): Sentence {
  return {
    id: String(r.id),
    wordId: r.word_id ? String(r.word_id) : null,
    arabic: r.arabic,
    transliteration: r.transliteration,
    translation: r.translation,
    clozeTarget: r.cloze_target,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** The first example sentence for a word (used by the vocab "see in a sentence"). */
export async function getExampleSentence(wordId: string): Promise<Sentence | null> {
  try {
    const { data, error } = await supabase
      .from('sentences')
      .select(SENTENCE_COLS)
      .eq('word_id', wordId)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? mapSentence(data) : null;
  } catch {
    return null;
  }
}

export interface ClozeBatch {
  sentences: Sentence[];
  /** Distinct word-forms used as distractor options. */
  pool: string[];
}

/** Fetch a random batch of cloze-able sentences plus a distractor pool. */
export async function getClozeBatch(count = 10): Promise<ClozeBatch> {
  // Distinct cloze targets across the table → distractor pool.
  const { data: poolData } = await supabase.from('sentences').select('cloze_target').limit(500);
  const pool = [
    ...new Set(((poolData ?? []).map((r) => r.cloze_target).filter(Boolean) as string[])),
  ];

  // Pick a random window so sessions vary.
  const { count: total } = await supabase
    .from('sentences')
    .select('id', { count: 'exact', head: true });
  const n = total ?? 0;
  if (n === 0) return { sentences: [], pool };

  const windowSize = Math.min(n, Math.max(count * 4, count));
  const maxOffset = Math.max(0, n - windowSize);
  const offset = Math.floor(Math.random() * (maxOffset + 1));

  const { data } = await supabase
    .from('sentences')
    .select(SENTENCE_COLS)
    .range(offset, offset + windowSize - 1);

  const sentences = shuffle((data ?? []).map(mapSentence))
    // keep only ones we can actually blank
    .filter((s) => s.clozeTarget && s.arabic.includes(s.clozeTarget))
    .slice(0, count);

  return { sentences, pool };
}

/** Turn a sentence into a cloze multiple-choice step (rendered by StepChoice). */
export function buildClozeStep(sentence: Sentence, pool: string[]): LessonStep {
  const correct = sentence.clozeTarget ?? '';
  const distractors = shuffle(pool.filter((t) => t !== correct)).slice(0, 3);
  const options: StepOption[] = shuffle([correct, ...distractors]).map((t, i) => ({
    id: `opt-${i}-${t}`,
    arabic: t,
    correct: t === correct,
  }));
  return {
    id: `cloze-${sentence.id}`,
    seq: 0,
    type: 'multiple_choice',
    prompt: sentence.translation ?? '',
    options,
    itemType: 'word',
    itemId: sentence.wordId ?? '',
    item: null,
  };
}
