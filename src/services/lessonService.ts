/**
 * Lesson service — loads lessons and their steps from Supabase.
 *
 * Each step references a letter/word by id; we resolve those into full content
 * objects so the player can render glyphs and play audio without extra lookups.
 * Offline-cached like the rest of the content (network -> device cache).
 */
import { supabase } from '@/lib/supabase';
import { cacheGet, cacheSet } from '@/lib/cache';
import type { ContentResult } from '@/services/contentService';
import type {
  Lesson,
  LessonStep,
  LessonWithSteps,
  Letter,
  Word,
} from '@/types/content';

const LETTER_COLS = 'id, position, name, letter, transliteration, forms, pronunciation, audio_url';
const WORD_COLS = 'id, arabic, transliteration, english, root, category, cefr_level, frequency_rank, audio_url';

function mapLetter(row: any): Letter {
  return {
    id: String(row.id),
    position: row.position,
    name: row.name,
    letter: row.letter,
    transliteration: row.transliteration,
    forms: row.forms,
    pronunciation: row.pronunciation,
    audioUrl: row.audio_url ?? null,
  };
}

function mapWord(row: any): Word {
  return {
    id: String(row.id),
    arabic: row.arabic,
    transliteration: row.transliteration,
    english: row.english,
    root: row.root,
    category: row.category,
    cefrLevel: row.cefr_level,
    frequencyRank: row.frequency_rank,
    audioUrl: row.audio_url ?? null,
  };
}

export async function getLessons(): Promise<ContentResult<Lesson[]>> {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('id, slug, title, subtitle, seq, xp')
      .order('seq', { ascending: true, nullsFirst: false });
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('No lessons returned');

    const lessons: Lesson[] = data.map((row) => ({
      id: String(row.id),
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle,
      seq: row.seq,
      xp: row.xp ?? 0,
    }));

    await cacheSet('lessons_list', lessons);
    return { data: lessons, source: 'network' };
  } catch {
    const cached = await cacheGet<Lesson[]>('lessons_list');
    if (cached && cached.length > 0) return { data: cached, source: 'cache' };
    return { data: [], source: 'bundled' };
  }
}

export async function getLessonWithSteps(
  lessonId: string,
): Promise<ContentResult<LessonWithSteps | null>> {
  try {
    const [lessonRes, stepRes] = await Promise.all([
      supabase.from('lessons').select('id, slug, title, subtitle, seq, xp').eq('id', lessonId).single(),
      supabase
        .from('lesson_steps')
        .select('id, seq, type, item_type, item_id, prompt, options')
        .eq('lesson_id', lessonId)
        .order('seq', { ascending: true }),
    ]);
    if (lessonRes.error) throw lessonRes.error;
    if (stepRes.error) throw stepRes.error;

    const rawSteps = stepRes.data ?? [];

    // Resolve referenced letters/words in one round-trip each.
    const letterIds = [
      ...new Set(rawSteps.filter((s) => s.item_type === 'letter' && s.item_id).map((s) => s.item_id)),
    ];
    const wordIds = [
      ...new Set(rawSteps.filter((s) => s.item_type === 'word' && s.item_id).map((s) => s.item_id)),
    ];

    const letterMap = new Map<string, Letter>();
    const wordMap = new Map<string, Word>();

    if (letterIds.length) {
      const { data } = await supabase.from('letters').select(LETTER_COLS).in('id', letterIds);
      (data ?? []).forEach((r) => letterMap.set(String(r.id), mapLetter(r)));
    }
    if (wordIds.length) {
      const { data } = await supabase.from('words').select(WORD_COLS).in('id', wordIds);
      (data ?? []).forEach((r) => wordMap.set(String(r.id), mapWord(r)));
    }

    const steps: LessonStep[] = rawSteps.map((s) => {
      const itemId = s.item_id ? String(s.item_id) : null;
      const item =
        s.item_type === 'letter' && itemId
          ? letterMap.get(itemId) ?? null
          : s.item_type === 'word' && itemId
            ? wordMap.get(itemId) ?? null
            : null;
      return {
        id: String(s.id),
        seq: s.seq,
        type: s.type,
        prompt: s.prompt,
        options: s.options ?? null,
        itemType: s.item_type ?? null,
        itemId,
        item,
      };
    });

    const l = lessonRes.data;
    const result: LessonWithSteps = {
      lesson: {
        id: String(l.id),
        slug: l.slug,
        title: l.title,
        subtitle: l.subtitle,
        seq: l.seq,
        xp: l.xp ?? 0,
      },
      steps,
    };

    await cacheSet(`lesson_${lessonId}`, result);
    return { data: result, source: 'network' };
  } catch {
    const cached = await cacheGet<LessonWithSteps>(`lesson_${lessonId}`);
    if (cached) return { data: cached, source: 'cache' };
    return { data: null, source: 'bundled' };
  }
}
