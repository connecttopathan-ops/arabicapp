/**
 * Content service — the single seam between the UI and the data source.
 *
 * Letters and words are fetched from Supabase with an offline-first strategy:
 *   1. Try the network (Supabase).
 *   2. On success, cache the result on the device and return it.
 *   3. On failure (offline / error), return the last cached copy, or the
 *      bundled fallback that ships with the app.
 *
 * Each result is tagged with `source` so the UI can show an "offline" hint.
 * Home dashboard data is still local placeholder for now.
 */
import { supabase } from '@/lib/supabase';
import { cacheGet, cacheSet } from '@/lib/cache';
import { homeData } from '@/data/homeData';
import { fallbackLetters } from '@/data/letters';
import { fallbackWords } from '@/data/words';
import type {
  HomeData,
  Letter,
  Word,
  LetterForm,
  WordBreakdown,
} from '@/types/content';

export type ContentSource = 'network' | 'cache' | 'bundled';

export interface ContentResult<T> {
  data: T;
  source: ContentSource;
}

export async function getHomeData(): Promise<HomeData> {
  return homeData;
}

export async function getLetters(): Promise<ContentResult<Letter[]>> {
  try {
    const { data, error } = await supabase
      .from('letters')
      .select('id, position, name, letter, transliteration, forms, pronunciation, audio_url')
      .order('position', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('No letters returned');

    const letters: Letter[] = data.map((row) => ({
      id: String(row.id),
      position: row.position,
      name: row.name,
      letter: row.letter,
      transliteration: row.transliteration,
      forms: row.forms,
      pronunciation: row.pronunciation,
      audioUrl: row.audio_url ?? null,
    }));

    await cacheSet('letters', letters);
    return { data: letters, source: 'network' };
  } catch {
    const cached = await cacheGet<Letter[]>('letters');
    if (cached && cached.length > 0) return { data: cached, source: 'cache' };
    return { data: fallbackLetters, source: 'bundled' };
  }
}

export async function getWords(): Promise<ContentResult<Word[]>> {
  try {
    const { data, error } = await supabase
      .from('words')
      .select('id, arabic, transliteration, english, root, category, cefr_level, frequency_rank, audio_url')
      .order('frequency_rank', { ascending: true, nullsFirst: false });
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('No words returned');

    const words: Word[] = data.map((row) => ({
      id: String(row.id),
      arabic: row.arabic,
      transliteration: row.transliteration,
      english: row.english,
      root: row.root,
      category: row.category,
      cefrLevel: row.cefr_level,
      frequencyRank: row.frequency_rank,
      audioUrl: row.audio_url ?? null,
    }));

    await cacheSet('words', words);
    return { data: words, source: 'network' };
  } catch {
    const cached = await cacheGet<Word[]>('words');
    if (cached && cached.length > 0) return { data: cached, source: 'cache' };
    return { data: fallbackWords, source: 'bundled' };
  }
}

export async function getLetterForms(): Promise<ContentResult<LetterForm[]>> {
  try {
    const { data, error } = await supabase
      .from('letter_forms')
      .select('id, seq, name, sound, isolated, initial, medial, final, note, non_connector')
      .order('seq', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('No letter forms returned');

    const forms: LetterForm[] = data.map((row) => ({
      id: String(row.id),
      seq: row.seq,
      name: row.name,
      sound: row.sound,
      isolated: row.isolated,
      initial: row.initial,
      medial: row.medial,
      final: row.final,
      note: row.note,
      nonConnector: !!row.non_connector,
    }));

    await cacheSet('letter_forms', forms);
    return { data: forms, source: 'network' };
  } catch {
    const cached = await cacheGet<LetterForm[]>('letter_forms');
    if (cached && cached.length > 0) return { data: cached, source: 'cache' };
    return { data: [], source: 'bundled' };
  }
}

export async function getWordBreakdowns(): Promise<ContentResult<WordBreakdown[]>> {
  try {
    const { data, error } = await supabase
      .from('word_breakdowns')
      .select('id, seq, word_ar, translit, gloss_en, pieces')
      .order('seq', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('No word breakdowns returned');

    const breakdowns: WordBreakdown[] = data.map((row) => ({
      id: String(row.id),
      seq: row.seq,
      wordAr: row.word_ar,
      translit: row.translit,
      glossEn: row.gloss_en,
      pieces: Array.isArray(row.pieces) ? row.pieces : [],
    }));

    await cacheSet('word_breakdowns', breakdowns);
    return { data: breakdowns, source: 'network' };
  } catch {
    const cached = await cacheGet<WordBreakdown[]>('word_breakdowns');
    if (cached && cached.length > 0) return { data: cached, source: 'cache' };
    return { data: [], source: 'bundled' };
  }
}
