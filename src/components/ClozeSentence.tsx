/**
 * ClozeSentence — renders an Arabic sentence right-to-left with one word either
 * blanked out or filled in.
 *
 * We split the original string at the cloze target and render before/blank/after
 * as inline <Text> within a single RTL parent, so the bidi algorithm keeps the
 * blank in the exact position where the word was removed. The blank itself is a
 * run of tatweel (kashida), which renders as a natural Arabic baseline line.
 */
import { Text, StyleSheet } from 'react-native';
import { colors, family } from '@/theme';

interface ClozeSentenceProps {
  arabic: string;
  target: string;
  /** When true, show the target word (filled, highlighted) instead of a blank. */
  filled?: boolean;
}

const BLANK = 'ـــــ'; // five tatweel characters

export function ClozeSentence({ arabic, target, filled = false }: ClozeSentenceProps) {
  const idx = target ? arabic.indexOf(target) : -1;

  if (idx === -1) {
    return (
      <Text style={styles.sentence} lang="ar">
        {arabic}
      </Text>
    );
  }

  const before = arabic.slice(0, idx);
  const after = arabic.slice(idx + target.length);

  return (
    <Text style={styles.sentence} lang="ar">
      {before}
      <Text style={styles.highlight}>{filled ? target : BLANK}</Text>
      {after}
    </Text>
  );
}

const styles = StyleSheet.create({
  sentence: {
    fontFamily: family.arabic,
    fontSize: 26,
    lineHeight: 48,
    color: colors.text,
    writingDirection: 'rtl',
    textAlign: 'center',
  },
  highlight: {
    fontFamily: family.arabicBold,
    color: colors.primary,
  },
});
