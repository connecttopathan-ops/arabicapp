/**
 * Lesson player — the full-screen guided flow for one lesson.
 *
 * Renders a top progress bar + the current step (intro / trace / multiple
 * choice / listen-and-choose), advancing one at a time. On the final step it
 * records completion to Supabase (so it syncs) and shows the celebration.
 */
import { useEffect, useMemo, useState } from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  AppText,
  ProgressBar,
  StepIntro,
  StepTrace,
  StepChoice,
  LessonComplete,
} from '@/components';
import { useLesson } from '@/hooks/useContent';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { recordActivity } from '@/services/statsService';
import { colors, spacing, layout } from '@/theme';

export default function LessonPlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, loading } = useLesson(id);
  const { markLearned, isLearned } = useProgress();
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = data?.steps ?? [];
  const total = steps.length;
  const quizCount = useMemo(
    () => steps.filter((s) => s.type === 'multiple_choice' || s.type === 'listen_choose').length,
    [steps],
  );

  // Record completion once when the user finishes.
  useEffect(() => {
    if (!completed || !data) return;
    // Award XP only the first time this lesson is completed; activity always
    // counts toward the streak.
    const firstTime = !isLearned('lesson', data.lesson.id);
    markLearned('lesson', data.lesson.id);
    recordActivity(userId, firstTime ? data.lesson.xp : 0).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  function handleNext(correct?: boolean) {
    if (correct) setScore((s) => s + 1);
    if (index < total - 1) setIndex((i) => i + 1);
    else setCompleted(true);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!data || total === 0) {
    return (
      <View style={[styles.centered, { padding: spacing.xl }]}>
        <AppText variant="body" color="textMuted" style={styles.centerText}>
          Couldn’t load this lesson. Check your connection and try again.
        </AppText>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backLink}>
          <AppText variant="bodyStrong" color="primary">
            Go back
          </AppText>
        </Pressable>
      </View>
    );
  }

  if (completed) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.lg }]}>
        <LessonComplete
          lesson={data.lesson}
          score={score}
          total={quizCount}
          onDone={() => router.back()}
        />
      </View>
    );
  }

  const step = steps[index];

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={26} color={colors.textMuted} />
        </Pressable>
        <View style={styles.barWrap}>
          <ProgressBar value={(index + 1) / total} />
        </View>
        <AppText variant="label" color="textMuted">
          {index + 1}/{total}
        </AppText>
      </View>

      <View style={styles.body}>
        {step.type === 'intro' ? (
          <StepIntro key={step.id} step={step} onNext={() => handleNext()} />
        ) : step.type === 'trace' ? (
          <StepTrace key={step.id} step={step} onNext={() => handleNext()} />
        ) : (
          <StepChoice key={step.id} step={step} onNext={(correct) => handleNext(correct)} />
        )}
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
  centerText: {
    textAlign: 'center',
  },
  backLink: {
    padding: spacing.sm,
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
