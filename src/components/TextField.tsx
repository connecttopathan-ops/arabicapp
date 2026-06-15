/**
 * TextField — a labelled, dark-theme text input with optional error text.
 */
import { useState } from 'react';
import { View, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { AppText } from './AppText';
import { useTheme, useThemedStyles, radius, spacing, family, type ThemeColors } from '@/theme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function TextField({ label, error, style, onFocus, onBlur, ...rest }: TextFieldProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? (
        <AppText variant="label" color="textMuted" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textFaint}
        selectionColor={colors.primary}
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
          style,
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error ? (
        <AppText variant="caption" color="danger" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  label: {
    marginLeft: spacing.xs,
  },
  input: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.well,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    color: colors.text,
    fontFamily: family.body,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    marginLeft: spacing.xs,
  },
});
