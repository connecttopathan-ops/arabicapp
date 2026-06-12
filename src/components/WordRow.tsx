/**
 * WordRow — one vocabulary entry: Arabic on the right, transliteration and
 * English gloss on the left, with a small CEFR-level chip. Tappable to toggle
 * "learned" (gold ring + check icon).
 */
import { Pressable, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArabicText } from './ArabicText';
import { AppText } from './AppText';
import { colors, radius, spacing } from '@/theme';
import type { Word } from '@/types/content';

interface WordRowProps {
  word: Word;
  learned?: boolean;
  onPress?: () => void;
}

export function WordRow({ word, learned = false, onPress }: WordRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: learned }}
      accessibilityLabel={`${word.english ?? word.transliteration ?? 'word'}${learned ? ', learned' : ''}`}
      style={({ pressed }) => [
        styles.row,
        learned && styles.rowLearned,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.check}>
        <Ionicons
          name={learned ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={learned ? colors.primary : colors.textFaint}
        />
      </View>

      <View style={styles.left}>
        <View style={styles.glossRow}>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {word.english ?? '—'}
          </AppText>
          {word.cefrLevel ? (
            <View style={styles.chip}>
              <AppText variant="overline" color="secondary">
                {word.cefrLevel}
              </AppText>
            </View>
          ) : null}
        </View>
        {word.transliteration ? (
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {word.transliteration}
            {word.category ? ` · ${word.category}` : ''}
          </AppText>
        ) : null}
      </View>

      <ArabicText variant="arabicBody" style={styles.arabic} numberOfLines={1}>
        {word.arabic}
      </ArabicText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  rowLearned: {
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  check: {
    width: 22,
  },
  left: {
    flex: 1,
    gap: 2,
  },
  glossRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.well,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  arabic: {
    minWidth: 70,
  },
});
