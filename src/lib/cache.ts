/**
 * Tiny JSON cache on top of AsyncStorage.
 *
 * Used to make content available offline: after each successful Supabase
 * fetch we store the result here, and if a later fetch fails (no connection)
 * we read the last-known-good copy back.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'masar.cache.';

export async function cacheSet<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Caching is best-effort; never let it break the app.
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
