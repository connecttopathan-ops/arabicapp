/**
 * Course tab — four sections via a segmented toggle:
 *   - Alphabet / Vocabulary : full-screen right-to-left flashcard pagers.
 *   - Letter Forms          : list of letters showing their 4 positional shapes.
 *   - Word Breakdown        : tap a word to split it into glyph-pieces (RTL).
 * All content is read from Supabase (offline-cached); nothing hardcoded.
 */
import { useCallback, useState } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppText,
  ArabicText,
  LetterCard,
  WordCard,
  LetterFormRow,
  WordBreakdownRow,
} from '@/components';
import {
  useLetters,
  useWords,
  useLetterForms,
  useWordBreakdowns,
} from '@/hooks/useContent';
import { useProgress } from '@/context/ProgressContext';
import { useSettings } from '@/context/SettingsContext';
import { colors, spacing, radius, layout } from '@/theme';
import type { Letter, Word } from '@/types/content';

type Tab = 'alphabet' | 'vocab' | 'forms' | 'breakdown';

const TABS: { key: Tab; label: string }[] = [
  { key: 'alphabet', label: 'Alphabet' },
  { key: 'vocab', label: 'Vocabulary' },
  { key: 'forms', label: 'Letter Forms' },
  { key: 'breakdown', label: 'Word Breakdown' },
];

export default function CourseScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const letters = useLetters();
  const words = useWords();
  const forms = useLetterForms();
  const breakdowns = useWordBreakdowns();
  const { isLearned, toggle } = useProgress();
  const { placement } = useSettings();

  // Start readers on Vocabulary, beginners on the Alphabet (from onboarding).
  const [tab, setTab] = useState<Tab>(placement === 'can_read' ? 'vocab' : 'alphabet');
  const [index, setIndex] = useState(0);

  const active =
    tab === 'alphabet' ? letters : tab === 'vocab' ? words : tab === 'forms' ? forms : breakdowns;
  const isPager = tab === 'alphabet' || tab === 'vocab';

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
    },
    [width],
  );

  const switchTab = useCallback((next: Tab) => {
    setTab(next);
    setIndex(0);
  }, []);

  const pagerProps = {
    horizontal: true,
    inverted: true, // right-to-left flow
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    onMomentumScrollEnd: onMomentumEnd,
  } as const;

  const listContent = {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: insets.bottom + spacing['4xl'],
    gap: spacing.md,
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <AppText variant="title">Course</AppText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.segment}
        >
          {TABS.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => switchTab(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t.key }}
              style={[styles.segmentButton, tab === t.key && styles.segmentButtonActive]}
            >
              <AppText variant="label" color={tab === t.key ? 'text' : 'textMuted'}>
                {t.label}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>

        {active.offline ? (
          <View style={styles.offline}>
            <Ionicons name="cloud-offline-outline" size={14} color={colors.warning} />
            <AppText variant="caption" color="textMuted">
              Offline — showing saved content
            </AppText>
          </View>
        ) : null}
      </View>

      {active.loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
          <AppText variant="caption" color="textMuted" style={styles.loadingText}>
            Loading content…
          </AppText>
        </View>
      ) : tab === 'alphabet' ? (
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
      ) : tab === 'vocab' ? (
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
      ) : tab === 'forms' ? (
        <FlatList
          data={forms.data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.explainer}>
              <AppText variant="bodyStrong">Letters change shape when they join</AppText>
              <AppText variant="caption" color="textMuted">
                Most letters take a different shape depending on their position in a word. Six letters
                never connect to the letter after them:
              </AppText>
              <ArabicText variant="arabicBody" color="primary" center style={styles.nonConnectors}>
                ا د ذ ر ز و
              </ArabicText>
            </View>
          }
          renderItem={({ item }) => <LetterFormRow form={item} />}
          ListEmptyComponent={<EmptyNote />}
        />
      ) : (
        <FlatList
          data={breakdowns.data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <AppText variant="caption" color="textMuted" style={styles.breakdownIntro}>
              Tap a word to see how its letters join, read right to left.
            </AppText>
          }
          renderItem={({ item }) => <WordBreakdownRow item={item} />}
          ListEmptyComponent={<EmptyNote />}
        />
      )}

      {isPager && !active.loading ? (
        <View style={[styles.progress, { paddingBottom: insets.bottom + spacing.sm }]}>
          <AppText variant="label" color="textMuted">
            {active.data.length > 0 ? Math.min(index + 1, active.data.length) : 0} /{' '}
            {active.data.length}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

function EmptyNote() {
  return (
    <View style={styles.empty}>
      <AppText variant="body" color="textMuted" style={styles.emptyText}>
        Couldn’t load this section. Check your connection and reopen the tab.
      </AppText>
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
    gap: spacing.md,
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
  explainer: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  nonConnectors: {
    marginTop: spacing.xs,
    letterSpacing: 4,
  },
  breakdownIntro: {
    marginBottom: spacing.xs,
  },
  empty: {
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
  },
});
