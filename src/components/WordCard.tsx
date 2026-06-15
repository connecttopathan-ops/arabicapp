/**
 * WordCard — a full-page vocabulary flashcard (one per screen in the pager).
 *
 *  - Tap the card body  -> reveal the transliteration and English meaning.
 *  - Tap the corner ring -> mark/unmark as learned.
 *
 * Collapsed, it shows just the Arabic word (the "front" of the card).
 */
import { useState } from 'react';
import { Pressable, View, ActivityIndicator, StyleSheet } from 'react-native';
import { ArabicText } from './ArabicText';
import { AppText } from './AppText';
import { LearnedToggle } from './LearnedToggle';
import { SpeakerButton } from './SpeakerButton';
import { playAudio } from '@/services/audioService';
import { getExampleSentence } from '@/services/sentenceService';
import { useSettings } from '@/context/SettingsContext';
import { colors, radius, spacing, elevation } from '@/theme';
import type { Word, Sentence } from '@/types/content';

interface WordCardProps {
  word: Word;
  learned?: boolean;
  onToggleLearned?: () => void;
}

export function WordCard({ word, learned = false, onToggleLearned }: WordCardProps) {
  const { transliterationEnabled } = useSettings();
  const [revealed, setRevealed] = useState(false);
  const [showSentence, setShowSentence] = useState(false);
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [sentenceLoaded, setSentenceLoaded] = useState(false);
  const [sentenceLoading, setSentenceLoading] = useState(false);

  const meta = [word.category, word.root].filter(Boolean).join(' · ');

  async function revealSentence() {
    setShowSentence(true);
    if (sentenceLoaded || sentenceLoading) return;
    setSentenceLoading(true);
    const s = await getExampleSentence(word.id);
    setSentence(s);
    setSentenceLoaded(true);
    setSentenceLoading(false);
  }

  return (
    <Pressable
      onPress={() => setRevealed((r) => !r)}
      accessibilityRole="button"
      accessibilityLabel={`Word. Tap to ${revealed ? 'hide' : 'reveal'} meaning`}
      style={({ pressed }) => [
        styles.card,
        elevation.card,
        learned && styles.cardLearned,
        pressed && styles.pressed,
      ]}
    >
      <LearnedToggle learned={learned} onPress={onToggleLearned} style={styles.corner} />

      {word.cefrLevel ? (
        <View style={styles.chip}>
          <AppText variant="overline" color="secondary">
            {word.cefrLevel}
          </AppText>
        </View>
      ) : null}

      <View style={styles.center}>
        <ArabicText center style={styles.word}>
          {word.arabic}
        </ArabicText>

        <SpeakerButton
          onPress={() => playAudio({ audioUrl: word.audioUrl, text: word.arabic })}
        />

        {revealed ? (
          <View style={styles.details}>
            <AppText variant="title" style={styles.lineCenter}>
              {word.english ?? '—'}
            </AppText>
            {word.transliteration && transliterationEnabled ? (
              <AppText variant="bodyStrong" color="primary" style={styles.lineCenter}>
                {word.transliteration}
              </AppText>
            ) : null}
            {meta ? (
              <AppText variant="caption" color="textMuted" style={styles.lineCenter}>
                {meta}
              </AppText>
            ) : null}

            {!showSentence ? (
              <Pressable onPress={revealSentence} hitSlop={6} style={styles.sentenceLink}>
                <AppText variant="label" color="secondary">
                  See it in a sentence
                </AppText>
              </Pressable>
            ) : sentenceLoading ? (
              <ActivityIndicator color={colors.primary} style={styles.sentenceBox} />
            ) : sentence ? (
              <View style={styles.sentenceBox}>
                <ArabicText variant="arabicBody" center>
                  {sentence.arabic}
                </ArabicText>
                {sentence.transliteration && transliterationEnabled ? (
                  <AppText variant="caption" color="textMuted" style={styles.lineCenter}>
                    {sentence.transliteration}
                  </AppText>
                ) : null}
                {sentence.translation ? (
                  <AppText variant="caption" color="textMuted" style={styles.lineCenter}>
                    {sentence.translation}
                  </AppText>
                ) : null}
                <SpeakerButton
                  onPress={() =>
                    playAudio({ audioUrl: null, text: sentence.arabic })
                  }
                />
              </View>
            ) : (
              <AppText variant="caption" color="textFaint" style={styles.sentenceBox}>
                No example sentence yet.
              </AppText>
            )}
          </View>
        ) : (
          <AppText variant="caption" color="textFaint" style={styles.hint}>
            Tap to reveal meaning
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
  chip: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    backgroundColor: colors.well,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  center: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  word: {
    fontSize: 56,
    lineHeight: 96,
  },
  sentenceLink: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  sentenceBox: {
    marginTop: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
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
