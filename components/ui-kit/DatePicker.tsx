/**
 * DatePicker — form input for date selection.
 * Mobile adaptation using @react-native-community/datetimepicker.
 *
 * Usage:
 *   <DatePicker
 *     value={date}
 *     onChange={setDate}
 *     placeholder="Select start date"
 *   />
 */
import { Feather } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Text } from './Text';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  formatDate?: (date: Date) => string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select a date',
  label,
  hint,
  minDate,
  maxDate,
  disabled,
  error,
  formatDate = (d) => d.toLocaleDateString(),
}: DatePickerProps) {
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (event.type === 'set' && selectedDate) {
      onChange?.(selectedDate);
    }
  };

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text variant="caption" tone="secondary" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <Pressable
        onPress={() => !disabled && setShow(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label ?? (value ? formatDate(value) : placeholder)}
        style={[
          styles.trigger,
          disabled && styles.triggerDisabled,
          error ? styles.triggerError : null,
        ]}>
        <Feather
          name="calendar"
          size={16}
          color={disabled ? lightColors.textMuted : lightColors.textSecondary}
          style={{ marginEnd: spacing[2] }}
        />
        <Text
          variant="body"
          tone={value ? (disabled ? 'muted' : 'primary') : 'muted'}
          style={{ flex: 1 }}>
          {value ? formatDate(value) : placeholder}
        </Text>
      </Pressable>

      {error ? (
        <Text variant="caption" tone="danger">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      ) : null}

      {show && (
        <View style={Platform.OS === 'ios' ? styles.iosPickerWrap : undefined}>
          {Platform.OS === 'ios' && (
            <View style={styles.iosHeader}>
              <Pressable onPress={() => setShow(false)}>
                <Text variant="body" tone="brand" style={{ fontWeight: '500' }}>
                  Done
                </Text>
              </Pressable>
            </View>
          )}
          <DateTimePicker
            testID="dateTimePicker"
            value={value || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChange}
            minimumDate={minDate}
            maximumDate={maxDate}
            style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
          />
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[1],
  },
  label: {
    fontWeight: '500',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: spacing[3],
    backgroundColor: lightColors.surfacePrimary,
    borderRadius: radius.md,
    borderWidth: borders.thin,
    borderColor: lightColors.borderStrong,
  },
  triggerDisabled: {
    backgroundColor: lightColors.surfaceSubtle,
    borderColor: lightColors.border,
  },
  triggerError: {
    borderColor: lightColors.danger,
  },
  iosPickerWrap: {
    backgroundColor: lightColors.surfacePrimary,
    borderTopWidth: borders.hair,
    borderTopColor: lightColors.border,
  },
  iosHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing[3],
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
    backgroundColor: lightColors.surfaceSubtle,
  },
  iosPicker: {
    width: '100%',
  },
});
