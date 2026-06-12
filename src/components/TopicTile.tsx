/**
 * TopicTile — a colour-coded entry point into a learning topic.
 * Each tile draws its colour from a jewel tone, with a tinted icon chip
 * and an accent edge so the five topics read as a distinct, vibrant set.
 */
import { Pressable, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { jewel, colors, spacing, radius, elevation } from '@/theme';
import type { Topic } from '@/types/content';

interface TopicTileProps {
  topic: Topic;
  onPress?: () => void;
}

export function TopicTile({ topic, onPress }: TopicTileProps) {
  const tone = jewel[topic.tone];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, elevation.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={topic.title}
    >
      {/* Coloured accent stripe down the leading edge */}
      <View style={[styles.accent, { backgroundColor: tone.base }]} />

      <View style={[styles.iconChip, { backgroundColor: tone.tint }]}>
        <Ionicons name={topic.icon} size={22} color={tone.base} />
      </View>

      <View style={styles.text}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {topic.title}
        </AppText>
        <AppText variant="caption" color="textMuted" numberOfLines={2}>
          {topic.subtitle}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: 132,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    paddingLeft: spacing.lg + 6,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    gap: 2,
  },
});
