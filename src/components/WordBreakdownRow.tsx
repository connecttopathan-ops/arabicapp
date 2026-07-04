/**
 * WordBreakdownRow — a word that expands (on tap) to show its glyph-pieces in
 * right-to-left reading order, each with its letter name and position.
 */
import { useState } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArabicText } from './ArabicText';
import { AppText } from './AppText';
import { useTheme, useThemedStyles, radius, spacing, type ThemeColors } from '@/theme';
import type { WordBreakdown } from '@/types/content';

export function WordBreakdownRow({ item }: { item: WordBreakdown }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => setExpanded((e) => !e)}
      accessibilityRole="button"
      accessibilityLabel={`${item.glossEn ?? 'word'}. Tap to ${expanded ? 'collapse' : 'break down'}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.left}>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {item.glossEn ?? '—'}
          </AppText>
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {item.translit ?? ''}
            {'  ·  '}
            {expanded ? 'tap to collapse' : 'tap to break down'}
          </AppText>
        </View>

        <ArabicText variant="arabicBody" style={styles.word} numberOfLines={1}>
          {item.wordAr}
        </ArabicText>

        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.textFaint}
        />
      </View>

      {expanded ? (
        // row-reverse => first piece (rightmost) appears on the right: RTL order.
        <View style={styles.piecesRow}>
          {item.pieces.map((piece, i) => (
            <View key={`${piece.g}-${i}`} style={styles.piece}>
              <ArabicText center style={styles.pieceGlyph}>
                {piece.g}
              </ArabicText>
              <AppText variant="caption" numberOfLines={1}>
                {piece.n}
              </AppText>
              <AppText variant="overline" color="textFaint">
                {piece.p}
              </AppText>
            </View>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  pressed: {
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  left: {
    flex: 1,
    gap: 2,
  },
  word: {
    minWidth: 70,
  },
  piecesRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  piece: {
    alignItems: 'center',
    backgroundColor: colors.well,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: 2,
    minWidth: 64,
  },
  pieceGlyph: {
    fontSize: 28,
    lineHeight: 44,
  },
});
