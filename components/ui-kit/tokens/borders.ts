import { StyleSheet } from 'react-native';

/**
 * Border widths. `hair` resolves to the platform's native sub-pixel line
 * (typically 0.5 on iOS retina, 1 elsewhere) — matches the web kit's
 * `border-hair: 0.5px` aesthetic without iOS aliasing.
 */
export const borders = {
  hair: StyleSheet.hairlineWidth,
  thin: 1,
  thick: 2,
} as const;

export type Borders = typeof borders;
