/**
 * Lesson tab — lists available guided lessons (from Supabase). Tapping one
 * opens the full-screen lesson player.
 */
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText } from '@/components';
import { useLessons } from '@/hooks/useContent';
import { useProgress } from '@/context/ProgressContext';
import { useTheme, useThemedStyles, spacing, radius, type ThemeColors } from '@/theme';

export default function LessonScreen() {
  const { data, loading } = useLessons();
  const { isLearned } = useProgress();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();

  return (
    <Screen>
      <AppText variant="title">Lessons</AppText>
      <AppText variant="body" color="textMuted" style={styles.intro}>
        Guided, step-by-step practice. Each lesson teaches and quizzes you, then
        awards XP.
      </AppText>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : data.length === 0 ? (
        <AppText variant="body" color="textMuted">
          No lessons yet — check back soon.
        </AppText>
      ) : (
        <View style={styles.list}>
          {data.map((lesson) => {
            const done = isLearned('lesson', lesson.id);
            return (
              <Pressable
                key={lesson.id}
                onPress={() => router.push(`/play/${lesson.id}`)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              >
                <View style={styles.cardLeft}>
                  <AppText variant="bodyStrong" numberOfLines={1}>
                    {lesson.title}
                  </AppText>
                  {lesson.subtitle ? (
                    <AppText variant="caption" color="textMuted" numberOfLines={1}>
                      {lesson.subtitle}
                    </AppText>
                  ) : null}
                  <AppText variant="caption" color="primary">
                    {done ? 'Completed' : `${lesson.xp} XP`}
                  </AppText>
                </View>
                <Ionicons
                  name={done ? 'checkmark-circle' : 'play-circle'}
                  size={28}
                  color={done ? colors.success : colors.primary}
                />
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  intro: {
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  center: {
    paddingVertical: spacing['4xl'],
    alignItems: 'center',
  },
  list: {
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.9,
  },
  cardLeft: {
    flex: 1,
    gap: 2,
  },
});
