# 01 — Philosophy

## The one-sentence mission
Build a mobile design system that makes the MintHR app feel like a **premium, native tool** — by removing chrome, not adding decoration, while respecting the platform conventions of iOS and Android.

## The design philosophy: Quiet UI, on mobile

The mobile kit is the sister of the web `@minthr-saas/ui-kit`. It shares the same tokens and the same aesthetic — sometimes called "Quiet UI" or "Neo-flat". Reference points: Linear, Vercel, Attio, and the calmer corners of first-party iOS. The difference is *only* the implementation primitives: React Native's `View` / `Text` / `Pressable` + `StyleSheet` instead of HTML + Tailwind.

**Core beliefs:**

1. **The data is the product.** Chrome (buttons, cards, decorations) gets out of the way so the user can focus on their work — even more so on a small screen where every pixel is scarce.
2. **Borders, not shadows.** Premium means hairline dividers (`borders.hair`, ~0.5px on retina) instead of drop shadows. Shadows are reserved for things that genuinely float: `Modal`, `BottomSheet`, `Popover`/`Menu`, `Tooltip`, `Toast`, `Drawer`.
3. **Typography carries hierarchy.** Size, weight, and color do the work that shadows and colored boxes used to do.
4. **One accent, used sparingly.** Brand green (`lightColors.brand` — `#2C7955`) appears a few times per screen — the primary action, the active tab, one selected state. Never as decoration.
5. **Neutral grayscale does 90% of the work.** A well-chosen warm-gray ramp is worth more than a rainbow palette.
6. **Consistency over creativity.** The fiftieth `Button` should look like the first.
7. **Native where it counts.** Use platform pickers for dates/times, respect the safe area, honor the keyboard, and prefer gestures (swipe, pull-to-refresh, long-press) that mobile users already know.

## What this philosophy rejects

- Drop shadows on cards, buttons, inputs, list rows
- Colored left borders on cards (a 2019 SaaS trope)
- ALL CAPS tracked labels ("TOTAL SURVEYS") — a 2015 signal
- Pastel icon backgrounds next to every stat
- Gradients, mesh backgrounds, glassmorphism, neumorphism
- Font weights above `500` (`fontWeight.medium`); `'600'`, `'700'`, and `'bold'` look heavy in this aesthetic
- Multiple icon families in the same app
- Redundant labels ("28 Total surveys" next to a KPI that already says "28")
- `TouchableOpacity` opacity-flash feedback where `Pressable` gives better control

## What this philosophy values

- Restraint. Removing things is harder than adding things.
- Deterministic colored avatars (same person, same color, always).
- Sentence case everywhere. The app should sound like a colleague, not a billboard.
- Tight line-height on large display text (`lineHeight.tight`) for an expensive feel.
- Native gestures as first-class citizens (swipe-to-action, pull-to-refresh, long-press hints).
- Real semantic empty states, not just "No data".
- Loading states (`Skeleton`, `Spinner`) for every async content area.
- RTL correctness by construction — logical layout props, never physical.

## The premium test

Ask these before shipping any screen:

1. **Count the green.** How many times does brand green appear? Target: a small handful. If everything is green, pull back.
2. **Count the borders.** Every floating element with its own border = noise. Group related items on shared surfaces (`Card`, `List`) with internal dividers.
3. **Count the font weights.** Target: 2 (`'400'` and `'500'`). If you reach for `'700'`, use color or size instead.
4. **Squint test.** Squint at the screen from arm's length. Is the hierarchy still clear?
5. **Thumb test.** Can every interactive target be hit comfortably with a thumb (≥44×44pt)? If not, the density is wrong for mobile.

## Web sister, mobile native

This kit mirrors the web kit's tokens and component vocabulary, but it is **not** a port of web layouts. Where the platform differs, the mobile idiom wins:

| Web pattern | Mobile equivalent in this kit |
|---|---|
| Hover states | Pressed states (`Pressable` `pressed`, `android_ripple`) |
| `<select>` dropdown | `Select` → opens a `BottomSheet` of options |
| Dropdown menu on hover | `Menu` (anchored popover) or `BottomSheet`, opened on tap |
| Tooltip on hover | `Tooltip` on long-press |
| Sidebar / NavRail | `BottomTabBar` for top-level nav, `Drawer` for secondary |
| Pagination controls | Infinite scroll + `PullToRefresh` |
| Right-click / row hover actions | `SwipeableRow` reveal actions |
| Sticky top toolbar | `PageHeader` inside the safe area |

If a familiar web component has no mobile-native counterpart here, that is deliberate — reach for the mobile idiom instead of recreating the web chrome.

## When in doubt

Default to restraint. Remove, don't add. Make it smaller, not bigger. Use gray, not color. Sentence case, not title case. One button, not two. Native gesture, not custom control.

If you can't decide between two options, pick the quieter one.
