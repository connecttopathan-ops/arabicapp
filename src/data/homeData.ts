/**
 * Home tile configuration — the colour-coded topic tiles and where each links.
 *
 * This is static UI config (labels, colours, icons, destinations), not user
 * data. Live values (XP, streak, counts, next lesson) come from hooks.
 */
import type { HomeData } from '@/types/content';

export const homeData: HomeData = {
  topics: [
    {
      id: 'alphabet',
      title: 'Alphabet',
      subtitle: 'The 28 letters',
      icon: 'language-outline',
      tone: 'teal',
      route: '/course?tab=alphabet',
    },
    {
      id: 'letter-forms',
      title: 'Letter Forms',
      subtitle: 'Initial · medial · final',
      icon: 'shapes-outline',
      tone: 'saffron',
      route: '/course?tab=forms',
    },
    {
      id: 'word-breakdown',
      title: 'Word Breakdown',
      subtitle: 'See how words join',
      icon: 'git-merge-outline',
      tone: 'terracotta',
      route: '/course?tab=breakdown',
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary',
      subtitle: 'Everyday words',
      icon: 'book-outline',
      tone: 'indigo',
      route: '/course?tab=vocab',
    },
    {
      id: 'script-lesson',
      title: 'Sentences',
      subtitle: 'Read full sentences',
      icon: 'reader-outline',
      tone: 'aubergine',
      route: '/sentences',
    },
  ],
};
