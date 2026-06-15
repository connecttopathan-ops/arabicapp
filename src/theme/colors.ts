/**
 * MASAR colour tokens — semantic, themeable.
 *
 * Every colour the UI uses is a semantic token (background, card, text…),
 * defined once for dark and once for light. Screens never reference raw hex —
 * they read tokens via `useTheme()` / `useThemedStyles()`, so flipping the
 * theme swaps the whole set live.
 *
 * Accessibility: light values were chosen for WCAG AA (4.5:1) text contrast on
 * their backgrounds. Notably the muted caption #6F6450 on cream #FBF6EC passes;
 * the deepened gold (`secondary`) is for small highlights only — never text on
 * cream (use `accent`, a teal, for readable coloured labels in both themes).
 */

export interface ThemeColors {
  // Surfaces
  background: string;
  card: string;
  cardRaised: string;
  well: string;

  // Text
  text: string;
  textMuted: string;
  textFaint: string;
  textOnAccent: string; // text/icons on a primary/accent-filled surface

  // Accents
  primary: string;
  primaryPressed: string;
  secondary: string;
  secondaryPressed: string;
  /** A readable teal in BOTH themes — for coloured labels, links, chips, icons. */
  accent: string;

  // Lines & feedback
  border: string;
  success: string;
  warning: string;
  danger: string;

  // Tab bar
  tabActive: string;
  tabInactive: string;
  tabBar: string;

  // Misc
  overlay: string;
}

export type ColorKey = keyof ThemeColors;

export interface JewelToneColors {
  base: string;
  tint: string;
  on: string;
}

export type JewelTone = 'teal' | 'saffron' | 'terracotta' | 'indigo' | 'aubergine';
export type JewelSet = Record<JewelTone, JewelToneColors>;

export const darkColors: ThemeColors = {
  background: '#1A1512',
  card: '#241D18',
  cardRaised: '#2E251F',
  well: '#150F0C',

  text: '#EFEAE0',
  textMuted: '#B5ADA0',
  textFaint: '#7C7468',
  textOnAccent: '#1A1512',

  primary: '#E8BC6A',
  primaryPressed: '#C99B45',
  secondary: '#2E8C85',
  secondaryPressed: '#236C66',
  accent: '#2E8C85',

  border: '#392F27',
  success: '#5BA86F',
  warning: '#D99A4E',
  danger: '#C85C4E',

  tabActive: '#E8BC6A',
  tabInactive: '#7C7468',
  tabBar: '#150F0C',

  overlay: 'rgba(0,0,0,0.6)',
};

export const lightColors: ThemeColors = {
  background: '#FBF6EC',
  card: '#FFFDF6',
  cardRaised: '#F2E9D6',
  well: '#F2E9D6',

  text: '#2A2118',
  textMuted: '#4E4225',
  textFaint: '#6F6450',
  textOnAccent: '#FFFDF6',

  primary: '#247E77',
  primaryPressed: '#1D6660',
  secondary: '#C8923C',
  secondaryPressed: '#A8772E',
  accent: '#1C6E67',

  border: '#E6DBC4',
  success: '#2E7D4F',
  warning: '#B5701E',
  danger: '#B23A2E',

  tabActive: '#247E77',
  tabInactive: '#8A7E68',
  tabBar: '#FFFDF6',

  overlay: 'rgba(0,0,0,0.45)',
};

export const jewelDark: JewelSet = {
  teal: { base: '#2E8C85', tint: '#1E3A38', on: '#EAF6F4' },
  saffron: { base: '#E0A43B', tint: '#3A2E15', on: '#2A1E08' },
  terracotta: { base: '#C56B4A', tint: '#3A241C', on: '#FBEAE3' },
  indigo: { base: '#4A5B94', tint: '#1F2440', on: '#E7EAF7' },
  aubergine: { base: '#6E3F66', tint: '#2C1A2A', on: '#F4E8F1' },
};

export const jewelLight: JewelSet = {
  teal: { base: '#1F756E', tint: '#DCEBE8', on: '#13302D' },
  saffron: { base: '#B5791E', tint: '#F3E7C8', on: '#3A2608' },
  terracotta: { base: '#B05536', tint: '#F3E0D6', on: '#3A1B10' },
  indigo: { base: '#3C4C82', tint: '#E1E4F0', on: '#1A2040' },
  aubergine: { base: '#6E3F66', tint: '#EFE2EC', on: '#2C1A2A' },
};
