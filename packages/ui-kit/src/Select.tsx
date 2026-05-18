import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { type SheetBodyProps, useSheet } from './SheetHost';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { Text } from './Text';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
}

export interface SelectProps<T extends string = string> {
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  /** Sheet title shown when the picker opens. */
  title?: string;
  disabled?: boolean;
  error?: string;
}

interface SelectSheetParams {
  options: readonly SelectOption<string>[];
  value: string | null;
  onChange: (value: string) => void;
  title?: string;
}

function SelectSheetBody({ params, handleClose = () => {} }: SheetBodyProps<SelectSheetParams>) {
  return (
    <View style={sheetStyles.container}>
      {params.title ? (
        <View style={sheetStyles.titleWrap}>
          <Text variant="subtitle">{params.title}</Text>
        </View>
      ) : null}
      {params.options.map((opt, idx) => {
        const isSelected = opt.value === params.value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="button"
            onPress={() => {
              params.onChange(opt.value);
              handleClose();
            }}
            style={({ pressed }) => [
              sheetStyles.option,
              idx > 0 && sheetStyles.optionDivider,
              pressed && sheetStyles.optionPressed,
            ]}>
            <View style={sheetStyles.optionText}>
              <Text variant="body">{opt.label}</Text>
              {opt.description ? (
                <Text variant="caption" tone="muted">
                  {opt.description}
                </Text>
              ) : null}
            </View>
            {isSelected ? (
              <Feather name="check" size={16} color={lightColors.brand} />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export function Select<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  title = 'Choose',
  disabled,
  error,
}: SelectProps<T>) {
  const sheet = useSheet();
  const selected = options.find((o) => o.value === value);

  function handleOpen() {
    sheet.open<SelectSheetParams>({
      body: SelectSheetBody,
      params: {
        options: options as readonly SelectOption<string>[],
        value: value as string | null,
        onChange: (v) => onChange(v as T),
        title,
      },
    });
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={handleOpen}
      style={({ pressed }) => [
        styles.field,
        error ? styles.fieldError : null,
        disabled && styles.fieldDisabled,
        pressed && styles.fieldPressed,
      ]}>
      <Text
        variant="body"
        tone={selected ? 'primary' : 'muted'}
        numberOfLines={1}
        style={styles.value}>
        {selected ? selected.label : placeholder}
      </Text>
      <Feather name="chevron-down" size={16} color={lightColors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: spacing[3],
    backgroundColor: lightColors.surfacePrimary,
    borderColor: lightColors.border,
    borderWidth: borders.hair,
    borderRadius: radius.md,
    gap: spacing[2],
  },
  fieldError: {
    borderColor: lightColors.danger,
    borderWidth: borders.thin,
  },
  fieldDisabled: {
    opacity: 0.5,
  },
  fieldPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  value: {
    flex: 1,
  },
});

const sheetStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
  },
  titleWrap: {
    paddingVertical: spacing[3],
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
    marginBottom: spacing[2],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  optionDivider: {
    borderTopWidth: borders.hair,
    borderTopColor: lightColors.border,
  },
  optionPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
});
