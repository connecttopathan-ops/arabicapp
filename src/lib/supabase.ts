/**
 * The single Supabase client for the whole app.
 *
 * Import it anywhere with `import { supabase } from '@/lib/supabase'`.
 * Never create another client — one shared instance keeps the auth session
 * and connection consistent across every screen.
 *
 * Keys are read from environment variables (see `.env`). Expo automatically
 * exposes any variable prefixed with `EXPO_PUBLIC_` to the app. The anon key
 * is safe to ship in a client app — Row Level Security on the database is what
 * actually protects your data — but we still keep it in `.env` (git-ignored)
 * so it isn't committed to GitHub.
 */
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Add them to your .env file, then restart the dev server with `npx expo start -c`.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist the signed-in session on the device (used by auth in section 3).
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // No URL-based session detection in a native app.
    detectSessionInUrl: false,
  },
});
