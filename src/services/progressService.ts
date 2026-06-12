/**
 * Progress service — saves and loads which items a user has learned.
 *
 * Two backends, chosen by whether there's a real account:
 *   - Signed in  -> the `user_progress` table in Supabase (syncs across
 *                   devices; RLS ensures a user only sees their own rows).
 *   - Guest      -> a local list on the device (so the feature still works
 *                   with no account).
 *
 * Progress is represented in the app as a set of string keys, one per item:
 * `"<item_type>:<item_id>"`, e.g. "letter:6f1c…".
 */
import { supabase } from '@/lib/supabase';
import { cacheGet, cacheSet } from '@/lib/cache';
import type { ProgressItemType } from '@/types/content';

const GUEST_KEY = 'progress.guest';

export function progressKey(type: ProgressItemType, id: string): string {
  return `${type}:${id}`;
}

/** Load all learned-item keys for the current user (or guest). */
export async function loadProgress(signedIn: boolean): Promise<string[]> {
  if (signedIn) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('item_type, item_id');
    if (error) throw error;
    return (data ?? []).map((row) => progressKey(row.item_type, String(row.item_id)));
  }
  return (await cacheGet<string[]>(GUEST_KEY)) ?? [];
}

/**
 * Persist a single learned/unlearned change.
 * For guests we save the whole updated list; for signed-in users we make a
 * targeted insert (upsert) or delete so it round-trips to other devices.
 */
export async function persistLearned(
  signedIn: boolean,
  type: ProgressItemType,
  id: string,
  learned: boolean,
  allKeysAfterChange: string[],
): Promise<void> {
  if (!signedIn) {
    await cacheSet(GUEST_KEY, allKeysAfterChange);
    return;
  }

  if (learned) {
    // user_id defaults to auth.uid() in the DB, so we don't send it here.
    const { error } = await supabase
      .from('user_progress')
      .upsert(
        { item_type: type, item_id: id, status: 'learned' },
        { onConflict: 'user_id,item_type,item_id' },
      );
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('user_progress')
      .delete()
      .eq('item_type', type)
      .eq('item_id', id);
    if (error) throw error;
  }
}
