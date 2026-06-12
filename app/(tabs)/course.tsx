/**
 * Course tab — placeholder. Will become the structured curriculum
 * (units, lesson lists, progress) once content is wired up.
 */
import { Screen, Placeholder } from '@/components';

export default function CourseScreen() {
  return (
    <Screen scroll={false}>
      <Placeholder
        icon="library-outline"
        title="Your Course"
        message="The full reading curriculum — units, lessons, and your path through Modern Standard Arabic — will live here."
      />
    </Screen>
  );
}
