/**
 * Profile tab — placeholder. Will show account details, learning stats,
 * settings, and (after Supabase) sign-in / sync.
 */
import { Screen, Placeholder } from '@/components';

export default function ProfileScreen() {
  return (
    <Screen scroll={false}>
      <Placeholder
        icon="person-outline"
        title="Profile"
        message="Your stats, streak history, and settings will appear here once accounts are connected."
      />
    </Screen>
  );
}
