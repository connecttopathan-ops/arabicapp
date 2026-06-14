/**
 * Profile tab — account summary and sign-out.
 * Full stats/settings come later; for now it shows who you're signed in as
 * (or guest) and lets you sign out.
 */
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Button, Card } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing, radius } from '@/theme';

export default function ProfileScreen() {
  const { user, isGuest, signOut } = useAuth();

  const displayName = isGuest ? 'Guest' : user?.email ?? 'Signed in';
  const subtitle = isGuest
    ? 'You’re exploring without an account'
    : 'Signed in with email';

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons
            name={isGuest ? 'person-outline' : 'person'}
            size={32}
            color={colors.primary}
          />
        </View>
        <AppText variant="title" style={styles.name} numberOfLines={1}>
          {displayName}
        </AppText>
        <AppText variant="body" color="textMuted" style={styles.subtitle}>
          {subtitle}
        </AppText>
      </View>

      {isGuest ? (
        <Card style={styles.guestCard}>
          <AppText variant="bodyStrong">Save your progress</AppText>
          <AppText variant="caption" color="textMuted">
            Create a free account to keep your streak and progress across devices.
          </AppText>
          <Button label="Sign out & create account" variant="secondary" onPress={signOut} />
        </Card>
      ) : (
        <Button label="Sign out" variant="secondary" onPress={signOut} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing['3xl'],
    marginBottom: spacing['3xl'],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  guestCard: {
    gap: spacing.md,
  },
});
