/**
 * Lesson tab — placeholder. Will host the active lesson player: letter
 * drills, word breakdowns, and reading practice.
 */
import { Screen, Placeholder } from '@/components';

export default function LessonScreen() {
  return (
    <Screen scroll={false}>
      <Placeholder
        icon="book-outline"
        title="Lesson"
        message="The interactive lesson player — letters, word breakdowns, and guided reading — is coming next."
      />
    </Screen>
  );
}
