/**
 * Color tokens. Two layers:
 *   1. `palette` — raw color scale (mirrors the web kit's tokens.css)
 *   2. `lightColors` / `darkColors` — semantic theme objects that components reference
 *
 * Components never read `palette.*` directly. They read semantic colors only,
 * so that swapping the active theme later is a one-object change.
 */

export const palette = {
  brand: {
    50: '#E1F5EE',
    100: '#C5E8D6',
    300: '#7FBCA0',
    500: '#2C7955',
    600: '#266C4A',
    700: '#1F5F3F',
    900: '#0E3823',
  },
  gray: {
    50: '#F8FAF8',
    100: '#F1F4F1',
    200: '#E5E9E5',
    300: '#CFD4CE',
    400: '#AFB5AD',
    500: '#858A83',
    600: '#5C615A',
    700: '#424643',
    800: '#2B2E2B',
  },
  success: {
    50: '#E1F5EE',
    100: '#C5E8D6',
    500: '#1D9E75',
    700: '#0F6E56',
    900: '#063B2F',
  },
  warning: {
    50: '#FAEEDA',
    100: '#F5DCB5',
    500: '#EF9F27',
    700: '#854F0B',
    900: '#2E1600',
  },
  danger: {
    50: '#FCEBEB',
    100: '#F8D0D0',
    500: '#D85A30',
    700: '#712B13',
    900: '#2E0A05',
  },
  info: {
    50: '#E6F1FB',
    100: '#C8DDF6',
    500: '#378ADD',
    700: '#0C447C',
    900: '#061325',
  },
} as const;

export type Palette = typeof palette;

export const lightColors = {
  // Surfaces
  surfacePage: '#FDFDFC',
  surfacePrimary: '#FFFFFF',
  surfaceSubtle: palette.gray[50],

  // Text
  textPrimary: palette.gray[800],
  textSecondary: palette.gray[600],
  textMuted: palette.gray[500],
  textInverse: '#FFFFFF',

  // Borders
  border: palette.gray[200],
  borderStrong: palette.gray[300],

  // Brand
  brand: palette.brand[500],
  brandHover: palette.brand[600],
  brandSubtle: palette.brand[50],
  brandStrong: palette.brand[700],
  onBrand: '#FFFFFF',

  // Semantic
  success: palette.success[500],
  successSubtle: palette.success[50],
  warning: palette.warning[500],
  warningSubtle: palette.warning[50],
  danger: palette.danger[500],
  dangerSubtle: palette.danger[50],
  info: palette.info[500],
  infoSubtle: palette.info[50],
} as const;

export type SemanticColors = typeof lightColors;

/**
 * Dark theme — values intentionally left as a placeholder.
 * Populate alongside a `useTheme()` hook when dark mode is needed.
 * Keys MUST match `lightColors` exactly so swapping is zero-churn.
 */
export const darkColors: SemanticColors = lightColors;
