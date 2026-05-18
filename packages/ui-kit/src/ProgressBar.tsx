import { StyleSheet, View, type ViewProps } from 'react-native';

import { lightColors, palette } from './tokens/colors';
import { radius } from './tokens/radius';

export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';

export interface ProgressBarProps extends ViewProps {
  /** 0 to 1, clamped. */
  value: number;
  variant?: ProgressVariant;
  height?: number;
}

const variantColors: Record<ProgressVariant, string> = {
  default: lightColors.brand,
  success: lightColors.success,
  warning: lightColors.warning,
  danger: lightColors.danger,
};

export function ProgressBar({
  value,
  variant = 'default',
  height = 6,
  style,
  ...rest
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const pct = `${clamped * 100}%` as const;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(clamped * 100), min: 0, max: 100 }}
      {...rest}
      style={[styles.track, { height, borderRadius: height / 2 }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: pct,
            backgroundColor: variantColors[variant],
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: palette.gray[100],
    overflow: 'hidden',
    borderRadius: radius.full,
  },
  fill: {
    height: '100%',
  },
});
