/**
 * The MASAR design system, in one import.
 *
 *   import { theme } from '@/theme';
 *   ...style={{ color: theme.colors.primary }}
 *
 * or pull individual token groups:
 *
 *   import { colors, spacing, typography } from '@/theme';
 */
export { colors, palette, jewel } from './colors';
export type { JewelTone } from './colors';
export { typography, family, preset } from './typography';
export { spacing, radius, elevation, layout } from './layout';
export { fontAssets } from './fonts';

import { colors, palette, jewel } from './colors';
import { typography } from './typography';
import { spacing, radius, elevation, layout } from './layout';

export const theme = {
  colors,
  palette,
  jewel,
  typography,
  spacing,
  radius,
  elevation,
  layout,
} as const;

export type Theme = typeof theme;
