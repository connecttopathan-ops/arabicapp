/**
 * LearnedToggle — a small tappable corner circle for marking an item learned.
 *
 * Kept as its own Pressable so that tapping it does NOT trigger the parent
 * card's tap (React Native grants the touch to this inner control). Filled
 * gold with a check when learned; an outlined circle when not.
 */
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles, radius, type ThemeColors } from '@/theme';

interface LearnedToggleProps {
  learned: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function LearnedToggle({ learned, onPress, style }: LearnedToggleProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityState={{ checked: learned }}
      accessibilityLabel={learned ? 'Learned — tap to unmark' : 'Mark as learned'}
      style={({ pressed }) => [
        styles.base,
        learned ? styles.on : styles.off,
        pressed && styles.pressed,
        style,
      ]}
    >
      {learned ? <Ionicons name="checkmark" size={14} color={colors.textOnAccent} /> : null}
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  on: {
    backgroundColor: colors.primary,
  },
  off: {
    borderWidth: 1.5,
    borderColor: colors.textFaint,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.7,
  },
});
