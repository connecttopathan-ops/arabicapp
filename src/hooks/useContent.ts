/**
 * Hooks that load content via the content service.
 *
 * Each exposes { data, loading, error, offline } where `offline` is true when
 * the data came from the device cache or the bundled fallback (i.e. not fresh
 * from the network) — handy for showing an "offline" hint.
 */
import { useEffect, useState } from 'react';
import {
  getLetters,
  getWords,
  getLetterForms,
  getWordBreakdowns,
  type ContentSource,
} from '@/services/contentService';
import { getLessons, getLessonWithSteps } from '@/services/lessonService';
import type {
  Letter,
  Word,
  LetterForm,
  WordBreakdown,
  Lesson,
  LessonWithSteps,
} from '@/types/content';

interface ContentState<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  offline: boolean;
}

function useContent<T>(
  loader: () => Promise<{ data: T; source: ContentSource }>,
  initial: T,
): ContentState<T> {
  const [state, setState] = useState<ContentState<T>>({
    data: initial,
    loading: true,
    error: null,
    offline: false,
  });

  useEffect(() => {
    let active = true;
    loader()
      .then(({ data, source }) => {
        if (active) {
          setState({ data, loading: false, error: null, offline: source !== 'network' });
        }
      })
      .catch((error: Error) => {
        if (active) setState((s) => ({ ...s, loading: false, error }));
      });
    return () => {
      active = false;
    };
    // loader identity is stable (module function); run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}

export function useLetters() {
  return useContent<Letter[]>(getLetters, []);
}

export function useWords() {
  return useContent<Word[]>(getWords, []);
}

export function useLetterForms() {
  return useContent<LetterForm[]>(getLetterForms, []);
}

export function useWordBreakdowns() {
  return useContent<WordBreakdown[]>(getWordBreakdowns, []);
}

export function useLessons() {
  return useContent<Lesson[]>(getLessons, []);
}

/** Loads a single lesson (with steps); reloads if the id changes. */
export function useLesson(id: string) {
  const [state, setState] = useState<ContentState<LessonWithSteps | null>>({
    data: null,
    loading: true,
    error: null,
    offline: false,
  });

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true }));
    getLessonWithSteps(id)
      .then(({ data, source }) => {
        if (active) {
          setState({ data, loading: false, error: null, offline: source !== 'network' });
        }
      })
      .catch((error: Error) => {
        if (active) setState((s) => ({ ...s, loading: false, error }));
      });
    return () => {
      active = false;
    };
  }, [id]);

  return state;
}
