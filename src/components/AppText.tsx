/**
 * AppText — the only Text component you should use for Latin (English) copy.
 *
 * Pick a `variant` from the typography presets and an optional semantic
 * `color`. Colours come from the active theme, so text recolours on theme swap.
 */
import { Text, type TextProps, type TextStyle } from 'react-native';
import { useTheme, preset, type ColorKey } from '@/theme';

type Variant = keyof typeof preset;

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: ColorKey;
}

export function AppText({ variant = 'body', color = 'text', style, ...rest }: AppTextProps) {
  const { colors } = useTheme();
  return (
    <Text
      style={[preset[variant] as TextStyle, { color: colors[color] }, style]}
      {...rest}
    />
  );
}
