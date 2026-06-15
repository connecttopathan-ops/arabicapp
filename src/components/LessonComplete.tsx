/**
 * LessonComplete — the celebration screen shown at the end of a lesson.
 * Shows XP awarded and quiz score; the Done button returns to the lessons list.
 * (Recording completion to Supabase is handled by the player.)
 */
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Button } from './Button';
import { useTheme, useThemedStyles, radius, spacing, type ThemeColors } from '@/theme';
import type { Lesson } from '@/types/content';

interface LessonCompleteProps {
  lesson: Lesson;
  score: number;
  total: number;
  onDone: () => void;
}

export function LessonComplete({ lesson, score, total, onDone }: LessonCompleteProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <Ionicons name="trophy" size={48} color={colors.primary} />
      </View>

      <AppText variant="hero" style={styles.center}>
        Lesson complete!
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.center}>
        {lesson.title}
      </AppText>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <AppText variant="statNumber" color="primary">
            +{lesson.xp}
          </AppText>
          <AppText variant="caption" color="textMuted">
            XP earned
          </AppText>
        </View>
        {total > 0 ? (
          <View style={styles.stat}>
            <AppText variant="statNumber">
              {score}/{total}
            </AppText>
            <AppText variant="caption" color="textMuted">
              correct
            </AppText>
          </View>
        ) : null}
      </View>

      <Button label="Done" onPress={onDone} />
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  badge: {
    alignSelf: 'center',
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
  center: {
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing['3xl'],
    marginVertical: spacing.lg,
  },
  stat: {
    alignItems: 'center',
    gap: spacing.xs,
  },
});
