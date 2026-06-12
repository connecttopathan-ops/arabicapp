/**
 * Font asset map consumed by `useFonts` at app startup.
 *
 * The string keys here are the family names you reference in styles via
 * `typography.family.*`. Keeping the map separate from the typography
 * presets means the loader and the style tokens never drift apart.
 */
import {
  NotoNaskhArabic_400Regular,
  NotoNaskhArabic_600SemiBold,
  NotoNaskhArabic_700Bold,
} from '@expo-google-fonts/noto-naskh-arabic';
import { Marcellus_400Regular } from '@expo-google-fonts/marcellus';
import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from '@expo-google-fonts/figtree';

export const fontAssets = {
  // Arabic — Naskh style, renders right-to-left
  NotoNaskhArabic_400Regular,
  NotoNaskhArabic_600SemiBold,
  NotoNaskhArabic_700Bold,
  // Display serif (headings)
  Marcellus_400Regular,
  // Body sans
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
};
