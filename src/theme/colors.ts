/**
 * MASAR colour tokens — a warm, dark "espresso" theme.
 *
 * These are the single source of truth for every colour in the app.
 * Change a value here and it updates everywhere. When you later theme
 * for light mode or seasonal palettes, add a sibling object and swap it
 * in via the theme provider.
 */

export const palette = {
  // Core surfaces (background -> progressively "lifted" cards)
  espresso: '#1A1512', // app background
  surface: '#241D18', // default card
  surfaceRaised: '#2E251F', // a card sitting on top of another card
  surfaceSunken: '#150F0C', // inset / pressed wells

  // Text
  ivory: '#EFEAE0', // primary text
  ivoryMuted: '#B5ADA0', // secondary text
  ivoryFaint: '#7C7468', // hints, captions, disabled

  // Accents
  gold: '#E8BC6A', // primary accent
  goldDeep: '#C99B45', // pressed / darker gold
  teal: '#2E8C85', // secondary accent (zellige)
  tealDeep: '#236C66',

  // Lines & feedback
  border: '#392F27', // hairline separators / card borders
  success: '#5BA86F',
  warning: '#D99A4E',
  danger: '#C85C4E',

  // Absolute helpers
  black: '#000000',
  white: '#FFFFFF',
} as const;

/**
 * Jewel tones for the colour-coded topic tiles. Each entry carries the
 * tile's fill plus a soft tint used for its icon "chip", so tiles stay
 * legible against the espresso background.
 */
export const jewel = {
  teal: { base: '#2E8C85', tint: '#1E3A38', on: '#EAF6F4' },
  saffron: { base: '#E0A43B', tint: '#3A2E15', on: '#2A1E08' },
  terracotta: { base: '#C56B4A', tint: '#3A241C', on: '#FBEAE3' },
  indigo: { base: '#4A5B94', tint: '#1F2440', on: '#E7EAF7' },
  aubergine: { base: '#6E3F66', tint: '#2C1A2A', on: '#F4E8F1' },
} as const;

export type JewelTone = keyof typeof jewel;

/**
 * Semantic aliases — prefer these in components so intent stays clear
 * even if the underlying palette value changes.
 */
export const colors = {
  background: palette.espresso,
  card: palette.surface,
  cardRaised: palette.surfaceRaised,
  well: palette.surfaceSunken,

  text: palette.ivory,
  textMuted: palette.ivoryMuted,
  textFaint: palette.ivoryFaint,
  textOnAccent: palette.espresso,

  primary: palette.gold,
  primaryPressed: palette.goldDeep,
  secondary: palette.teal,
  secondaryPressed: palette.tealDeep,

  border: palette.border,
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,

  // Tab bar
  tabActive: palette.gold,
  tabInactive: palette.ivoryFaint,
  tabBar: palette.surfaceSunken,
} as const;
