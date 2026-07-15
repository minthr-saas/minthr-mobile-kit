# 07 — Accessibility

## The baseline
**WCAG 2.1 AA**, adapted to mobile. The kit targets VoiceOver (iOS) and TalkBack (Android), Dynamic Type / font scaling, sufficient contrast, and thumb-friendly tap targets. Component-level accessibility is a precondition for app-level RGAA / European Accessibility Act compliance — but it does not by itself guarantee it (that's the product's job).

## Touch targets — the mobile non-negotiable

Every interactive element has a **minimum 44×44pt** tap target (Apple HIG) / 48×48dp (Material). A control may *look* smaller (e.g. a 28pt `IconButton` sm), but its hittable area must not be.

```tsx
<Pressable hitSlop={8} /* pushes a 28pt glyph to a 44pt target */ >…</Pressable>
```

Keep at least `spacing[2]` (8pt) between adjacent targets so thumbs don't mis-hit.

## Screen reader support (VoiceOver / TalkBack)

Use React Native's accessibility props — **not** web ARIA attributes (there is no `aria-label`, `role`, or `htmlFor` in RN).

| Need | RN prop |
|---|---|
| Announce a control's purpose | `accessibilityLabel="Close"` |
| Declare what it is | `accessibilityRole="button" \| "link" \| "header" \| "image" \| "switch" \| "checkbox" \| "adjustable" \| "alert"` |
| Announce current state | `accessibilityState={{ disabled, selected, checked, expanded, busy }}` |
| Extra context / hint | `accessibilityHint="Opens the filters sheet"` |
| Live updates (toasts) | `accessibilityLiveRegion="polite"` (Android) + `AccessibilityInfo.announceForAccessibility(...)` |
| Hide decorative nodes | `accessibilityElementsHidden` / `importantForAccessibility="no-hide-descendants"` |
| Group a row as one swipe stop | `accessible={true}` on the row wrapper |

```tsx
// Icon-only action
<Pressable accessibilityRole="button" accessibilityLabel="Delete" onPress={onDelete}>
  <Feather name="trash-2" size={16} color={lightColors.danger} />
</Pressable>

// Toggle
<Pressable
  accessibilityRole="switch"
  accessibilityState={{ checked: value }}
  onPress={() => onChange(!value)}
/>
```

### Label the action, not the glyph
`accessibilityLabel="Delete"`, never `"trash icon"`. Screen-reader users need intent, not appearance.

## Focus & activation order

On mobile the "focus order" is the VoiceOver/TalkBack swipe order, which follows the view tree. Keep the JSX order matching the visual order top-to-bottom, start-to-end. Wrap composite rows with `accessible={true}` so they read as one element instead of many fragments.

## Color contrast

- **4.5:1** for body text, **3:1** for large text (≥18pt) and UI components.

Pre-checked pairs (from the token palette):

| Foreground | Background | Ratio |
|---|---|---|
| `textPrimary` (`gray-800`) | white | 15.8:1 |
| `textSecondary` (`gray-600`) | white | 6.1:1 |
| `textMuted` (`gray-500`) | white | 4.6:1 |
| `gray-400` | white | 3.1:1 — **large text / decoration only** |
| white | `brand-500` | 5.4:1 |
| `brand-700` | `brand-50` | 9.2:1 |
| `danger-700` | `danger-50` | 8.1:1 |

Do **not** use `gray-400` (`textMuted` is `gray-500`) for body text.

## Never rely on color alone

- Status `Badge` / `Tag` pair color with text (and often a dot/icon) — never bare color.
- `ProgressBar` conveys value with a visible label where it matters, not only fill length.
- Form errors show an icon + message, not just a red border.

## Dynamic Type / font scaling

`Text` uses point sizes that scale with the OS text-size setting by default. Don't disable scaling globally. For layouts that would break at very large sizes, cap growth with `maxFontSizeMultiplier` rather than turning scaling off, and test at the largest accessibility size.

## Motion

Honor the OS "Reduce Motion" setting for spring/slide animations (`BottomSheet`, `Drawer`, `Toast`):

```tsx
import { AccessibilityInfo } from 'react-native';
const reduced = await AccessibilityInfo.isReduceMotionEnabled();
// when reduced: skip the slide, cross-fade or appear instantly
```

Reanimated exposes the same via `useReducedMotion()`. Kit animations are short (150–250ms); under Reduce Motion they should resolve near-instantly.

## Overlays

- Every `Modal` / `BottomSheet` / `Drawer` is dismissible by the OS back gesture / Android hardware back button **and** an on-screen affordance (backdrop tap, close button, drag-down).
- When an overlay opens, focus should move into it; when it closes, focus returns to the trigger. Use `accessibilityViewIsModal` (iOS) on the overlay container so the screen reader doesn't wander behind it.

## Per-component checklist

Before shipping a component:

1. ♿ `accessibilityRole` + `accessibilityLabel` on every interactive node
2. 🔁 `accessibilityState` reflects checked / selected / disabled / expanded / busy
3. 👆 Tap target ≥44×44pt (add `hitSlop` if the visual is smaller)
4. 🎨 Text contrast ≥4.5:1 (≥3:1 for large / UI)
5. 🔊 VoiceOver and TalkBack both announce it sensibly, in order
6. 🔠 Layout survives the largest Dynamic Type setting
7. 🐢 Respects Reduce Motion
8. ⬅️ Overlays close on OS back + on-screen affordance, and trap the reader while open
