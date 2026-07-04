/**
 * Screen — standard page chrome: espresso background, safe-area insets, and
 * (optionally) a scroll container with consistent horizontal padding.
 * Every tab renders its content inside one of these.
 */
import type { ReactNode } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedStyles, layout, spacing, type ThemeColors } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  /** Extra bottom padding so content clears the floating tab bar. */
  contentBottomPadding?: number;
}

export function Screen({ children, scroll = true, contentBottomPadding = spacing['4xl'] }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(makeStyles);

  const padding = {
    paddingTop: insets.top + spacing.lg,
    paddingBottom: contentBottomPadding,
    paddingHorizontal: layout.screenPadding,
  };

  if (!scroll) {
    return <View style={[styles.root, padding]}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, padding]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
});
