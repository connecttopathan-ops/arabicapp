/**
 * Sign-in / Sign-up screen.
 *
 * One screen, two modes (toggle at the bottom). Plus "Continue as guest" for
 * trying the app with no account. The Apple/Google buttons are intentionally
 * disabled placeholders — the layout is ready, but they're wired up later.
 */
import { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, ArabicText, Button, TextField } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing, layout } from '@/theme';

type Mode = 'signIn' | 'signUp';

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, signUp, continueAsGuest } = useAuth();

  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isSignUp = mode === 'signUp';

  async function handleSubmit() {
    setError(null);
    setNotice(null);

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (isSignUp && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const action = isSignUp ? signUp : signIn;
    const result = await action(email.trim(), password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.needsConfirmation) {
      // No session yet — they must confirm via email first.
      setNotice('Check your email to confirm your account, then sign in.');
      setMode('signIn');
      setPassword('');
    }
    // On success with a session, the root layout redirects automatically.
  }

  function toggleMode() {
    setMode(isSignUp ? 'signIn' : 'signUp');
    setError(null);
    setNotice(null);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing['4xl'], paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={styles.brand}>
          <ArabicText variant="arabicLarge" color="primary" center>
            مَسَار
          </ArabicText>
          <AppText variant="hero" style={styles.wordmark}>
            MASAR
          </AppText>
          <AppText variant="body" color="textMuted" style={styles.tagline}>
            Learn to read Arabic, one step at a time.
          </AppText>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            textContentType="emailAddress"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            autoComplete={isSignUp ? 'password-new' : 'password'}
            textContentType={isSignUp ? 'newPassword' : 'password'}
          />

          {error ? (
            <AppText variant="caption" color="danger" style={styles.message}>
              {error}
            </AppText>
          ) : null}
          {notice ? (
            <AppText variant="caption" color="secondary" style={styles.message}>
              {notice}
            </AppText>
          ) : null}

          <Button
            label={isSignUp ? 'Create account' : 'Sign in'}
            onPress={handleSubmit}
            loading={loading}
          />

          <Button label="Continue as guest" variant="secondary" onPress={continueAsGuest} />
        </View>

        {/* Social (structure ready, wired later) */}
        <View style={styles.social}>
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <AppText variant="caption" color="textFaint">
              or
            </AppText>
            <View style={styles.divider} />
          </View>
          <Button label="Continue with Apple" variant="secondary" icon="logo-apple" disabled hint="soon" />
          <Button label="Continue with Google" variant="secondary" icon="logo-google" disabled hint="soon" />
        </View>

        {/* Mode toggle */}
        <View style={styles.toggleRow}>
          <AppText variant="body" color="textMuted">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </AppText>
          <Button
            label={isSignUp ? 'Sign in' : 'Sign up'}
            variant="ghost"
            onPress={toggleMode}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: layout.screenPadding,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    gap: spacing['3xl'],
  },
  brand: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  wordmark: {
    letterSpacing: 2,
    marginTop: spacing.sm,
  },
  tagline: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing.lg,
  },
  message: {
    marginLeft: spacing.xs,
    marginTop: -spacing.xs,
  },
  social: {
    gap: spacing.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: 'auto',
  },
});
