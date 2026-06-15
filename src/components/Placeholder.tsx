/**
 * Placeholder — a friendly "coming soon" panel for the tabs that aren't
 * built yet (Course, Lesson, Profile). Keeps the app feeling intentional
 * rather than empty while those screens are stubbed.
 */
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { useTheme, useThemedStyles, spacing, radius, type ThemeColors } from '@/theme';
import type { IconName } from '@/types/content';

interface PlaceholderProps {
  icon: IconName;
  title: string;
  message: string;
}

export function Placeholder({ icon, title, message }: PlaceholderProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.wrap}>
      <View style={styles.iconChip}>
        <Ionicons name={icon} size={32} color={colors.primary} />
      </View>
      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.message}>
        {message}
      </AppText>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing['2xl'],
  },
  iconChip: {
    width: 72,
    height: 72,
    borderRadius: radius['2xl'],
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    maxWidth: 280,
  },
});
