import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { borders } from './tokens/borders';
import { lightColors, palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { Text } from './Text';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string = string> extends ViewProps {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  disabled,
  fullWidth = true,
  style,
  ...rest
}: SegmentedControlProps<T>) {
  return (
    <View
      {...rest}
      style={[styles.track, fullWidth && styles.fullWidth, disabled && styles.disabled, style]}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="button"
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onChange(opt.value)}
            style={[styles.segment, fullWidth && styles.segmentFlex, selected && styles.segmentSelected]}>
            <Text
              variant="caption"
              tone={selected ? 'primary' : 'secondary'}
              style={selected ? styles.labelSelected : undefined}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: palette.gray[100],
    borderRadius: radius.md,
    padding: 2,
    gap: 2,
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.5,
  },
  segment: {
    paddingVertical: spacing[1] + 2,
    paddingHorizontal: spacing[3],
    borderRadius: radius.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentFlex: {
    flex: 1,
  },
  segmentSelected: {
    backgroundColor: lightColors.surfacePrimary,
    borderWidth: borders.hair,
    borderColor: lightColors.border,
  },
  labelSelected: {
    fontWeight: '500',
  },
});
