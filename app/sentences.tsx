/**
 * Sentence Mode — cloze (fill-in-the-blank) practice.
 *
 * Shows an Arabic sentence with one word blanked out (RTL), the English
 * translation as a hint, and multiple-choice options (reusing StepChoice).
 * After answering, the blank fills in with the correct word; Continue advances.
 */
import { useEffect, useMemo, useState } from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppText, ProgressBar, StepChoice, Button, ClozeSentence } from '@/components';
import { getClozeBatch, buildClozeStep, type ClozeBatch } from '@/services/sentenceService';
import { useTheme, useThemedStyles, spacing, layout, radius, type ThemeColors } from '@/theme';

export default function SentenceMode() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const [batch, setBatch] = useState<ClozeBatch | null>(null);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let active = true;
    getClozeBatch(10)
      .then((b) => active && setBatch(b))
      .catch(() => active && setBatch({ sentences: [], pool: [] }));
    return () => {
      active = false;
    };
  }, []);

  const queue = batch?.sentences ?? [];
  const total = queue.length;
  const current = index < total ? queue[index] : null;

  const step = useMemo(
    () => (current && batch ? buildClozeStep(current, batch.pool) : null),
    [current, batch],
  );

  function handleNext(correct: boolean) {
    if (correct) setCorrectCount((c) => c + 1);
    if (index < total - 1) setIndex((i) => i + 1);
    else setFinished(true);
  }

  if (!batch) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (total === 0 || finished) {
    const empty = total === 0;
    return (
      <View style={[styles.centered, { padding: spacing.xl }]}>
        <View style={styles.badge}>
          <Ionicons name={empty ? 'chatbubbles-outline' : 'checkmark-done'} size={44} color={colors.primary} />
        </View>
        <AppText variant="hero" style={styles.center}>
          {empty ? 'No sentences yet' : 'Practice complete'}
        </AppText>
        <AppText variant="body" color="textMuted" style={styles.center}>
          {empty
            ? 'Sentence practice will appear once sentences are available.'
            : `You filled ${total} blank${total === 1 ? '' : 's'} · ${correctCount} correct.`}
        </AppText>
        <View style={styles.doneBtn}>
          <Button label="Done" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={26} color={colors.textMuted} />
        </Pressable>
        <View style={styles.barWrap}>
          <ProgressBar value={index / total} />
        </View>
        <AppText variant="label" color="textMuted">
          {index + 1}/{total}
        </AppText>
      </View>

      <View style={styles.body}>
        {step && current ? (
          <StepChoice
            key={`${step.id}-${index}`}
            step={step}
            onNext={handleNext}
            renderHeader={(answered) => (
              <View style={styles.clozeHeader}>
                <ClozeSentence
                  arabic={current.arabic}
                  target={current.clozeTarget ?? ''}
                  filled={answered}
                />
                {current.translation ? (
                  <AppText variant="body" color="textMuted" style={styles.translation}>
                    “{current.translation}”
                  </AppText>
                ) : null}
              </View>
            )}
          />
        ) : null}
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  center: {
    textAlign: 'center',
  },
  badge: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  doneBtn: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.md,
  },
  barWrap: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
  },
  clozeHeader: {
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  translation: {
    textAlign: 'center',
  },
});
