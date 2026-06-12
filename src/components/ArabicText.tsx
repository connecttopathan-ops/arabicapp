/**
 * ArabicText — renders Modern Standard Arabic correctly.
 *
 * Two things every piece of Arabic must get right, handled here once:
 *  1. `writingDirection: 'rtl'` so the script flows right-to-left.
 *  2. `textAlign: 'right'` so it hugs the correct edge regardless of the
 *     device's locale.
 * It defaults to the Naskh font and an Arabic-tuned line height.
 */
import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, preset } from '@/theme';

type ArabicVariant = 'arabicLarge' | 'arabicBody';
type ColorKey = keyof typeof colors;

interface ArabicTextProps extends TextProps {
  variant?: ArabicVariant;
  color?: ColorKey;
  /** Center the glyphs instead of right-aligning (e.g. flashcards). */
  center?: boolean;
}

export function ArabicText({
  variant = 'arabicBody',
  color = 'text',
  center = false,
  style,
  ...rest
}: ArabicTextProps) {
  return (
    <Text
      // Helps screen readers and layout engines treat this as Arabic.
      lang="ar"
      style={[
        preset[variant] as TextStyle,
        {
          color: colors[color],
          writingDirection: 'rtl',
          textAlign: center ? 'center' : 'right',
        },
        style,
      ]}
      {...rest}
    />
  );
}
