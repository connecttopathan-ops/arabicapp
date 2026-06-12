/**
 * AppText — the only Text component you should use for Latin (English) copy.
 *
 * Pick a `variant` from the typography presets and an optional semantic
 * `color`. This guarantees fonts, sizes, and colours stay on-system without
 * each screen re-declaring them.
 */
import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, preset } from '@/theme';

type Variant = keyof typeof preset;
type ColorKey = keyof typeof colors;

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: ColorKey;
}

export function AppText({
  variant = 'body',
  color = 'text',
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      style={[preset[variant] as TextStyle, { color: colors[color] }, style]}
      {...rest}
    />
  );
}
