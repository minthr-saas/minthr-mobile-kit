import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';

import { fontFamily, fontSize, fontWeight, lineHeight } from './tokens/typography';
import { lightColors } from './tokens/colors';

export type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'mono';
export type TextTone = 'primary' | 'secondary' | 'muted' | 'inverse' | 'brand' | 'danger';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  tone?: TextTone;
}

export function Text({ variant = 'body', tone = 'primary', style, ...rest }: TextProps) {
  return <RNText {...rest} style={[styles[variant], toneStyles[tone], style]} />;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.medium,
    lineHeight: fontSize['2xl'] * lineHeight.tight,
  },
  subtitle: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.lg * lineHeight.tight,
  },
  body: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
});

const toneStyles = StyleSheet.create({
  primary: { color: lightColors.textPrimary },
  secondary: { color: lightColors.textSecondary },
  muted: { color: lightColors.textMuted },
  inverse: { color: lightColors.textInverse },
  brand: { color: lightColors.brand },
  danger: { color: lightColors.danger },
});
