/**
 * The 28 letters of the Arabic alphabet — bundled offline fallback.
 *
 * This ships inside the app so the alphabet is available on the very first
 * launch and with no connection. Online, the same content is read from the
 * `letters` table (the database is the source of truth); the seed SQL for that
 * table mirrors this data.
 *
 * Note: six letters (ا د ذ ر ز و) only join on their right, so their initial
 * form equals the isolated form and the medial equals the final.
 */
import type { Letter } from '@/types/content';

export const fallbackLetters: Letter[] = [
  { id: 'l-01', position: 1, name: 'Alif', letter: 'ا', transliteration: 'ā / ʾ', forms: { isolated: 'ا', initial: 'ا', medial: 'ـا', final: 'ـا' }, pronunciation: 'long "a" as in "father"' },
  { id: 'l-02', position: 2, name: 'Bāʾ', letter: 'ب', transliteration: 'b', forms: { isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب' }, pronunciation: '"b" as in "book"' },
  { id: 'l-03', position: 3, name: 'Tāʾ', letter: 'ت', transliteration: 't', forms: { isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت' }, pronunciation: '"t" as in "top"' },
  { id: 'l-04', position: 4, name: 'Thāʾ', letter: 'ث', transliteration: 'th', forms: { isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث' }, pronunciation: '"th" as in "think"' },
  { id: 'l-05', position: 5, name: 'Jīm', letter: 'ج', transliteration: 'j', forms: { isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج' }, pronunciation: '"j" as in "jam"' },
  { id: 'l-06', position: 6, name: 'Ḥāʾ', letter: 'ح', transliteration: 'ḥ', forms: { isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح' }, pronunciation: 'breathy "h" from the throat' },
  { id: 'l-07', position: 7, name: 'Khāʾ', letter: 'خ', transliteration: 'kh', forms: { isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ' }, pronunciation: '"ch" as in Scottish "loch"' },
  { id: 'l-08', position: 8, name: 'Dāl', letter: 'د', transliteration: 'd', forms: { isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد' }, pronunciation: '"d" as in "door"' },
  { id: 'l-09', position: 9, name: 'Dhāl', letter: 'ذ', transliteration: 'dh', forms: { isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ' }, pronunciation: '"th" as in "this"' },
  { id: 'l-10', position: 10, name: 'Rāʾ', letter: 'ر', transliteration: 'r', forms: { isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر' }, pronunciation: 'rolled "r"' },
  { id: 'l-11', position: 11, name: 'Zāy', letter: 'ز', transliteration: 'z', forms: { isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز' }, pronunciation: '"z" as in "zoo"' },
  { id: 'l-12', position: 12, name: 'Sīn', letter: 'س', transliteration: 's', forms: { isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس' }, pronunciation: '"s" as in "see"' },
  { id: 'l-13', position: 13, name: 'Shīn', letter: 'ش', transliteration: 'sh', forms: { isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش' }, pronunciation: '"sh" as in "ship"' },
  { id: 'l-14', position: 14, name: 'Ṣād', letter: 'ص', transliteration: 'ṣ', forms: { isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص' }, pronunciation: 'emphatic "s"' },
  { id: 'l-15', position: 15, name: 'Ḍād', letter: 'ض', transliteration: 'ḍ', forms: { isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض' }, pronunciation: 'emphatic "d"' },
  { id: 'l-16', position: 16, name: 'Ṭāʾ', letter: 'ط', transliteration: 'ṭ', forms: { isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط' }, pronunciation: 'emphatic "t"' },
  { id: 'l-17', position: 17, name: 'Ẓāʾ', letter: 'ظ', transliteration: 'ẓ', forms: { isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ' }, pronunciation: 'emphatic "th" as in "this"' },
  { id: 'l-18', position: 18, name: 'ʿAyn', letter: 'ع', transliteration: 'ʿ', forms: { isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع' }, pronunciation: 'deep throaty sound' },
  { id: 'l-19', position: 19, name: 'Ghayn', letter: 'غ', transliteration: 'gh', forms: { isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ' }, pronunciation: 'like a gargled French "r"' },
  { id: 'l-20', position: 20, name: 'Fāʾ', letter: 'ف', transliteration: 'f', forms: { isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف' }, pronunciation: '"f" as in "fan"' },
  { id: 'l-21', position: 21, name: 'Qāf', letter: 'ق', transliteration: 'q', forms: { isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق' }, pronunciation: 'deep "k" from the back' },
  { id: 'l-22', position: 22, name: 'Kāf', letter: 'ك', transliteration: 'k', forms: { isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك' }, pronunciation: '"k" as in "key"' },
  { id: 'l-23', position: 23, name: 'Lām', letter: 'ل', transliteration: 'l', forms: { isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل' }, pronunciation: '"l" as in "lamp"' },
  { id: 'l-24', position: 24, name: 'Mīm', letter: 'م', transliteration: 'm', forms: { isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم' }, pronunciation: '"m" as in "moon"' },
  { id: 'l-25', position: 25, name: 'Nūn', letter: 'ن', transliteration: 'n', forms: { isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن' }, pronunciation: '"n" as in "noon"' },
  { id: 'l-26', position: 26, name: 'Hāʾ', letter: 'ه', transliteration: 'h', forms: { isolated: 'ه', initial: 'هـ', medial: 'ـهـ', final: 'ـه' }, pronunciation: '"h" as in "hat"' },
  { id: 'l-27', position: 27, name: 'Wāw', letter: 'و', transliteration: 'w / ū', forms: { isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو' }, pronunciation: '"w" or long "oo"' },
  { id: 'l-28', position: 28, name: 'Yāʾ', letter: 'ي', transliteration: 'y / ī', forms: { isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي' }, pronunciation: '"y" or long "ee"' },
];
