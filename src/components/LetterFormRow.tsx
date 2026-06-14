/**
 * LetterFormRow — one letter showing its four positional shapes side by side,
 * so learners see the core shape stay constant while the tails change.
 */
import { View, StyleSheet } from 'react-native';
import { ArabicText } from './ArabicText';
import { AppText } from './AppText';
import { colors, radius, spacing } from '@/theme';
import type { LetterForm } from '@/types/content';

const SLOTS: { key: keyof Pick<LetterForm, 'isolated' | 'initial' | 'medial' | 'final'>; label: string }[] = [
  { key: 'isolated', label: 'Isolated' },
  { key: 'initial', label: 'Initial' },
  { key: 'medial', label: 'Medial' },
  { key: 'final', label: 'Final' },
];

export function LetterFormRow({ form }: { form: LetterForm }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText variant="bodyStrong" style={styles.name}>
          {form.name}
        </AppText>
        {form.sound ? (
          <View style={styles.soundChip}>
            <AppText variant="overline" color="secondary">
              {form.sound}
            </AppText>
          </View>
        ) : null}
        {form.nonConnector ? (
          <View style={styles.ncChip}>
            <AppText variant="overline" color="primary">
              non-connector
            </AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.formsRow}>
        {SLOTS.map((slot) => (
          <View key={slot.key} style={styles.formCell}>
            <ArabicText center style={styles.glyph}>
              {form[slot.key]}
            </ArabicText>
            <AppText variant="caption" color="textFaint" style={styles.formLabel}>
              {slot.label}
            </AppText>
          </View>
        ))}
      </View>

      {form.note ? (
        <AppText variant="caption" color="textMuted" style={styles.note}>
          {form.note}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    marginRight: spacing.xs,
  },
  soundChip: {
    backgroundColor: colors.well,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  ncChip: {
    backgroundColor: colors.well,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  formsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  formCell: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.well,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  glyph: {
    fontSize: 30,
    lineHeight: 46,
  },
  formLabel: {
    textAlign: 'center',
  },
  note: {
    marginTop: 2,
  },
});
