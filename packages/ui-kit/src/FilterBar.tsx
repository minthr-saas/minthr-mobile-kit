import { Feather } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ViewProps } from 'react-native';

import { Tag } from './Tag';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { Text } from './Text';

export interface ActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

export interface FilterBarProps extends ViewProps {
  /** Filter chips currently applied. Each renders as a removable Tag. */
  filters: readonly ActiveFilter[];
  onClearAll?: () => void;
  /** Slot for trigger buttons that open filter pickers (e.g. a sort menu). */
  trigger?: ReactNode;
  /** Tap to open the main filter picker — typically a BottomSheet of options. */
  onAdd?: () => void;
}

export function FilterBar({
  filters,
  onClearAll,
  trigger,
  onAdd,
  style,
  ...rest
}: FilterBarProps) {
  const hasFilters = filters.length > 0;

  return (
    <View {...rest} style={[styles.container, style]}>
      <View style={styles.row}>
        {onAdd ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add filter"
            onPress={onAdd}
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}>
            <Feather name="filter" size={14} color={lightColors.textPrimary} />
            <Text variant="caption" style={styles.addLabel}>
              Filter
            </Text>
          </Pressable>
        ) : null}
        {trigger}
        {hasFilters ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}>
            {filters.map((f) => (
              <Tag
                key={f.key}
                label={f.label}
                variant="brand"
                onRemove={f.onRemove}
              />
            ))}
          </ScrollView>
        ) : null}
        {hasFilters && onClearAll ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear all filters"
            onPress={onClearAll}
            hitSlop={6}>
            <Text variant="caption" tone="brand" style={styles.clearLabel}>
              Clear all
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: lightColors.surfacePrimary,
    borderRadius: radius.md,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    borderWidth: borders.hair,
    borderColor: lightColors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.md,
    borderWidth: borders.hair,
    borderColor: lightColors.border,
    backgroundColor: lightColors.surfacePrimary,
  },
  addButtonPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  addLabel: {
    fontWeight: '500',
  },
  filtersScroll: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[1],
  },
  clearLabel: {
    fontWeight: '500',
  },
});
