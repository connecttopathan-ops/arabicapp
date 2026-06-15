/**
 * Button — themed pressable used across the app.
 *
 * Variants:
 *  - primary:   gold fill, espresso label (main actions)
 *  - secondary: outlined, ivory label (secondary actions)
 *  - ghost:     text only (tertiary / toggles)
 *
 * Supports a loading spinner and an optional leading icon (used later for
 * social sign-in buttons).
 */
import { Pressable, ActivityIndicator, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { useTheme, useThemedStyles, radius, spacing, type ThemeColors } from '@/theme';
import type { IconName } from '@/types/content';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  hint?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  hint,
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const isDisabled = disabled || loading;
  const labelColor =
    variant === 'primary' ? 'textOnAccent' : variant === 'secondary' ? 'text' : 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.textOnAccent : colors.primary} />
      ) : (
        <View style={styles.content}>
          {icon ? (
            <Ionicons
              name={icon}
              size={18}
              color={colors[labelColor]}
              style={styles.icon}
            />
          ) : null}
          <AppText variant="bodyStrong" color={labelColor}>
            {label}
          </AppText>
          {hint ? (
            <AppText variant="caption" color="textFaint" style={styles.hint}>
              {hint}
            </AppText>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    marginRight: 2,
  },
  hint: {
    marginLeft: spacing.xs,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    height: 'auto',
    paddingVertical: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.45,
  },
});
