/**
 * LetterTile — a single alphabet cell: the isolated glyph with its name and
 * transliteration. Sized to sit in a multi-column grid.
 */
import { View, StyleSheet } from 'react-native';
import { ArabicText } from './ArabicText';
import { AppText } from './AppText';
import { colors, radius, spacing } from '@/theme';
import type { Letter } from '@/types/content';

export function LetterTile({ letter }: { letter: Letter }) {
  return (
    <View style={styles.tile}>
      <ArabicText variant="arabicLarge" center style={styles.glyph}>
        {letter.letter}
      </ArabicText>
      <AppText variant="label" numberOfLines={1}>
        {letter.name}
      </AppText>
      {letter.transliteration ? (
        <AppText variant="caption" color="textMuted" numberOfLines={1}>
          {letter.transliteration}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  glyph: {
    marginBottom: spacing.xs,
  },
});
