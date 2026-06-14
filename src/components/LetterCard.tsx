/**
 * LetterCard — a full-page alphabet flashcard (one per screen in the pager).
 *
 *  - Tap the card body  -> reveal the letter's name, sound, and pronunciation.
 *  - Tap the corner ring -> mark/unmark as learned.
 */
import { useState } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { ArabicText } from './ArabicText';
import { AppText } from './AppText';
import { LearnedToggle } from './LearnedToggle';
import { SpeakerButton } from './SpeakerButton';
import { playAudio } from '@/services/audioService';
import { colors, radius, spacing, elevation } from '@/theme';
import type { Letter } from '@/types/content';

interface LetterCardProps {
  letter: Letter;
  learned?: boolean;
  onToggleLearned?: () => void;
}

export function LetterCard({ letter, learned = false, onToggleLearned }: LetterCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Pressable
      onPress={() => setRevealed((r) => !r)}
      accessibilityRole="button"
      accessibilityLabel={`Letter ${letter.name}. Tap to ${revealed ? 'hide' : 'reveal'} details`}
      style={({ pressed }) => [
        styles.card,
        elevation.card,
        learned && styles.cardLearned,
        pressed && styles.pressed,
      ]}
    >
      <LearnedToggle learned={learned} onPress={onToggleLearned} style={styles.corner} />

      <View style={styles.center}>
        <ArabicText center style={styles.glyph}>
          {letter.letter}
        </ArabicText>

        <SpeakerButton
          onPress={() => playAudio({ audioUrl: letter.audioUrl, text: letter.letter })}
        />

        {revealed ? (
          <View style={styles.details}>
            <AppText variant="title" style={styles.lineCenter}>
              {letter.name}
            </AppText>
            {letter.transliteration ? (
              <AppText variant="bodyStrong" color="primary" style={styles.lineCenter}>
                {letter.transliteration}
              </AppText>
            ) : null}
            {letter.pronunciation ? (
              <AppText variant="body" color="textMuted" style={styles.lineCenter}>
                {letter.pronunciation}
              </AppText>
            ) : null}
          </View>
        ) : (
          <AppText variant="caption" color="textFaint" style={styles.hint}>
            Tap to reveal name & sound
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: spacing.xl,
    marginVertical: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing['2xl'],
    justifyContent: 'center',
  },
  cardLearned: {
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.96,
  },
  corner: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
  },
  center: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  glyph: {
    fontSize: 128,
    lineHeight: 168,
  },
  details: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  lineCenter: {
    textAlign: 'center',
  },
  hint: {
    textAlign: 'center',
  },
});
