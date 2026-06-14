/**
 * AuthContext — the single source of truth for "who is using the app".
 *
 * It tracks two ways of being "in":
 *   1. A real Supabase session (email sign-in/up; later Apple/Google).
 *   2. Guest mode — a local flag so someone can use the app with no account.
 *
 * Screens read state and call actions via `useAuth()`. Keeping all auth logic
 * here means the rest of the app never talks to `supabase.auth` directly, which
 * is what makes adding Apple/Google sign-in later a one-function change (see
 * `signInWithProvider` below).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const GUEST_KEY = 'masar.guestMode';

type AuthResult = { error: string | null; needsConfirmation?: boolean };

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isGuest: boolean;
  /** True while we check for an existing session on launch. */
  initializing: boolean;
  /** Signed in with a real account OR continuing as a guest. */
  isAuthed: boolean;

  signUp: (email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      // Restore guest flag and any persisted Supabase session.
      const [guestFlag, { data }] = await Promise.all([
        AsyncStorage.getItem(GUEST_KEY),
        supabase.auth.getSession(),
      ]);
      if (!active) return;
      setIsGuest(guestFlag === 'true');
      setSession(data.session);
      setInitializing(false);
    })();

    // Keep session in sync with Supabase (refresh, sign-out from elsewhere…).
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // A real session supersedes guest mode.
      if (newSession) {
        setIsGuest(false);
        AsyncStorage.removeItem(GUEST_KEY);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    // If email confirmation is enabled, there's no session until they confirm.
    return { error: null, needsConfirmation: !data.session };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }, []);

  const continueAsGuest = useCallback(async () => {
    await AsyncStorage.setItem(GUEST_KEY, 'true');
    setIsGuest(true);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(GUEST_KEY);
    setIsGuest(false);
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isGuest,
      initializing,
      isAuthed: !!session || isGuest,
      signUp,
      signIn,
      signOut,
      continueAsGuest,
    }),
    [session, isGuest, initializing, signUp, signIn, signOut, continueAsGuest],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

/**
 * Extension point for later — Apple & Google sign-in.
 *
 * When you're ready, install the provider config in the Supabase dashboard,
 * then implement this with `supabase.auth.signInWithOAuth({ provider })`
 * (plus expo-auth-session / expo-apple-authentication for the native flow) and
 * expose it through the context above. Intentionally NOT wired yet.
 *
 *   export type OAuthProvider = 'apple' | 'google';
 */
