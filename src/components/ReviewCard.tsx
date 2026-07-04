/**
 * ReviewCard — Home entry point for the daily spaced-repetition review.
 * Shows how many items are due (or "All caught up!") and launches a session.
 * Refreshes its count whenever Home regains focus (e.g. after a session).
 */
import { useCallback } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { useReview } from '@/hooks/useReview';
import { useTheme, useThemedStyles, radius, spacing, elevation, type ThemeColors } from '@/theme';

export function ReviewCard() {
  const { dueCount, loading, reload } = useReview();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const caughtUp = !loading && dueCount === 0;

  return (
    <Pressable
      onPress={() => dueCount > 0 && router.push('/review')}
      disabled={dueCount === 0}
      accessibilityRole="button"
      accessibilityLabel={
        caughtUp ? 'Review: all caught up' : `Review: ${dueCount} items due today`
      }
      style={({ pressed }) => [
        styles.card,
        caughtUp ? styles.cardDone : styles.cardDue,
        elevation.card,
        pressed && dueCount > 0 && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, caughtUp ? styles.iconDone : styles.iconDue]}>
        <Ionicons
          name={caughtUp ? 'checkmark-done' : 'sync'}
          size={22}
          color={caughtUp ? colors.accent : colors.textOnAccent}
        />
      </View>

      <View style={styles.text}>
        <AppText variant="overline" color={caughtUp ? 'textMuted' : 'textOnAccent'}>
          Daily review
        </AppText>
        <AppText variant="title" color={caughtUp ? 'text' : 'textOnAccent'}>
          {loading ? 'Checking…' : caughtUp ? 'All caught up!' : `${dueCount} due today`}
        </AppText>
      </View>

      {dueCount > 0 ? (
        <Ionicons name="chevron-forward" size={22} color={colors.textOnAccent} />
      ) : null}
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  cardDue: {
    backgroundColor: colors.accent,
  },
  cardDone: {
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.92,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDue: {
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  iconDone: {
    backgroundColor: colors.well,
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
