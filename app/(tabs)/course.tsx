/**
 * Course tab — the alphabet and vocabulary, read from Supabase.
 *
 * Demonstrates the offline-first content flow: a loading state while fetching,
 * and an "offline" banner when the data came from the cache or bundled
 * fallback instead of the network.
 */
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  SectionHeader,
  LetterTile,
  WordRow,
} from '@/components';
import { useLetters, useWords } from '@/hooks/useContent';
import { useProgress } from '@/context/ProgressContext';
import { colors, spacing } from '@/theme';

export default function CourseScreen() {
  const letters = useLetters();
  const words = useWords();
  const { isLearned, toggle } = useProgress();

  const loading = letters.loading || words.loading;
  const offline = letters.offline || words.offline;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
        <AppText variant="caption" color="textMuted" style={styles.loadingText}>
          Loading content…
        </AppText>
      </View>
    );
  }

  return (
    <Screen>
      <AppText variant="title">Course</AppText>
      <AppText variant="body" color="textMuted" style={styles.intro}>
        The Arabic alphabet and your starter vocabulary. Tap an item to mark it
        as learned.
      </AppText>

      {offline ? (
        <View style={styles.offline}>
          <Ionicons name="cloud-offline-outline" size={16} color={colors.warning} />
          <AppText variant="caption" color="textMuted">
            Offline — showing saved content
          </AppText>
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionHeader title={`Alphabet · ${letters.data.length} letters`} />
        <View style={styles.grid}>
          {letters.data.map((letter) => (
            <View key={letter.id} style={styles.gridItem}>
              <LetterTile
                letter={letter}
                learned={isLearned('letter', letter.id)}
                onPress={() => toggle('letter', letter.id)}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title={`Vocabulary · ${words.data.length} words`} />
        <View style={styles.list}>
          {words.data.map((word) => (
            <WordRow
              key={word.id}
              word={word}
              learned={isLearned('word', word.id)}
              onPress={() => toggle('word', word.id)}
            />
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
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.xs,
  },
  intro: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  offline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  section: {
    marginTop: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    width: '22%',
    flexGrow: 1,
  },
  list: {
    gap: spacing.sm,
  },
});
