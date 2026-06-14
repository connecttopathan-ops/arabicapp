/**
 * Course tab — one-card-per-page flashcards, read from Supabase.
 *
 * A segmented toggle switches between the Alphabet and Vocabulary sets; each is
 * a full-screen horizontal pager that flows right-to-left (Arabic order). Tap a
 * card to flip/reveal details; tap the corner ring to mark it learned. A
 * "n / total" counter shows your position.
 */
import { useCallback, useState } from 'react';
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, LetterCard, WordCard } from '@/components';
import { useLetters, useWords } from '@/hooks/useContent';
import { useProgress } from '@/context/ProgressContext';
import { colors, spacing, radius } from '@/theme';
import type { Letter, Word } from '@/types/content';

type Tab = 'alphabet' | 'vocab';

export default function CourseScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const letters = useLetters();
  const words = useWords();
  const { isLearned, toggle } = useProgress();

  const [tab, setTab] = useState<Tab>('alphabet');
  const [index, setIndex] = useState(0);

  const loading = letters.loading || words.loading;
  const offline = letters.offline || words.offline;

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
    },
    [width],
  );

  const switchTab = useCallback(
    (next: Tab) => {
      if (next === tab) return;
      setTab(next);
      setIndex(0);
    },
    [tab],
  );

  const pagerProps = {
    horizontal: true,
    inverted: true, // right-to-left flow
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    onMomentumScrollEnd: onMomentumEnd,
  } as const;

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

  const total = tab === 'alphabet' ? letters.data.length : words.data.length;

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <AppText variant="title">Course</AppText>

        <View style={styles.segment}>
          <SegmentButton
            label="Alphabet"
            active={tab === 'alphabet'}
            onPress={() => switchTab('alphabet')}
          />
          <SegmentButton
            label="Vocabulary"
            active={tab === 'vocab'}
            onPress={() => switchTab('vocab')}
          />
        </View>

        {offline ? (
          <View style={styles.offline}>
            <Ionicons name="cloud-offline-outline" size={14} color={colors.warning} />
            <AppText variant="caption" color="textMuted">
              Offline — showing saved content
            </AppText>
          </View>
        ) : null}
      </View>

      {tab === 'alphabet' ? (
        <FlatList<Letter>
          {...pagerProps}
          data={letters.data}
          keyExtractor={(item) => item.id}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <LetterCard
                letter={item}
                learned={isLearned('letter', item.id)}
                onToggleLearned={() => toggle('letter', item.id)}
              />
            </View>
          )}
        />
      ) : (
        <FlatList<Word>
          {...pagerProps}
          data={words.data}
          keyExtractor={(item) => item.id}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <WordCard
                word={item}
                learned={isLearned('word', item.id)}
                onToggleLearned={() => toggle('word', item.id)}
              />
            </View>
          )}
        />
      )}

      <View style={[styles.progress, { paddingBottom: insets.bottom + spacing.sm }]}>
        <AppText variant="label" color="textMuted">
          {total > 0 ? Math.min(index + 1, total) : 0} / {total}
        </AppText>
      </View>
    </View>
  );
}

function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={[styles.segmentButton, active && styles.segmentButtonActive]}
    >
      <AppText variant="label" color={active ? 'text' : 'textMuted'}>
        {label}
      </AppText>
    </Pressable>
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
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.xs,
  },
  header: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  segment: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.well,
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
  },
  segmentButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
  },
  segmentButtonActive: {
    backgroundColor: colors.cardRaised,
  },
  offline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progress: {
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
});
