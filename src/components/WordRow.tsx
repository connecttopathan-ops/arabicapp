/**
 * WordRow — a vocabulary flashcard row.
 *
 * Two separate interactions:
 *  - Tap the row body    -> reveal the transliteration and English meaning.
 *  - Tap the corner ring -> mark/unmark as learned (gold ring + check).
 *
 * Collapsed, it shows just the Arabic (the "front" of the card).
 */
import { useState } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { ArabicText } from './ArabicText';
import { AppText } from './AppText';
import { LearnedToggle } from './LearnedToggle';
import { colors, radius, spacing } from '@/theme';
import type { Word } from '@/types/content';

interface WordRowProps {
  word: Word;
  learned?: boolean;
  onToggleLearned?: () => void;
}

export function WordRow({ word, learned = false, onToggleLearned }: WordRowProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Pressable
      onPress={() => setRevealed((r) => !r)}
      accessibilityRole="button"
      accessibilityLabel={`Word. Tap to ${revealed ? 'hide' : 'reveal'} meaning`}
      style={({ pressed }) => [
        styles.row,
        learned && styles.rowLearned,
        pressed && styles.pressed,
      ]}
    >
      <LearnedToggle learned={learned} onPress={onToggleLearned} />

      <View style={styles.left}>
        {revealed ? (
          <>
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
          </>
        ) : (
          <AppText variant="caption" color="textFaint">
            Tap to reveal
          </AppText>
        )}
      </View>

      <ArabicText variant="arabicBody" style={styles.arabic} numberOfLines={1}>
        {word.arabic}
      </ArabicText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  rowLearned: {
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.85,
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
    minWidth: 70,
  },
});
