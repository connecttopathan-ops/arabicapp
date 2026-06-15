/**
 * First-run onboarding — Welcome → Placement → Daily goal → Done.
 *
 * Shown once (the SettingsProvider's `onboarded` flag gates it). Completing or
 * skipping marks onboarding done and stores the daily goal + placement.
 */
import { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppText, ArabicText, Button } from '@/components';
import { useSettings } from '@/context/SettingsContext';
import { DEFAULT_GOAL_MINUTES } from '@/services/settingsService';
import { colors, spacing, radius, layout } from '@/theme';
import type { Placement } from '@/types/content';

const PLACEMENTS: { value: Placement; label: string; hint: string }[] = [
  { value: 'beginner', label: 'Complete beginner', hint: 'New to the Arabic script' },
  { value: 'some', label: 'I know some letters', hint: 'Recognise a few, still learning' },
  { value: 'can_read', label: 'I can read', hint: 'Want to build vocabulary' },
];

const GOALS: { minutes: number; label: string; hint: string }[] = [
  { minutes: 5, label: 'Casual', hint: '5 min / day' },
  { minutes: 10, label: 'Regular', hint: '10 min / day' },
  { minutes: 15, label: 'Serious', hint: '15 min / day' },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useSettings();

  const [step, setStep] = useState(0);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [goal, setGoal] = useState<number>(DEFAULT_GOAL_MINUTES);

  function finish() {
    // Marking onboarded flips the root gate, which navigates onward.
    completeOnboarding(goal, placement);
  }
  function skip() {
    completeOnboarding(DEFAULT_GOAL_MINUTES, placement);
  }

  const startsWith = placement === 'can_read' ? 'Vocabulary' : 'the Alphabet';

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg }]}>
      <View style={styles.topBar}>
        {step > 0 ? (
          <Pressable onPress={() => setStep((s) => s - 1)} hitSlop={10}>
            <Ionicons name="chevron-back" size={24} color={colors.textMuted} />
          </Pressable>
        ) : (
          <View style={styles.spacer} />
        )}
        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>
        {step < 3 ? (
          <Pressable onPress={skip} hitSlop={10}>
            <AppText variant="label" color="textMuted">
              Skip
            </AppText>
          </Pressable>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>

      <View style={styles.body}>
        {step === 0 ? (
          <View style={styles.centerBlock}>
            <ArabicText variant="arabicLarge" color="primary" center>
              مَسَار
            </ArabicText>
            <AppText variant="hero" style={styles.center}>
              Welcome to MASAR
            </AppText>
            <AppText variant="body" color="textMuted" style={styles.center}>
              Learn to read Arabic properly — starting with the script itself, one
              letter and word at a time.
            </AppText>
          </View>
        ) : step === 1 ? (
          <View style={styles.questionBlock}>
            <AppText variant="title">Do you already know the Arabic alphabet?</AppText>
            <View style={styles.options}>
              {PLACEMENTS.map((p) => (
                <OptionRow
                  key={p.value}
                  label={p.label}
                  hint={p.hint}
                  selected={placement === p.value}
                  onPress={() => setPlacement(p.value)}
                />
              ))}
            </View>
          </View>
        ) : step === 2 ? (
          <View style={styles.questionBlock}>
            <AppText variant="title">Pick a daily goal</AppText>
            <AppText variant="body" color="textMuted">
              We'll use this for your streak and reminders.
            </AppText>
            <View style={styles.options}>
              {GOALS.map((g) => (
                <OptionRow
                  key={g.minutes}
                  label={g.label}
                  hint={g.hint}
                  selected={goal === g.minutes}
                  onPress={() => setGoal(g.minutes)}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.centerBlock}>
            <View style={styles.badge}>
              <Ionicons name="sparkles" size={44} color={colors.primary} />
            </View>
            <AppText variant="hero" style={styles.center}>
              You're ready!
            </AppText>
            <AppText variant="body" color="textMuted" style={styles.center}>
              We'll start you with {startsWith}, {goal} minutes a day. You can change
              this anytime.
            </AppText>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {step === 0 ? (
          <Button label="Get started" onPress={() => setStep(1)} />
        ) : step === 1 ? (
          <Button label="Continue" onPress={() => setStep(2)} disabled={!placement} />
        ) : step === 2 ? (
          <Button label="Continue" onPress={() => setStep(3)} />
        ) : (
          <Button label="Start learning" onPress={finish} />
        )}
      </View>
    </View>
  );
}

function OptionRow({
  label,
  hint,
  selected,
  onPress,
}: {
  label: string;
  hint: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.optionRow, selected && styles.optionRowSelected]}
    >
      <View style={styles.optionText}>
        <AppText variant="bodyStrong">{label}</AppText>
        <AppText variant="caption" color="textMuted">
          {hint}
        </AppText>
      </View>
      <Ionicons
        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={selected ? colors.primary : colors.textFaint}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: layout.screenPadding,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spacer: {
    width: 40,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  centerBlock: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  questionBlock: {
    gap: spacing.lg,
  },
  center: {
    textAlign: 'center',
  },
  badge: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  options: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  optionRowSelected: {
    borderColor: colors.primary,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  footer: {
    paddingTop: spacing.lg,
  },
});
