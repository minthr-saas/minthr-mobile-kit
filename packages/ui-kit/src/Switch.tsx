import { Platform, Switch as RNSwitch, StyleSheet, View } from 'react-native';

import { lightColors, palette } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';
import { Text } from './Text';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export function Switch({ value, onValueChange, disabled, label, description }: SwitchProps) {
  const control = (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: palette.gray[200], true: lightColors.brand }}
      thumbColor={Platform.select({
        ios: undefined,
        android: value ? lightColors.surfacePrimary : palette.gray[100],
        default: undefined,
      })}
      ios_backgroundColor={palette.gray[200]}
    />
  );

  if (!label && !description) {
    return control;
  }

  return (
    <View style={[styles.row, disabled && styles.rowDisabled]}>
      <View style={styles.textBlock}>
        {label ? (
          <Text variant="body" style={styles.label}>
            {label}
          </Text>
        ) : null}
        {description ? (
          <Text variant="caption" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>
      {control}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  rowDisabled: {
    opacity: 0.5,
  },
  textBlock: {
    flexShrink: 1,
    gap: 2,
  },
  label: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
});
