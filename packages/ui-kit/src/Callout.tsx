import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { lightColors, palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { Text } from './Text';

export type CalloutAccent = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';

const ACCENT_WIDTH = 3;

export interface CalloutProps extends ViewProps {
  accent?: CalloutAccent;
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function Callout({
  accent = 'neutral',
  title,
  description,
  children,
  style,
  ...rest
}: CalloutProps) {
  return (
    <View {...rest} style={[styles.container, style]}>
      <View style={[styles.accent, { backgroundColor: accentColors[accent] }]} />
      <View style={styles.content}>
        {title ? (
          <Text variant="body" style={styles.title}>
            {title}
          </Text>
        ) : null}
        {description ? (
          <Text variant="caption" tone="secondary">
            {description}
          </Text>
        ) : null}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: lightColors.surfaceSubtle,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  accent: {
    width: ACCENT_WIDTH,
  },
  content: {
    flex: 1,
    padding: spacing[3],
    gap: 2,
  },
  title: {
    fontWeight: '500',
  },
});

const accentColors: Record<CalloutAccent, string> = {
  neutral: palette.gray[400],
  brand: lightColors.brand,
  info: lightColors.info,
  success: lightColors.success,
  warning: lightColors.warning,
  danger: lightColors.danger,
};
