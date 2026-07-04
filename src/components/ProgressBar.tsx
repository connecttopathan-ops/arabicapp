/**
 * ProgressBar — a rounded track with an accent fill.
 * `value` is clamped to 0..1. Colours default to the active theme.
 */
import { View, StyleSheet } from 'react-native';
import { useTheme, radius } from '@/theme';

interface ProgressBarProps {
  value: number;
  color?: string;
  trackColor?: string;
  height?: number;
}

export function ProgressBar({ value, color, trackColor, height = 10 }: ProgressBarProps) {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const fill = color ?? colors.primary;
  const track = trackColor ?? colors.well;

  return (
    <View style={[styles.track, { backgroundColor: track, height, borderRadius: height }]}>
      <View
        style={{
          width: `${pct}%`,
          height: '100%',
          backgroundColor: fill,
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
