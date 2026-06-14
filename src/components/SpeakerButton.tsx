/**
 * SpeakerButton — a round "play audio" control in the espresso/gold theme.
 * Its own Pressable so tapping it doesn't trigger the parent card's flip.
 */
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';

interface SpeakerButtonProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SpeakerButton({ onPress, style }: SpeakerButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Play pronunciation"
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      <Ionicons name="volume-high" size={22} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.well,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
});
