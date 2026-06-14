/**
 * Review session — runs through the items due today as quick recall questions,
 * reusing the Lesson player's StepChoice component. Each answer updates the
 * item's SM-2 schedule (synced to Supabase / local for guests). Ends with a
 * short summary; handles "nothing due" gracefully.
 */
import { useEffect, useMemo, useState } from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppText, ProgressBar, StepChoice, Button } from '@/components';
import { useReview } from '@/hooks/useReview';
import { buildReviewStep } from '@/services/reviewService';
import { recordActivity, REVIEW_XP_PER_CORRECT } from '@/services/statsService';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing, layout, radius } from '@/theme';
import type { ReviewItem } from '@/types/content';

export default function ReviewSession() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loading, due, submit, allLetters, allWords } = useReview();
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  // Snapshot the due list once so it doesn't shrink under us as we answer.
  const [queue, setQueue] = useState<ReviewItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (queue === null && !loading) setQueue(due);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Award XP + bump the streak once, when the session finishes with items.
  const xpEarned = correctCount * REVIEW_XP_PER_CORRECT;
  useEffect(() => {
    if (finished && total > 0) recordActivity(userId, xpEarned).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const total = queue?.length ?? 0;
  const currentItem = queue && index < total ? queue[index] : null;
  const step = useMemo(
    () => (currentItem ? buildReviewStep(currentItem, allLetters, allWords) : null),
    [currentItem, allLetters, allWords],
  );

  function handleNext(correct: boolean) {
    if (currentItem) submit(currentItem, correct);
    if (correct) setCorrectCount((c) => c + 1);
    if (index < total - 1) setIndex((i) => i + 1);
    else setFinished(true);
  }

  if (loading || queue === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (total === 0 || finished) {
    const caughtUp = total === 0;
    return (
      <View style={[styles.centered, { padding: spacing.xl }]}>
        <View style={styles.badge}>
          <Ionicons
            name={caughtUp ? 'sunny' : 'checkmark-done'}
            size={44}
            color={colors.primary}
          />
        </View>
        <AppText variant="hero" style={styles.center}>
          {caughtUp ? 'All caught up!' : 'Review complete'}
        </AppText>
        <AppText variant="body" color="textMuted" style={styles.center}>
          {caughtUp
            ? 'Nothing is due right now. Learn more in the Course, then come back.'
            : `You reviewed ${total} item${total === 1 ? '' : 's'} · ${correctCount} correct · +${xpEarned} XP`}
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
        {step ? (
          <StepChoice key={`${step.id}-${index}`} step={step} onNext={handleNext} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
