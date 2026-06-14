/**
 * Domain types for MASAR content.
 *
 * These describe the *shape* of data the UI consumes. They are deliberately
 * decoupled from where the data comes from — today it's hardcoded, tomorrow
 * it's Supabase. Keep these stable and the rest of the app barely changes.
 */
import type { JewelTone } from '@/theme';
import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

/** Any valid Ionicons glyph name (gives us autocomplete + type safety). */
export type IconName = ComponentProps<typeof Ionicons>['name'];

export interface UserProgress {
  /** Display name used in the welcome message. */
  name: string;
  /** Consecutive days studied. */
  streakDays: number;
  /** Current level number. */
  level: number;
  /** Human label for the level, e.g. "Beginner Reader". */
  levelTitle: string;
  /** XP earned toward the current level. */
  xp: number;
  /** XP required to reach the next level. */
  xpToNext: number;
}

export interface StatSummary {
  lettersLearned: number;
  wordsLearned: number;
  lessonsCompleted: number;
}

export interface ContinueLesson {
  id: string;
  title: string;
  /** Arabic title, rendered RTL in Naskh. */
  arabicTitle: string;
  subtitle: string;
  /** Completion ratio from 0 to 1. */
  progress: number;
}

export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  tone: JewelTone;
}

/** The full payload the Home screen needs. One fetch, everything below. */
export interface HomeData {
  progress: UserProgress;
  stats: StatSummary;
  continueLesson: ContinueLesson;
  topics: Topic[];
}

/** The four positional shapes an Arabic letter takes when joined. */
export interface LetterForms {
  isolated: string;
  initial: string;
  medial: string;
  final: string;
}

/** A row from the `letters` table. */
export interface Letter {
  id: string;
  position: number;
  name: string;
  /** Isolated glyph, e.g. "ب". */
  letter: string;
  transliteration: string | null;
  forms: LetterForms | null;
  pronunciation: string | null;
  /** Optional recorded audio (falls back to device TTS when absent). */
  audioUrl?: string | null;
}

/** The kinds of item a user can mark as learned (matches user_progress). */
export type ProgressItemType = 'letter' | 'word' | 'sentence' | 'lesson';

/** A guided lesson (a sequence of steps). */
export interface Lesson {
  id: string;
  slug: string | null;
  title: string;
  subtitle: string | null;
  seq: number | null;
  xp: number;
}

export type LessonStepType = 'intro' | 'trace' | 'multiple_choice' | 'listen_choose';

/** A choice in a multiple-choice / listen-and-choose step. */
export interface StepOption {
  id: string;
  arabic?: string | null;
  label?: string | null;
  correct?: boolean;
}

/** A single step within a lesson, with its referenced content resolved. */
export interface LessonStep {
  id: string;
  seq: number;
  type: LessonStepType;
  prompt: string | null;
  options: StepOption[] | null;
  itemType: 'letter' | 'word' | null;
  itemId: string | null;
  /** The resolved letter/word this step is about (for display + audio). */
  item: Letter | Word | null;
}

export interface LessonWithSteps {
  lesson: Lesson;
  steps: LessonStep[];
}

/** A row from the `letter_forms` table — a letter's four positional shapes. */
export interface LetterForm {
  id: string;
  seq: number;
  name: string;
  sound: string | null;
  isolated: string;
  initial: string;
  medial: string;
  final: string;
  note: string | null;
  /** True for the six letters that never join to the following letter. */
  nonConnector: boolean;
}

/** One glyph-piece of a word: glyph, letter name, position label. */
export interface WordPiece {
  g: string;
  n: string;
  p: string;
}

/** A row from the `word_breakdowns` table. */
export interface WordBreakdown {
  id: string;
  seq: number;
  wordAr: string;
  translit: string | null;
  glossEn: string | null;
  /** Pieces in right-to-left reading order. */
  pieces: WordPiece[];
}

/** A row from the `words` table. */
export interface Word {
  id: string;
  /** Arabic with harakat. */
  arabic: string;
  transliteration: string | null;
  english: string | null;
  root: string | null;
  category: string | null;
  cefrLevel: string | null;
  frequencyRank: number | null;
  /** Optional recorded audio (falls back to device TTS when absent). */
  audioUrl?: string | null;
}
