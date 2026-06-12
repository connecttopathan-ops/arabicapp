/**
 * Spacing, radius, and elevation tokens.
 *
 * Spacing follows a 4-point scale so layouts stay rhythmically aligned.
 * Reference these instead of hardcoding pixel values in components.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  pill: 999,
} as const;

/**
 * Soft shadows tuned for a dark background — subtle "lift" rather than
 * heavy drop shadows. Spread cross-platform (iOS shadow + Android
 * elevation) via the helper objects below.
 */
export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  raised: {
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} as const;

export const layout = {
  screenPadding: spacing.xl,
  maxContentWidth: 520,
} as const;
