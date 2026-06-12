/**
 * WordRow — one vocabulary entry: Arabic on the right, transliteration and
 * English gloss on the left, with a small CEFR-level chip.
 */
import { View, StyleSheet } from 'react-native';
import { ArabicText } from './ArabicText';
import { AppText } from './AppText';
import { colors, radius, spacing } from '@/theme';
import type { Word } from '@/types/content';

export function WordRow({ word }: { word: Word }) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.glossRow}>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {word.english ?? '—'}
          </AppText>
          {word.cefrLevel ? (
            <View style={styles.chip}>
              <AppText variant="overline" color="secondary">
                {word.cefrLevel}
              </AppText>
            </View>
          ) : null}
        </View>
        {word.transliteration ? (
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {word.transliteration}
            {word.category ? ` · ${word.category}` : ''}
          </AppText>
        ) : null}
      </View>

      <ArabicText variant="arabicBody" style={styles.arabic} numberOfLines={1}>
        {word.arabic}
      </ArabicText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  left: {
    flex: 1,
    gap: 2,
  },
  glossRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.well,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  arabic: {
    minWidth: 80,
  },
});
