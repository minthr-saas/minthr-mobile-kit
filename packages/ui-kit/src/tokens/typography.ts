/**
 * Typography tokens. Per Rule 4 in CLAUDE.md, only weights '400' (regular)
 * and '500' (medium) are exposed. Bold/semibold are intentionally absent.
 */

import { Platform } from 'react-native';

export const fontFamily = {
  sans: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }) as string,
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }) as string,
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 22,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export type FontSize = typeof fontSize;
export type FontWeight = typeof fontWeight;
