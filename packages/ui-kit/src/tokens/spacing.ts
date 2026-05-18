/**
 * 4px spacing scale. Use the numbered keys (multipliers of 4):
 *   spacing[1] === 4, spacing[2] === 8, spacing[4] === 16, etc.
 *
 * Do not use arbitrary values like 7 or 13 — pick the nearest scale step.
 */

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export type Spacing = typeof spacing;
export type SpacingKey = keyof Spacing;
