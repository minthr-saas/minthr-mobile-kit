import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { Text } from './Text';

export type CheckboxState = 'checked' | 'unchecked' | 'indeterminate';

export interface CheckboxProps {
  checked: boolean | 'indeterminate';
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

const BOX_SIZE = 18;

export function Checkbox({ checked, onChange, disabled, label, description }: CheckboxProps) {
  const state: CheckboxState =
    checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked';
  const filled = state !== 'unchecked';

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: state === 'indeterminate' ? 'mixed' : state === 'checked', disabled }}
      onPress={() => {
        if (disabled) return;
        onChange(state === 'checked' ? false : true);
      }}
      style={[styles.row, disabled && styles.rowDisabled]}>
      <View
        style={[
          styles.box,
          filled ? styles.boxFilled : styles.boxEmpty,
        ]}>
        {state === 'checked' ? (
          <Feather name="check" size={14} color={lightColors.onBrand} />
        ) : state === 'indeterminate' ? (
          <Feather name="minus" size={14} color={lightColors.onBrand} />
        ) : null}
      </View>
      {label || description ? (
        <View style={styles.textBlock}>
          {label ? <Text variant="body">{label}</Text> : null}
          {description ? (
            <Text variant="caption" tone="muted">
              {description}
            </Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  rowDisabled: {
    opacity: 0.5,
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  boxEmpty: {
    backgroundColor: lightColors.surfacePrimary,
    borderWidth: borders.thin,
    borderColor: lightColors.borderStrong,
  },
  boxFilled: {
    backgroundColor: lightColors.brand,
    borderWidth: borders.thin,
    borderColor: lightColors.brand,
  },
  textBlock: {
    flexShrink: 1,
    gap: 2,
  },
});
