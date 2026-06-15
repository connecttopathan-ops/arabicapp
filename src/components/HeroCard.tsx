/**
 * HeroCard — the welcome panel at the top of Home.
 * Shows a greeting, the daily streak chip, and a Level/XP progress bar.
 */
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { AppText } from './AppText';
import { ArabicText } from './ArabicText';
import { ProgressBar } from './ProgressBar';
import { useTheme, useThemedStyles, spacing, radius, type ThemeColors } from '@/theme';
import type { UserProgress } from '@/types/content';

interface HeroCardProps {
  progress: UserProgress;
}

export function HeroCard({ progress }: HeroCardProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { name, streakDays, level, levelTitle, xp, xpToNext } = progress;
  const xpRatio = xpToNext > 0 ? xp / xpToNext : 0;

  return (
    <Card tone="raised" style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.greeting}>
          <AppText variant="overline" color="primary">
            Welcome back
          </AppText>
          <AppText variant="hero" style={styles.name}>
            {name}
          </AppText>
          <ArabicText variant="arabicBody" color="textMuted" style={styles.salaam}>
            أهلاً بك
          </ArabicText>
        </View>

        <View style={styles.streakChip}>
          <Ionicons name="flame" size={18} color={colors.primary} />
          <AppText variant="bodyStrong" color="primary" style={styles.streakNum}>
            {streakDays}
          </AppText>
          <AppText variant="caption" color="textMuted">
            day streak
          </AppText>
        </View>
      </View>

      <View style={styles.levelBlock}>
        <View style={styles.levelLabelRow}>
          <AppText variant="bodyStrong">
            Level {level} · <AppText variant="body" color="textMuted">{levelTitle}</AppText>
          </AppText>
          <AppText variant="label" color="primary">
            {xp} / {xpToNext} XP
          </AppText>
        </View>
        <ProgressBar value={xpRatio} />
      </View>
    </Card>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    gap: spacing['2xl'],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  greeting: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    marginTop: 2,
  },
  salaam: {
    marginTop: spacing.xs,
  },
  streakChip: {
    alignItems: 'center',
    backgroundColor: colors.well,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: 2,
    minWidth: 78,
  },
  streakNum: {
    fontSize: 20,
    marginTop: 2,
  },
  levelBlock: {
    gap: spacing.md,
  },
  levelLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
