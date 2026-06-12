/**
 * SectionHeader — a small heading above a group of content, with an
 * optional trailing action (e.g. "See all").
 */
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { spacing } from '@/theme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function SectionHeader({ title, actionLabel, onActionPress }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <AppText variant="sectionTitle">{title}</AppText>
      {actionLabel ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <AppText variant="label" color="primary">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
});
