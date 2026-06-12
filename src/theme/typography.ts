/**
 * Typography tokens.
 *
 * `family` maps human-readable roles to the loaded font names.
 *  - display: Marcellus (serif) for hero/section headings
 *  - body:    Figtree (sans) for everything else
 *  - arabic:  Noto Naskh Arabic for Modern Standard Arabic content
 *
 * `preset` gives ready-made text styles so screens stay consistent.
 */
import type { TextStyle } from 'react-native';

export const family = {
  display: 'Marcellus_400Regular',

  body: 'Figtree_400Regular',
  bodyMedium: 'Figtree_500Medium',
  bodySemiBold: 'Figtree_600SemiBold',
  bodyBold: 'Figtree_700Bold',

  arabic: 'NotoNaskhArabic_400Regular',
  arabicSemiBold: 'NotoNaskhArabic_600SemiBold',
  arabicBold: 'NotoNaskhArabic_700Bold',
} as const;

export const preset = {
  // Serif display headings
  hero: {
    fontFamily: family.display,
    fontSize: 30,
    lineHeight: 36,
  },
  title: {
    fontFamily: family.display,
    fontSize: 22,
    lineHeight: 28,
  },
  sectionTitle: {
    fontFamily: family.bodySemiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 0.2,
  },

  // Body sans
  body: {
    fontFamily: family.body,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: family.bodySemiBold,
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    fontFamily: family.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  caption: {
    fontFamily: family.body,
    fontSize: 12,
    lineHeight: 16,
  },
  overline: {
    fontFamily: family.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  // Big numbers (streak, stats, XP)
  statNumber: {
    fontFamily: family.display,
    fontSize: 26,
    lineHeight: 30,
  },

  // Arabic — always pair with writingDirection: 'rtl' at the component level
  arabicLarge: {
    fontFamily: family.arabic,
    fontSize: 34,
    lineHeight: 52,
  },
  arabicBody: {
    fontFamily: family.arabic,
    fontSize: 20,
    lineHeight: 34,
  },
} as const satisfies Record<string, TextStyle>;

export const typography = { family, preset } as const;
