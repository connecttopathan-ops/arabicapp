/**
 * LetterTile — a single alphabet cell: the isolated glyph with its name and
 * transliteration. Tappable to toggle "learned", shown with a gold ring and a
 * checkmark badge.
 */
import { Pressable, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArabicText } from './ArabicText';
import { AppText } from './AppText';
import { colors, radius, spacing } from '@/theme';
import type { Letter } from '@/types/content';

interface LetterTileProps {
  letter: Letter;
  learned?: boolean;
  onPress?: () => void;
}

export function LetterTile({ letter, learned = false, onPress }: LetterTileProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: learned }}
      accessibilityLabel={`${letter.name}${learned ? ', learned' : ''}`}
      style={({ pressed }) => [
        styles.tile,
        learned && styles.tileLearned,
        pressed && styles.pressed,
      ]}
    >
      {learned ? (
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={12} color={colors.textOnAccent} />
        </View>
      ) : null}
      <ArabicText variant="arabicLarge" center style={styles.glyph}>
        {letter.letter}
      </ArabicText>
      <AppText variant="label" numberOfLines={1}>
        {letter.name}
      </AppText>
      {letter.transliteration ? (
        <AppText variant="caption" color="textMuted" numberOfLines={1}>
          {letter.transliteration}
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  tileLearned: {
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  glyph: {
    marginBottom: spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
