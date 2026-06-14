/**
 * Starter vocabulary — bundled offline fallback, mirrored by the `words`
 * table seed SQL. The database is the source of truth online.
 */
import type { Word } from '@/types/content';

export const fallbackWords: Word[] = [
  { id: 'w-01', arabic: 'سَلَام', transliteration: 'salām', english: 'peace / hi', root: 'س ل م', category: 'greetings', cefrLevel: 'A1', frequencyRank: 1 },
  { id: 'w-02', arabic: 'مَرْحَبًا', transliteration: 'marḥaban', english: 'hello', root: 'ر ح ب', category: 'greetings', cefrLevel: 'A1', frequencyRank: 2 },
  { id: 'w-03', arabic: 'شُكْرًا', transliteration: 'shukran', english: 'thank you', root: 'ش ك ر', category: 'greetings', cefrLevel: 'A1', frequencyRank: 3 },
  { id: 'w-04', arabic: 'نَعَم', transliteration: 'naʿam', english: 'yes', root: null, category: 'basics', cefrLevel: 'A1', frequencyRank: 4 },
  { id: 'w-05', arabic: 'لا', transliteration: 'lā', english: 'no', root: null, category: 'basics', cefrLevel: 'A1', frequencyRank: 5 },
  { id: 'w-06', arabic: 'مَاء', transliteration: 'māʾ', english: 'water', root: 'م و ه', category: 'food & drink', cefrLevel: 'A1', frequencyRank: 6 },
  { id: 'w-07', arabic: 'خُبْز', transliteration: 'khubz', english: 'bread', root: 'خ ب ز', category: 'food & drink', cefrLevel: 'A1', frequencyRank: 7 },
  { id: 'w-08', arabic: 'بَيْت', transliteration: 'bayt', english: 'house', root: 'ب ي ت', category: 'home', cefrLevel: 'A1', frequencyRank: 8 },
  { id: 'w-09', arabic: 'كِتَاب', transliteration: 'kitāb', english: 'book', root: 'ك ت ب', category: 'objects', cefrLevel: 'A1', frequencyRank: 9 },
  { id: 'w-10', arabic: 'مَدْرَسَة', transliteration: 'madrasa', english: 'school', root: 'د ر س', category: 'places', cefrLevel: 'A1', frequencyRank: 10 },
  { id: 'w-11', arabic: 'أُمّ', transliteration: 'umm', english: 'mother', root: 'أ م م', category: 'family', cefrLevel: 'A1', frequencyRank: 11 },
  { id: 'w-12', arabic: 'أَب', transliteration: 'ab', english: 'father', root: 'أ ب و', category: 'family', cefrLevel: 'A1', frequencyRank: 12 },
  { id: 'w-13', arabic: 'صَدِيق', transliteration: 'ṣadīq', english: 'friend', root: 'ص د ق', category: 'people', cefrLevel: 'A2', frequencyRank: 13 },
  { id: 'w-14', arabic: 'كَبِير', transliteration: 'kabīr', english: 'big', root: 'ك ب ر', category: 'adjectives', cefrLevel: 'A2', frequencyRank: 14 },
  { id: 'w-15', arabic: 'صَغِير', transliteration: 'ṣaghīr', english: 'small', root: 'ص غ ر', category: 'adjectives', cefrLevel: 'A2', frequencyRank: 15 },
  { id: 'w-16', arabic: 'يَوْم', transliteration: 'yawm', english: 'day', root: 'ي و م', category: 'time', cefrLevel: 'A1', frequencyRank: 16 },
];
