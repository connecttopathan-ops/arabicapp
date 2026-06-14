/**
 * StepChoice — multiple-choice and listen-and-choose steps.
 *
 * Shows a prompt (and, for listen-and-choose, a speaker that auto-plays the
 * answer's audio). The user taps an option; correct/incorrect feedback shows in
 * green/red, then Continue advances. Reports whether the answer was correct.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { ArabicText } from './ArabicText';
import { AppText } from './AppText';
import { Button } from './Button';
import { SpeakerButton } from './SpeakerButton';
import { playAudio } from '@/services/audioService';
import { colors, radius, spacing } from '@/theme';
import type { LessonStep, StepOption } from '@/types/content';

export function StepChoice({
  step,
  onNext,
  renderHeader,
}: {
  step: LessonStep;
  onNext: (correct: boolean) => void;
  /** Custom content above the options (e.g. a cloze sentence). Receives the
   *  answered state so it can reveal the answer. Replaces the default prompt. */
  renderHeader?: (answered: boolean) => ReactNode;
}) {
  const isListen = step.type === 'listen_choose';
  const options = step.options ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const answered = selectedId !== null;
  const wasCorrect = !!options.find((o) => o.id === selectedId)?.correct;

  function speak() {
    if (!step.item) return;
    const text = step.itemType === 'letter' ? (step.item as any).letter : (step.item as any).arabic;
    playAudio({ audioUrl: step.item.audioUrl, text });
  }

  // For listen-and-choose, play the audio automatically on mount.
  useEffect(() => {
    if (isListen) speak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function optionState(opt: StepOption): 'idle' | 'correct' | 'wrong' {
    if (!answered) return 'idle';
    if (opt.correct) return 'correct';
    if (opt.id === selectedId) return 'wrong';
    return 'idle';
  }

  return (
    <View style={styles.wrap}>
      {renderHeader ? (
        renderHeader(answered)
      ) : (
        <AppText variant="title" style={styles.prompt}>
          {step.prompt ?? (isListen ? 'Which one did you hear?' : 'Choose the correct answer')}
        </AppText>
      )}

      {isListen ? (
        <View style={styles.center}>
          <SpeakerButton onPress={speak} />
          <AppText variant="caption" color="textFaint">
            Tap to replay
          </AppText>
        </View>
      ) : null}

      <View style={styles.grid}>
        {options.map((opt) => {
          const state = optionState(opt);
          return (
            <Pressable
              key={opt.id}
              onPress={() => !answered && setSelectedId(opt.id)}
              disabled={answered}
              accessibilityRole="button"
              style={[
                styles.option,
                state === 'correct' && styles.optionCorrect,
                state === 'wrong' && styles.optionWrong,
              ]}
            >
              {opt.arabic ? (
                <ArabicText center style={styles.optionGlyph}>
                  {opt.arabic}
                </ArabicText>
              ) : (
                <AppText variant="title" style={styles.optionLabel}>
                  {opt.label ?? ''}
                </AppText>
              )}
            </Pressable>
          );
        })}
      </View>

      {answered ? (
        <View style={styles.feedback}>
          <AppText variant="bodyStrong" color={wasCorrect ? 'success' : 'danger'}>
            {wasCorrect ? 'Correct!' : 'Not quite — the highlighted one is right.'}
          </AppText>
          <Button label="Continue" onPress={() => onNext(wasCorrect)} />
        </View>
      ) : null}
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
  center: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  option: {
    width: '46%',
    minHeight: 96,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: 'rgba(91,168,111,0.15)',
  },
  optionWrong: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(200,92,78,0.15)',
  },
  optionGlyph: {
    fontSize: 44,
    lineHeight: 64,
  },
  optionLabel: {
    textAlign: 'center',
  },
  feedback: {
    gap: spacing.md,
  },
});
