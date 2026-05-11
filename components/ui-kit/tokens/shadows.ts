/**
 * Shadow tokens. Each shadow is a single object that includes both iOS
 * (`shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius`) and Android
 * (`elevation`) fields — RN ignores fields it doesn't apply per platform.
 *
 * Per Rule 1 in CLAUDE.md, shadows go on **floating overlays only**
 * (Modal, BottomSheet, Popover, Tooltip, Toast). Cards, Buttons, Inputs,
 * etc. use borders instead.
 *
 * Note: on Android < API 28, `shadowColor` is ignored — elevation produces
 * a default-color shadow. Prefer `md`/`lg` for consistent cross-platform
 * appearance.
 */

export const shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
  drawer: {
    shadowColor: '#000000',
    shadowOffset: { width: -8, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 6,
  },
} as const;

export type Shadows = typeof shadows;
export type ShadowKey = keyof Shadows;
