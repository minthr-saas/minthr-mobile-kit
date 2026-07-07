/**
 * Spinner — circular loading indicator.
 *
 * Wraps RN's ActivityIndicator with kit token colors and a discrete
 * size scale. For determinate / linear progress, use ProgressBar instead.
 */
import { ActivityIndicator, StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { lightColors } from './tokens/colors';
import { spacing } from './tokens/spacing';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerTone = 'brand' | 'neutral' | 'inverse';

export interface SpinnerProps extends ViewProps {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  /** Optional label rendered below the spinner. */
  label?: string;
}

const scaleBySize: Record<SpinnerSize, number> = {
  sm: 0.75,
  md: 1,
  lg: 1.4,
};

const colorByTone: Record<SpinnerTone, string> = {
  brand: lightColors.brand,
  neutral: lightColors.textMuted,
  inverse: lightColors.textInverse,
};

export function Spinner({
  size = 'md',
  tone = 'brand',
  label,
  style,
  ...rest
}: SpinnerProps) {
  return (
    <View {...rest} style={[styles.root, style]}>
      <ActivityIndicator
        size="small"
        color={colorByTone[tone]}
        style={{ transform: [{ scale: scaleBySize[size] }] }}
      />
      {label ? (
        <Text variant="caption" tone="secondary">
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
});
