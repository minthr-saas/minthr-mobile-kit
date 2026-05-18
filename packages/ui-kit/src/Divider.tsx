import { StyleSheet, View } from 'react-native';

import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { Text } from './Text';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';

export interface DividerProps {
  orientation?: DividerOrientation;
  label?: string;
  spacing?: DividerSpacing;
}

const spacingMap: Record<DividerSpacing, number> = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
};

export function Divider({
  orientation = 'horizontal',
  label,
  spacing: spaceKey = 'none',
}: DividerProps) {
  const margin = spacingMap[spaceKey];

  if (orientation === 'vertical') {
    return (
      <View
        accessibilityRole="none"
        style={[
          styles.vertical,
          { marginHorizontal: margin },
        ]}
      />
    );
  }

  if (label) {
    return (
      <View
        accessibilityRole="none"
        style={[styles.labelled, { marginVertical: margin }]}>
        <View style={styles.line} />
        <Text variant="caption" tone="muted" style={styles.labelText}>
          {label}
        </Text>
        <View style={styles.line} />
      </View>
    );
  }

  return (
    <View
      accessibilityRole="none"
      style={[styles.horizontal, { marginVertical: margin }]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: borders.hair,
    width: '100%',
    backgroundColor: lightColors.border,
  },
  vertical: {
    width: borders.hair,
    alignSelf: 'stretch',
    backgroundColor: lightColors.border,
  },
  labelled: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  line: {
    flex: 1,
    height: borders.hair,
    backgroundColor: lightColors.border,
  },
  labelText: {
    flexShrink: 0,
  },
});
