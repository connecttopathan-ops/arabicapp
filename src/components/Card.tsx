/**
 * Card — a surface lifted slightly off the espresso background.
 *
 * `tone="raised"` sits higher (stronger shadow, lighter fill) for cards that
 * stack on top of other cards. A thin border keeps edges crisp on dark.
 */
import { View, type ViewProps, StyleSheet } from 'react-native';
import { colors, radius, elevation, spacing } from '@/theme';

interface CardProps extends ViewProps {
  tone?: 'default' | 'raised';
  padded?: boolean;
}

export function Card({
  tone = 'default',
  padded = true,
  style,
  children,
  ...rest
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        padded && styles.padded,
        tone === 'raised' ? styles.raised : styles.default,
        tone === 'raised' ? elevation.raised : elevation.card,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  padded: {
    padding: spacing.xl,
  },
  default: {
    backgroundColor: colors.card,
  },
  raised: {
    backgroundColor: colors.cardRaised,
  },
});
