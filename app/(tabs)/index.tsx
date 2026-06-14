/**
 * Home screen.
 *
 * Composes the dashboard from reusable components and data from the content
 * service (via useHomeData). Nothing here knows whether the data is local or
 * from Supabase — it just renders whatever the hook returns.
 */
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Screen,
  HeroCard,
  StatCard,
  ContinueBanner,
  TopicTile,
  SectionHeader,
  ReviewCard,
  AppText,
} from '@/components';
import { useHomeData } from '@/hooks/useHomeData';
import { useProgress } from '@/context/ProgressContext';
import { useStats } from '@/hooks/useStats';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing } from '@/theme';
import type { UserProgress } from '@/types/content';

function displayName(email: string | undefined | null): string {
  if (!email) return 'there';
  const local = email.split('@')[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export default function HomeScreen() {
  const { data, loading, error } = useHomeData();
  const { learnedCount } = useProgress();
  const stats = useStats();
  const { session, isGuest } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centered}>
        <AppText variant="body" color="textMuted">
          Couldn’t load your dashboard. Pull to retry soon.
        </AppText>
      </View>
    );
  }

  const { continueLesson, topics } = data;

  const heroProgress: UserProgress = {
    name: isGuest ? 'Guest' : displayName(session?.user?.email),
    streakDays: stats.streak,
    level: stats.level,
    levelTitle: stats.levelTitle,
    xp: stats.xpIntoLevel,
    xpToNext: stats.xpForLevel,
  };

  return (
    <Screen>
      <HeroCard progress={heroProgress} />

      <View style={styles.section}>
        <ReviewCard />
      </View>

      <View style={styles.statRow}>
        <StatCard icon="ellipse-outline" value={learnedCount('letter')} label="Letters" />
        <StatCard icon="text-outline" value={learnedCount('word')} label="Words" />
        <StatCard icon="checkmark-done-outline" value={learnedCount('lesson')} label="Lessons" />
      </View>

      <View style={styles.section}>
        <ContinueBanner
          lesson={continueLesson}
          onPress={() => router.push('/lesson')}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Topics" actionLabel="See all" onActionPress={() => router.push('/course')} />
        <View style={styles.grid}>
          {topics.map((topic) => (
            <View key={topic.id} style={styles.gridItem}>
              <TopicTile topic={topic} onPress={() => router.push('/lesson')} />
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing['2xl'],
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  section: {
    marginTop: spacing['2xl'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: {
    // Two columns: each item is just under half width, gap fills the rest.
    width: '48%',
    flexGrow: 1,
  },
});
