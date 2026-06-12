/**
 * Hardcoded placeholder content for the Home screen.
 *
 * This is the ONLY file that knows the literal values. When the Supabase
 * backend arrives, the content service stops importing from here and starts
 * querying the database instead — the types and the screens never change.
 */
import type { HomeData } from '@/types/content';

export const homeData: HomeData = {
  progress: {
    name: 'Pathan',
    streakDays: 5,
    level: 2,
    levelTitle: 'Beginner Reader',
    xp: 320,
    xpToNext: 500,
  },
  stats: {
    lettersLearned: 12,
    wordsLearned: 48,
    lessonsCompleted: 6,
  },
  continueLesson: {
    id: 'lesson-07',
    title: 'Sun & Moon Letters',
    arabicTitle: 'الحروف الشمسية',
    subtitle: 'Lesson 7 · Reading practice',
    progress: 0.4,
  },
  topics: [
    {
      id: 'alphabet',
      title: 'Alphabet',
      subtitle: 'The 28 letters',
      icon: 'language-outline',
      tone: 'teal',
    },
    {
      id: 'letter-forms',
      title: 'Letter Forms',
      subtitle: 'Initial · medial · final',
      icon: 'shapes-outline',
      tone: 'saffron',
    },
    {
      id: 'word-breakdown',
      title: 'Word Breakdown',
      subtitle: 'See how words join',
      icon: 'git-merge-outline',
      tone: 'terracotta',
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary',
      subtitle: 'Everyday words',
      icon: 'book-outline',
      tone: 'indigo',
    },
    {
      id: 'script-lesson',
      title: 'Script Lesson',
      subtitle: 'Read full sentences',
      icon: 'reader-outline',
      tone: 'aubergine',
    },
  ],
};
