/**
 * RTL helpers for direction-aware icons and animations.
 *
 * The kit relies on RN's logical layout properties (`marginStart`, `paddingEnd`,
 * `start`, `end`) wherever possible — those auto-flip when the app runs RTL.
 * But two things stay physical and need explicit handling:
 *
 *   1. Icons that carry a directional meaning (chevron-left, chevron-right,
 *      arrow-left, …). These need to flip so "back" still means "back".
 *   2. `transform: [{ translateX }]` — animations are in physical pixel space
 *      and don't auto-flip with `I18nManager.isRTL`.
 *
 * Read `I18nManager.isRTL` lazily (per-render) so a forced direction change
 * after app start is reflected.
 */
import { I18nManager } from 'react-native';

export function isRTL(): boolean {
  return I18nManager.isRTL;
}

/**
 * Pick the chevron that points toward the user's reading direction's *forward*
 * (e.g. "drill into this row" / "next month") or *back* (e.g. "go back" / "previous month").
 *
 *   forwardChevron() → 'chevron-right' in LTR, 'chevron-left' in RTL
 *   backChevron()    → 'chevron-left'  in LTR, 'chevron-right' in RTL
 */
export function forwardChevron(): 'chevron-right' | 'chevron-left' {
  return I18nManager.isRTL ? 'chevron-left' : 'chevron-right';
}

export function backChevron(): 'chevron-right' | 'chevron-left' {
  return I18nManager.isRTL ? 'chevron-right' : 'chevron-left';
}

/**
 * Sign multiplier for `translateX` animations that should slide in the
 * direction of the trailing edge (i.e. away from the user's start).
 * In LTR: +1 (off-screen to the right). In RTL: -1 (off-screen to the left).
 */
export function rtlSign(): 1 | -1 {
  return I18nManager.isRTL ? -1 : 1;
}
