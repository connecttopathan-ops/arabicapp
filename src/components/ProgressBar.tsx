/**
 * ProgressBar — a rounded track with a gold (or custom) fill.
 * `value` is clamped to 0..1.
 */
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '@/theme';

interface ProgressBarProps {
  value: number;
  color?: string;
  trackColor?: string;
  height?: number;
}

export function ProgressBar({
  value,
  color = colors.primary,
  trackColor = colors.well,
  height = 10,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;

  return (
    <View
      style={[styles.track, { backgroundColor: trackColor, height, borderRadius: height }]}
    >
      <View
        style={{
          width: `${pct}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: height,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: radius.pill,
  },
});
