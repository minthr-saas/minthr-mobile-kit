import { Feather } from '@expo/vector-icons';
import { useMemo, type ComponentProps, type ReactElement } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

export type ToggleGroupVariant = 'solid' | 'soft';
export type ToggleGroupSize = 'sm' | 'md';

export interface ToggleGroupOption<T extends string = string> {
  value: T;
  /** Optional when `icon` is set, so a pill can be icon-only. */
  label?: string;
  /** Feather icon name, rendered before the label and tinted to match it. */
  icon?: ComponentProps<typeof Feather>['name'];
  /** Dims the pill and blocks selection. */
  disabled?: boolean;
}

interface ToggleGroupBaseProps<T extends string> extends Omit<ViewProps, 'children'> {
  options: readonly ToggleGroupOption<T>[];
  /** `solid` fills the active pill with brand; `soft` tints it. Defaults to `solid`. */
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  /** Stretch the pills to share the row evenly. Defaults to true. */
  fullWidth?: boolean;
  disabled?: boolean;
}

interface ToggleGroupSingleProps<T extends string> extends ToggleGroupBaseProps<T> {
  multiple?: false;
  value: T | null;
  onChange: (value: T) => void;
  allowDeselect?: false;
}

interface ToggleGroupDeselectableProps<T extends string> extends ToggleGroupBaseProps<T> {
  multiple?: false;
  value: T | null;
  onChange: (value: T | null) => void;
  /** Let a second press on the active pill clear the selection, handing back `null`. */
  allowDeselect: true;
}

interface ToggleGroupMultipleProps<T extends string> extends ToggleGroupBaseProps<T> {
  /** Each pill toggles on its own, so any number of them can be active at once. */
  multiple: true;
  value: readonly T[];
  onChange: (value: T[]) => void;
}

export type ToggleGroupProps<T extends string = string> =
  | ToggleGroupSingleProps<T>
  | ToggleGroupDeselectableProps<T>
  | ToggleGroupMultipleProps<T>;

export function ToggleGroup<T extends string = string>(
  props: ToggleGroupMultipleProps<T>
): ReactElement;
export function ToggleGroup<T extends string = string>(
  props: ToggleGroupDeselectableProps<T>
): ReactElement;
export function ToggleGroup<T extends string = string>(
  props: ToggleGroupSingleProps<T>
): ReactElement;
export function ToggleGroup<T extends string = string>(props: ToggleGroupProps<T>) {
  const {
    options,
    variant = 'solid',
    size = 'md',
    fullWidth = true,
    disabled,
    multiple,
    value,
    onChange,
    allowDeselect,
    style,
    ...rest
  } = props as ToggleGroupBaseProps<T> & {
    multiple?: boolean;
    value: T | readonly T[] | null;
    onChange: (next: any) => void;
    allowDeselect?: boolean;
  };

  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const selected = useMemo<readonly T[]>(() => {
    if (multiple) return (value as readonly T[]) ?? [];
    return value == null ? [] : [value as T];
  }, [multiple, value]);

  const activeStyles = useMemo(
    () =>
      variant === 'soft'
        ? {
            pill: { backgroundColor: colors.brandSubtle },
            content: isDark ? palette.brand[100] : palette.brand[700],
          }
        : {
            pill: { backgroundColor: colors.brand },
            content: colors.onBrand,
          },
    [colors, isDark, variant]
  );

  const handlePress = (option: ToggleGroupOption<T>) => {
    const isActive = selected.includes(option.value);
    if (multiple) {
      const current = (value as readonly T[]) ?? [];
      onChange(isActive ? current.filter((v) => v !== option.value) : [...current, option.value]);
      return;
    }
    if (!isActive) {
      onChange(option.value);
      return;
    }
    if (allowDeselect) onChange(null);
  };

  return (
    <View
      {...rest}
      accessibilityRole={multiple ? undefined : 'radiogroup'}
      style={[
        styles.track,
        { backgroundColor: colors.surfaceSubtle },
        fullWidth ? styles.trackFullWidth : styles.trackInline,
        disabled && styles.disabled,
        style,
      ]}>
      {options.map((option) => {
        const isActive = selected.includes(option.value);
        const pillDisabled = disabled || option.disabled;
        const contentColor = isActive ? activeStyles.content : colors.textSecondary;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive, disabled: pillDisabled }}
            accessibilityLabel={option.label}
            disabled={pillDisabled}
            onPress={() => handlePress(option)}
            style={({ pressed }) => [
              styles.pill,
              styles[size],
              fullWidth && styles.pillFlex,
              isActive && activeStyles.pill,
              !isActive && pressed && { backgroundColor: colors.surfacePrimary },
              isActive && pressed && styles.pressedActive,
              !disabled && option.disabled && styles.disabled,
            ]}>
            {option.icon ? (
              <Feather name={option.icon} size={size === 'sm' ? 11 : 12} color={contentColor} />
            ) : null}
            {option.label ? (
              <Text
                variant={size === 'sm' ? 'micro' : 'caption'}
                color={contentColor}
                numberOfLines={1}
                style={isActive ? styles.labelActive : undefined}>
                {option.label}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    padding: spacing[1],
    borderRadius: radius.full,
  },
  trackFullWidth: {
    alignSelf: 'stretch',
  },
  trackInline: {
    alignSelf: 'flex-start',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    borderRadius: radius.full,
  },
  pillFlex: {
    flex: 1,
  },
  sm: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
  },
  md: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
  },
  labelActive: {
    fontWeight: '500',
  },
  pressedActive: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
