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
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  const { data, loading, error } = useHomeData();
  const { learnedCount } = useProgress();
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

  const { progress, stats, continueLesson, topics } = data;

  return (
    <Screen>
      <HeroCard progress={progress} />

      <View style={styles.section}>
        <ReviewCard />
      </View>

      <View style={styles.statRow}>
        <StatCard icon="ellipse-outline" value={learnedCount('letter')} label="Letters" />
        <StatCard icon="text-outline" value={learnedCount('word')} label="Words" />
        <StatCard icon="checkmark-done-outline" value={stats.lessonsCompleted} label="Lessons" />
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
