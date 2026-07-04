/**
 * The MASAR design system.
 *
 * Colours are themeable — read them at render time:
 *   const { colors } = useTheme();
 *   const styles = useThemedStyles((colors) => StyleSheet.create({ ... }));
 *
 * Spacing / radius / elevation / typography are theme-independent and imported
 * statically as before.
 */
export {
  darkColors,
  lightColors,
  jewelDark,
  jewelLight,
} from './colors';
export type { ThemeColors, ColorKey, JewelTone, JewelSet, JewelToneColors } from './colors';
export { ThemeProvider, useTheme, useThemedStyles } from './ThemeContext';
export { typography, family, preset } from './typography';
export { spacing, radius, elevation, layout } from './layout';
export { fontAssets } from './fonts';
