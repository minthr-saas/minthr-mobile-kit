import { useMemo } from 'react';
import {
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
  StyleSheet,
} from 'react-native';

import { useTheme } from './Theme';
import { fontFamily, fontSize, fontWeight, lineHeight, sansForWeight, scaleFont } from './tokens/typography';

export type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'micro' | 'mono';
export type TextTone = 'primary' | 'secondary' | 'muted' | 'inverse' | 'brand' | 'danger';

export interface TextProps extends RNTextProps {
  /**
   * Type rank. Carries size, family, weight and line-height together — pick it
   * for the element's role, don't rebuild a rank with `style`.
   *
   * `micro` is the bottom rank, for dense metadata only (a unit suffix, a chip
   * label, a ratio). Pair it with `tone="muted"`; it is too small to carry
   * emphasis, so never add a weight to it.
   */
  variant?: TextVariant;
  tone?: TextTone;
  /**
   * Explicit color override for cases `tone` doesn't cover (a semantic color
   * not in `TextTone`, or a caller-computed value like a status color).
   * Takes precedence over `tone`; `style` can still override this.
   */
  color?: string;
  /**
   * Scale the rendered font size to the device (mirrors the app's `RFValue`).
   * On by default — pass `false` for text that must stay a fixed size.
   */
  scaled?: boolean;
}

const variantFontSize: Record<TextVariant, number> = {
  title: fontSize['2xl'],
  subtitle: fontSize.lg,
  body: fontSize.md,
  caption: fontSize.sm,
  micro: fontSize['2xs'],
  mono: fontSize.sm,
};

const variantLineHeight: Record<TextVariant, number> = {
  title: Math.round(fontSize['2xl'] * lineHeight.tight),
  subtitle: Math.round(fontSize.lg * lineHeight.tight),
  body: Math.round(fontSize.md * lineHeight.normal),
  caption: Math.round(fontSize.sm * lineHeight.normal),
  micro: Math.round(fontSize['2xs'] * lineHeight.normal),
  mono: Math.round(fontSize.sm * lineHeight.normal),
};

export function Text({ variant = 'body', tone = 'primary', color, scaled = true, style, ...rest }: TextProps) {
  const { colors } = useTheme();

  const toneStyles = useMemo<Record<TextTone, TextStyle>>(
    () => ({
      primary: { color: colors.textPrimary },
      secondary: { color: colors.textSecondary },
      muted: { color: colors.textMuted },
      inverse: { color: colors.textInverse },
      brand: { color: colors.brand },
      danger: { color: colors.danger },
    }),
    [colors],
  );

  // Custom fonts select by family name, not fontWeight. If a caller overrides
  // the weight inline (e.g. a medium value in a body row) without naming a
  // family, remap to the matching Inter face so the weight actually renders.
  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  const weightRemap: TextStyle | undefined =
    variant !== 'mono' && flat?.fontFamily == null && flat?.fontWeight != null
      ? { fontFamily: sansForWeight(String(flat.fontWeight)) }
      : undefined;

  // Device scaling — apply RFValue to whatever size ends up rendered (an inline
  // fontSize override, else the variant token) so product code passes design
  // sizes and text stays responsive. lineHeight rides the same ratio.
  let scaleOverride: TextStyle | undefined;
  if (scaled) {
    const baseSize =
      typeof flat?.fontSize === 'number' ? flat.fontSize : variantFontSize[variant];
    const scaledSize = scaleFont(baseSize);
    scaleOverride = { fontSize: scaledSize };
    if (baseSize > 0) {
      const baseLine =
        typeof flat?.lineHeight === 'number' ? flat.lineHeight : variantLineHeight[variant];
      scaleOverride.lineHeight = Math.round(baseLine * (scaledSize / baseSize));
    }
  }

  return (
    <RNText
      {...rest}
      style={[
        styles[variant],
        toneStyles[tone],
        color ? { color } : undefined,
        style,
        weightRemap,
        scaleOverride,
      ]}
    />
  );
}

const styles = StyleSheet.create<Record<TextVariant, TextStyle>>({
  title: {
    fontFamily: sansForWeight(fontWeight.medium),
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.medium,
    lineHeight: variantLineHeight.title,
  },
  subtitle: {
    fontFamily: sansForWeight(fontWeight.medium),
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: variantLineHeight.subtitle,
  },
  body: {
    fontFamily: sansForWeight(fontWeight.regular),
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: variantLineHeight.body,
  },
  caption: {
    fontFamily: sansForWeight(fontWeight.regular),
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: variantLineHeight.caption,
  },
  micro: {
    fontFamily: sansForWeight(fontWeight.regular),
    fontSize: fontSize['2xs'],
    fontWeight: fontWeight.regular,
    lineHeight: variantLineHeight.micro,
  },
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: variantLineHeight.mono,
  },
});
