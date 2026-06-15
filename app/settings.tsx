/**
 * Settings — reachable from the Profile tab. Toggles persist via SettingsContext
 * (synced for signed-in users, local for guests).
 */
import { useState, type ReactNode } from 'react';
import { View, Switch, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, Card } from '@/components';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { ensurePermission, sendTestNotification } from '@/services/notificationsService';
import { formatTime } from '@/lib/time';
import { colors, spacing, radius, layout } from '@/theme';

const TIME_PRESETS = [
  { hour: 8, minute: 0 },
  { hour: 18, minute: 0 },
  { hour: 19, minute: 30 },
  { hour: 20, minute: 0 },
  { hour: 21, minute: 0 },
];

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    transliterationEnabled,
    audioEnabled,
    theme,
    reminderEnabled,
    reminderHour,
    reminderMinute,
    update,
    updateReminder,
  } = useSettings();
  const { user, isGuest, signOut } = useAuth();

  const [busy, setBusy] = useState(false);

  async function toggleReminder(value: boolean) {
    if (value) {
      const granted = await ensurePermission();
      if (!granted) {
        Alert.alert('Notifications are off', 'Enable notifications for MASAR in your phone settings.');
        return;
      }
      await updateReminder(true, reminderHour, reminderMinute);
    } else {
      await updateReminder(false, reminderHour, reminderMinute);
    }
  }

  async function test() {
    const granted = await ensurePermission();
    if (!granted) return;
    setBusy(true);
    await sendTestNotification();
    setBusy(false);
    Alert.alert('Test scheduled', 'A test notification will arrive in ~8 seconds. Background the app to see it.');
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <AppText variant="title">Settings</AppText>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing['3xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Reading">
          <ToggleRow
            icon="text-outline"
            label="Transliteration"
            hint="Show romanization (turn off to read script only)"
            value={transliterationEnabled}
            onValueChange={(v) => update({ transliterationEnabled: v })}
          />
          <Divider />
          <ToggleRow
            icon="volume-high-outline"
            label="Audio"
            hint="Pronunciation playback"
            value={audioEnabled}
            onValueChange={(v) => update({ audioEnabled: v })}
          />
        </Section>

        <Section title="Daily reminder">
          <ToggleRow
            icon="notifications-outline"
            label="Reminder"
            hint={reminderEnabled ? `Every day at ${formatTime(reminderHour, reminderMinute)}` : 'Off'}
            value={reminderEnabled}
            onValueChange={toggleReminder}
          />
          {reminderEnabled ? (
            <>
              <View style={styles.times}>
                {TIME_PRESETS.map((t) => {
                  const active = t.hour === reminderHour && t.minute === reminderMinute;
                  return (
                    <Pressable
                      key={`${t.hour}:${t.minute}`}
                      onPress={() => updateReminder(true, t.hour, t.minute)}
                      style={[styles.timeChip, active && styles.timeChipActive]}
                    >
                      <AppText variant="label" color={active ? 'textOnAccent' : 'textMuted'}>
                        {formatTime(t.hour, t.minute)}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
              <Button label="Send a test notification" variant="secondary" onPress={test} loading={busy} />
            </>
          ) : null}
        </Section>

        <Section title="Appearance">
          <View style={styles.themeRow}>
            {(['dark', 'light'] as const).map((t) => (
              <Pressable
                key={t}
                onPress={() => update({ theme: t })}
                style={[styles.themeChip, theme === t && styles.themeChipActive]}
              >
                <Ionicons
                  name={t === 'dark' ? 'moon' : 'sunny'}
                  size={18}
                  color={theme === t ? colors.textOnAccent : colors.textMuted}
                />
                <AppText variant="label" color={theme === t ? 'textOnAccent' : 'textMuted'}>
                  {t === 'dark' ? 'Dark' : 'Light'}
                </AppText>
              </Pressable>
            ))}
          </View>
          <AppText variant="caption" color="textFaint" style={styles.themeNote}>
            Light theme is coming soon — your choice is saved for when it lands.
          </AppText>
        </Section>

        <Section title="Account">
          <View style={styles.accountRow}>
            <Ionicons name={isGuest ? 'person-outline' : 'person'} size={20} color={colors.secondary} />
            <View style={styles.accountText}>
              <AppText variant="bodyStrong">{isGuest ? 'Guest' : user?.email ?? 'Signed in'}</AppText>
              <AppText variant="caption" color="textMuted">
                {isGuest ? 'Progress is saved on this device only' : 'Signed in — progress syncs'}
              </AppText>
            </View>
          </View>
          {isGuest ? (
            <Button label="Create account to sync progress" onPress={signOut} />
          ) : (
            <Button label="Sign out" variant="secondary" onPress={signOut} />
          )}
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="overline" color="textMuted" style={styles.sectionTitle}>
        {title}
      </AppText>
      <Card style={styles.sectionCard}>{children}</Card>
    </View>
  );
}

function ToggleRow({
  icon,
  label,
  hint,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Ionicons name={icon} size={20} color={colors.secondary} />
      <View style={styles.toggleText}>
        <AppText variant="bodyStrong">{label}</AppText>
        <AppText variant="caption" color="textMuted">
          {hint}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.secondary, false: colors.well }}
        thumbColor={colors.text}
      />
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.md,
  },
  spacer: {
    width: 26,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    marginLeft: spacing.xs,
  },
  sectionCard: {
    gap: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  toggleText: {
    flex: 1,
    gap: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  times: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.well,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  themeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  themeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.well,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  themeNote: {
    marginLeft: spacing.xs,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  accountText: {
    flex: 1,
    gap: 2,
  },
});
