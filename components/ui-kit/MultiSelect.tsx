/**
 * MultiSelect — searchable multi-select for long lists.
 * Mobile adaptation of the web kit's MultiSelect.
 *
 * Opens a sheet (via the SheetProvider host) with a searchable list of options
 * with checkboxes. Selection commits live on each toggle.
 *
 * Usage:
 *   <MultiSelect
 *     values={selectedIds}
 *     onChange={setSelectedIds}
 *     options={[{ label: 'Option 1', value: '1' }]}
 *     placeholder="Select options"
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Checkbox } from './Checkbox';
import { Input } from './Input';
import { type SheetBodyProps, useSheet } from './SheetHost';
import { Text } from './Text';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  disabled?: boolean;
}

export interface MultiSelectProps {
  values?: string[];
  defaultValues?: string[];
  onChange?: (values: string[]) => void;

  options: MultiSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;

  summaryLabel?: (count: number) => string;

  allowSelectAll?: boolean;
  allowCreate?: boolean;
  onCreate?: (newValue: string) => void;

  maxSelections?: number;

  required?: boolean;
  error?: string;
  disabled?: boolean;
}

// ─── Sheet body ───────────────────────────────────────────────────────────────

interface MultiSelectSheetParams {
  options: MultiSelectOption[];
  initialValues: string[];
  onValuesChange: (next: string[]) => void;
  searchPlaceholder: string;
  emptyMessage: string;
  placeholder: string;
  allowSelectAll: boolean;
  allowCreate: boolean;
  onCreate?: (newValue: string) => void;
  maxSelections?: number;
}

function MultiSelectSheetBody({
  params,
  handleClose = () => {},
}: SheetBodyProps<MultiSelectSheetParams>) {
  const [search, setSearch] = useState('');
  const [currentValues, setCurrentValues] = useState<string[]>(params.initialValues);

  const filteredOptions = useMemo(() => {
    if (!search) return params.options;
    const q = search.toLowerCase();
    return params.options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.description?.toLowerCase().includes(q) ?? false),
    );
  }, [params.options, search]);

  const exactMatch = params.options.some(
    (o) => o.label.toLowerCase() === search.trim().toLowerCase(),
  );
  const showCreate = params.allowCreate && search.trim().length > 0 && !exactMatch;

  const availableOptions = params.options.filter((o) => !o.disabled);
  const allSelected =
    availableOptions.length > 0 && currentValues.length === availableOptions.length;
  const someSelected = currentValues.length > 0 && !allSelected;
  const reachedMax = params.maxSelections != null && currentValues.length >= params.maxSelections;

  function commit(next: string[]) {
    setCurrentValues(next);
    params.onValuesChange(next);
  }

  function toggleValue(val: string) {
    if (currentValues.includes(val)) {
      commit(currentValues.filter((v) => v !== val));
    } else {
      if (params.maxSelections != null && currentValues.length >= params.maxSelections) return;
      commit([...currentValues, val]);
    }
  }

  function toggleAll() {
    if (allSelected) {
      commit([]);
    } else {
      const available = availableOptions.map((o) => o.value);
      if (params.maxSelections != null) {
        commit(available.slice(0, params.maxSelections));
      } else {
        commit(available);
      }
    }
  }

  function handleCreate() {
    const val = search.trim();
    if (!val) return;
    params.onCreate?.(val);
    if (!currentValues.includes(val)) {
      commit([...currentValues, val]);
    }
    setSearch('');
  }

  return (
    <View style={styles.sheetContent}>
      <View style={styles.titleWrap}>
        <Text variant="subtitle">{params.placeholder}</Text>
      </View>
      <View style={styles.searchWrap}>
        <Input
          placeholder={params.searchPlaceholder}
          value={search}
          onChangeText={setSearch}
          autoFocus
          leftIcon={<Feather name="search" size={16} color={lightColors.textSecondary} />}
        />
      </View>

      <View style={styles.list}>
        {params.allowSelectAll && !search ? (
          <Pressable
            onPress={toggleAll}
            style={({ pressed }) => [
              styles.option,
              pressed && styles.optionPressed,
              styles.selectAllBorder,
            ]}>
            <Checkbox
              checked={allSelected ? true : someSelected ? 'indeterminate' : false}
              onChange={toggleAll}
            />
            <Text variant="body" style={{ marginStart: spacing[3], fontWeight: '500' }}>
              {allSelected ? 'Deselect all' : 'Select all'}
            </Text>
          </Pressable>
        ) : null}

        {filteredOptions.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text variant="body" tone="muted">
              {params.emptyMessage}
            </Text>
          </View>
        ) : (
          filteredOptions.map((item) => {
            const isSelected = currentValues.includes(item.value);
            const isDisabled = item.disabled || (reachedMax && !isSelected);

            return (
              <Pressable
                key={item.value}
                disabled={isDisabled}
                onPress={() => toggleValue(item.value)}
                android_ripple={{ color: lightColors.surfaceSubtle }}
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                  isSelected && styles.optionSelected,
                  isDisabled && styles.optionDisabled,
                ]}>
                <Checkbox
                  checked={isSelected}
                  onChange={() => toggleValue(item.value)}
                  disabled={isDisabled}
                />
                <View style={styles.optionBody}>
                  {item.icon ? (
                    <Feather
                      name={item.icon}
                      size={16}
                      color={lightColors.textSecondary}
                      style={{ marginEnd: spacing[2] }}
                    />
                  ) : null}
                  <View style={{ flex: 1 }}>
                    <Text variant="body" tone={isSelected ? 'brand' : 'primary'}>
                      {item.label}
                    </Text>
                    {item.description ? (
                      <Text variant="caption" tone="secondary">
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            );
          })
        )}

        {showCreate ? (
          <Pressable
            onPress={handleCreate}
            style={({ pressed }) => [
              styles.option,
              pressed && styles.optionPressed,
              { borderTopWidth: borders.hair, borderTopColor: lightColors.border },
            ]}>
            <Feather
              name="plus"
              size={16}
              color={lightColors.brand}
              style={{ marginEnd: spacing[2] }}
            />
            <Text variant="body" tone="brand">
              Create &quot;{search.trim()}&quot;
            </Text>
          </Pressable>
        ) : null}
      </View>

      {(currentValues.length > 0 || params.maxSelections != null) && (
        <View style={styles.footer}>
          <Text variant="caption" tone="secondary">
            {params.maxSelections != null
              ? `${currentValues.length} of ${params.maxSelections} selected`
              : `${currentValues.length} selected`}
          </Text>
          <Pressable onPress={() => commit([])} hitSlop={8}>
            <Text variant="caption" tone="primary" style={{ fontWeight: '500' }}>
              Clear all
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MultiSelect({
  values,
  defaultValues = [],
  onChange,
  options,
  placeholder = 'Select options',
  searchPlaceholder = 'Search…',
  emptyMessage = 'No options found',
  summaryLabel = (n) => `${n} selected`,
  allowSelectAll = false,
  allowCreate = false,
  onCreate,
  maxSelections,
  required,
  error,
  disabled,
}: MultiSelectProps) {
  const sheet = useSheet();
  const [internalValues, setInternalValues] = useState<string[]>(defaultValues);

  const currentValues = values !== undefined ? values : internalValues;

  function handleOpen() {
    sheet.open<MultiSelectSheetParams>({
      isScrollable: true,
      body: MultiSelectSheetBody,
      params: {
        options,
        initialValues: currentValues,
        onValuesChange: (next) => {
          if (values === undefined) setInternalValues(next);
          onChange?.(next);
        },
        searchPlaceholder,
        emptyMessage,
        placeholder,
        allowSelectAll,
        allowCreate,
        onCreate,
        maxSelections,
      },
    });
  }

  const triggerText =
    currentValues.length === 0 ? placeholder : summaryLabel(currentValues.length);

  return (
    <Pressable
      accessibilityRole="combobox"
      accessibilityState={{ expanded: false, disabled }}
      disabled={disabled}
      onPress={handleOpen}
      style={[
        styles.trigger,
        disabled && styles.triggerDisabled,
        error ? styles.triggerError : null,
      ]}>
      <Text
        variant="body"
        tone={currentValues.length > 0 ? (disabled ? 'muted' : 'primary') : 'muted'}
        numberOfLines={1}
        style={{ flex: 1 }}>
        {triggerText}
      </Text>
      <Feather
        name="chevron-down"
        size={16}
        color={disabled ? lightColors.textMuted : lightColors.textSecondary}
      />
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  sheetContent: {
    flex: 1,
  },
  titleWrap: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
  },
  searchWrap: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
  },
  list: {
    paddingVertical: spacing[2],
  },
  emptyWrap: {
    paddingVertical: spacing[8],
    alignItems: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  optionPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  optionSelected: {
    backgroundColor: lightColors.brandSubtle,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionBody: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginStart: spacing[3],
  },
  selectAllBorder: {
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
    marginBottom: spacing[1],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: borders.hair,
    borderTopColor: lightColors.border,
  },
});
