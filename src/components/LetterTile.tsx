/**
 * LetterTile — an alphabet flashcard.
 *
 * Two separate interactions:
 *  - Tap the card body  -> reveal the letter's name, sound, and pronunciation.
 *  - Tap the corner ring -> mark/unmark as learned (gold ring + check).
 */
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ArabicText } from './ArabicText';
import { AppText } from './AppText';
import { LearnedToggle } from './LearnedToggle';
import { colors, radius, spacing } from '@/theme';
import type { Letter } from '@/types/content';

interface LetterTileProps {
  letter: Letter;
  learned?: boolean;
  onToggleLearned?: () => void;
}

export function LetterTile({ letter, learned = false, onToggleLearned }: LetterTileProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Pressable
      onPress={() => setRevealed((r) => !r)}
      accessibilityRole="button"
      accessibilityLabel={`${letter.name}. Tap to ${revealed ? 'hide' : 'reveal'} details`}
      style={({ pressed }) => [
        styles.tile,
        learned && styles.tileLearned,
        pressed && styles.pressed,
      ]}
    >
      <LearnedToggle learned={learned} onPress={onToggleLearned} style={styles.corner} />

      <ArabicText variant="arabicLarge" center style={styles.glyph}>
        {letter.letter}
      </ArabicText>

      {revealed ? (
        <>
          <AppText variant="label" style={styles.center} numberOfLines={1}>
            {letter.name}
          </AppText>
          {letter.transliteration ? (
            <AppText variant="caption" color="primary" style={styles.center}>
              {letter.transliteration}
            </AppText>
          ) : null}
          {letter.pronunciation ? (
            <AppText variant="caption" color="textMuted" style={styles.center}>
              {letter.pronunciation}
            </AppText>
          ) : null}
        </>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  tileLearned: {
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  glyph: {
    marginBottom: spacing.xs,
  },
  center: {
    textAlign: 'center',
  },
  corner: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
});
