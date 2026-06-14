/**
 * StepIntro — introduces a letter or word: shows it large with its name and
 * sound/meaning, plays audio, and a Continue button to advance.
 */
import { View, StyleSheet } from 'react-native';
import { ArabicText } from './ArabicText';
import { AppText } from './AppText';
import { Button } from './Button';
import { SpeakerButton } from './SpeakerButton';
import { playAudio } from '@/services/audioService';
import { colors, radius, spacing } from '@/theme';
import type { LessonStep, Letter, Word } from '@/types/content';

export function StepIntro({ step, onNext }: { step: LessonStep; onNext: () => void }) {
  const isLetter = step.itemType === 'letter';
  const letter = isLetter ? (step.item as Letter | null) : null;
  const word = !isLetter ? (step.item as Word | null) : null;

  const glyph = letter ? letter.letter : word ? word.arabic : '';
  const title = letter ? letter.name : word?.english ?? '';
  const sound = letter
    ? [letter.transliteration, letter.pronunciation].filter(Boolean).join(' · ')
    : word?.transliteration ?? '';

  function speak() {
    if (!step.item) return;
    playAudio({ audioUrl: step.item.audioUrl, text: glyph });
  }

  return (
    <View style={styles.wrap}>
      {step.prompt ? (
        <AppText variant="body" color="textMuted" style={styles.prompt}>
          {step.prompt}
        </AppText>
      ) : null}

      <View style={styles.card}>
        <ArabicText center style={isLetter ? styles.glyph : styles.word}>
          {glyph}
        </ArabicText>
        <SpeakerButton onPress={speak} />
        {title ? (
          <AppText variant="title" style={styles.center}>
            {title}
          </AppText>
        ) : null}
        {sound ? (
          <AppText variant="bodyStrong" color="primary" style={styles.center}>
            {sound}
          </AppText>
        ) : null}
      </View>

      <Button label="Continue" onPress={onNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing['2xl'],
  },
  prompt: {
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius['2xl'],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
  },
  glyph: {
    fontSize: 120,
    lineHeight: 160,
  },
  word: {
    fontSize: 56,
    lineHeight: 96,
  },
  center: {
    textAlign: 'center',
  },
});
