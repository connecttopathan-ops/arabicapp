/**
 * ContinueBanner — a tappable "pick up where you left off" strip.
 * Shows the lesson title (with its Arabic name), a progress bar, and a
 * play affordance. Press handling is wired by the parent.
 */
import { Pressable, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { ArabicText } from './ArabicText';
import { ProgressBar } from './ProgressBar';
import { useTheme, useThemedStyles, spacing, radius, elevation, type ThemeColors } from '@/theme';
import type { ContinueLesson } from '@/types/content';

interface ContinueBannerProps {
  lesson: ContinueLesson;
  onPress?: () => void;
}

export function ContinueBanner({ lesson, onPress }: ContinueBannerProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const pct = Math.round(Math.max(0, Math.min(1, lesson.progress)) * 100);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.banner, elevation.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Continue ${lesson.title}, ${pct}% complete`}
    >
      <View style={styles.row}>
        <View style={styles.textCol}>
          <AppText variant="overline" color="textOnAccent" style={styles.eyebrow}>
            Continue learning
          </AppText>
          <View style={styles.titleRow}>
            <AppText variant="title" color="textOnAccent" numberOfLines={1} style={styles.title}>
              {lesson.title}
            </AppText>
            <ArabicText variant="arabicBody" color="textOnAccent" numberOfLines={1}>
              {lesson.arabicTitle}
            </ArabicText>
          </View>
          <AppText variant="caption" color="textOnAccent" style={styles.subtitle}>
            {lesson.subtitle}
          </AppText>
        </View>

        <View style={styles.playButton}>
          <Ionicons name="play" size={22} color={colors.primary} />
        </View>
      </View>

      <View style={styles.progressRow}>
        <ProgressBar
          value={lesson.progress}
          color={colors.textOnAccent}
          trackColor={colors.primaryPressed}
          height={8}
        />
        <AppText variant="label" color="textOnAccent" style={styles.pct}>
          {pct}%
        </AppText>
      </View>
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  banner: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  textCol: {
    flex: 1,
    gap: spacing.xs,
  },
  eyebrow: {
    opacity: 0.75,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    flexShrink: 1,
  },
  subtitle: {
    opacity: 0.7,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.textOnAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pct: {
    width: 40,
    textAlign: 'right',
  },
});
