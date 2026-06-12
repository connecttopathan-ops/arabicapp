/**
 * StatCard — a compact metric tile (icon, big number, label).
 * Used in the three-up stat row on Home. Designed to flex equally in a row.
 */
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { AppText } from './AppText';
import { colors, spacing, radius } from '@/theme';
import type { IconName } from '@/types/content';

interface StatCardProps {
  icon: IconName;
  value: number | string;
  label: string;
  accent?: string;
}

export function StatCard({ icon, value, label, accent = colors.primary }: StatCardProps) {
  return (
    <Card style={styles.card} padded={false}>
      <View style={[styles.iconChip, { backgroundColor: colors.well }]}>
        <Ionicons name={icon} size={18} color={accent} />
      </View>
      <AppText variant="statNumber">{value}</AppText>
      <AppText variant="caption" color="textMuted">
        {label}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
});
