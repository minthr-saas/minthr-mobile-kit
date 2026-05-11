/**
 * Paginator — custom pagination component.
 * Mobile adaptation of the web kit's Paginator.
 *
 * Designed for mobile screens: uses a simplified display "Page X of Y"
 * with arrow buttons, and a rows-per-page selector if enabled.
 */
import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { IconButton } from './IconButton';
import { Select } from './Select';
import { Text } from './Text';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { spacing } from './tokens/spacing';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaginatorProps {
  currentPage: number; // 1-indexed
  totalPages: number;
  totalRecords: number;
  rowsPerPage: number;
  rowsPerPageOptions?: number[]; // default [10, 25, 50, 100]
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  showRecordCount?: boolean; // default true
  recordLabel?: { singular: string; plural: string };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Paginator({
  currentPage,
  totalPages,
  totalRecords,
  rowsPerPage,
  rowsPerPageOptions = [10, 25, 50, 100],
  onPageChange,
  onRowsPerPageChange,
  showRecordCount = true,
  recordLabel = { singular: 'result', plural: 'results' },
}: PaginatorProps) {
  const isEmpty = totalRecords === 0 || totalPages === 0;
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const firstRecord = isEmpty ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const lastRecord = isEmpty ? 0 : Math.min(currentPage * rowsPerPage, totalRecords);
  const noun = totalRecords === 1 ? recordLabel.singular : recordLabel.plural;

  const selectOptions = rowsPerPageOptions.map((n) => ({
    value: String(n),
    label: String(n),
  }));

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
  };

  return (
    <View style={styles.root}>
      {/* Top row: Record count */}
      {showRecordCount && (
        <View style={styles.countRow}>
          <Text variant="caption" tone="secondary">
            Showing {firstRecord} to {lastRecord} of {totalRecords} {noun}
          </Text>
        </View>
      )}

      <View style={styles.controlsRow}>
        {/* Left: Rows per page */}
        {onRowsPerPageChange ? (
          <View style={styles.rowsControl}>
            <Text variant="caption" tone="secondary" style={{ marginRight: spacing[2] }}>
              Rows:
            </Text>
            <View style={{ width: 80 }}>
              <Select
                options={selectOptions}
                value={String(rowsPerPage)}
                onChange={(v) => onRowsPerPageChange(Number(v))}
              />
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {/* Right: Navigation */}
        <View style={styles.navControl}>
          <IconButton
            icon="chevron-left"
            variant="ghost"
            disabled={isFirstPage || isEmpty}
            onPress={() => goToPage(currentPage - 1)}
            accessibilityLabel="Previous page"
          />
          <Text variant="caption" style={{ marginHorizontal: spacing[2], fontWeight: '500' }}>
            {isEmpty ? '0 of 0' : `${currentPage} of ${totalPages}`}
          </Text>
          <IconButton
            icon="chevron-right"
            variant="ghost"
            disabled={isLastPage || isEmpty}
            onPress={() => goToPage(currentPage + 1)}
            accessibilityLabel="Next page"
          />
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderTopWidth: borders.hair,
    borderTopColor: lightColors.border,
  },
  countRow: {
    marginBottom: spacing[3],
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  navControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
