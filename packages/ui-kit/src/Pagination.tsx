import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { Text } from './Text';

export interface PaginationProps extends ViewProps {
  /** 1-based current page. */
  page: number;
  /** Total number of pages. */
  totalPages: number;
  onPageChange: (page: number) => void;
}

const VISIBLE_WINDOW = 5;
const SIZE = 32;

export function Pagination({ page, totalPages, onPageChange, style, ...rest }: PaginationProps) {
  const safeTotal = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotal);

  const pages = computeWindow(safePage, safeTotal);

  return (
    <View {...rest} style={[styles.container, style]}>
      <PageButton
        icon="chevron-left"
        accessibilityLabel="Previous page"
        disabled={safePage === 1}
        onPress={() => onPageChange(safePage - 1)}
      />
      {pages.map((p, idx) =>
        p === '…' ? (
          <View key={`gap-${idx}`} style={styles.ellipsis}>
            <Text variant="caption" tone="muted">
              …
            </Text>
          </View>
        ) : (
          <NumberButton key={p} page={p} active={p === safePage} onPress={() => onPageChange(p)} />
        ),
      )}
      <PageButton
        icon="chevron-right"
        accessibilityLabel="Next page"
        disabled={safePage === safeTotal}
        onPress={() => onPageChange(safePage + 1)}
      />
    </View>
  );
}

function computeWindow(page: number, total: number): readonly (number | '…')[] {
  if (total <= VISIBLE_WINDOW + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const left = Math.max(2, page - 1);
  const right = Math.min(total - 1, page + 1);
  const window: (number | '…')[] = [1];
  if (left > 2) window.push('…');
  for (let i = left; i <= right; i++) window.push(i);
  if (right < total - 1) window.push('…');
  window.push(total);
  return window;
}

function NumberButton({
  page,
  active,
  onPress,
}: {
  page: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Go to page ${page}`}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        active ? styles.buttonActive : styles.buttonIdle,
        pressed && !active && styles.buttonPressed,
      ]}>
      <Text variant="caption" tone={active ? 'primary' : 'secondary'} style={active ? styles.activeLabel : undefined}>
        {String(page)}
      </Text>
    </Pressable>
  );
}

function PageButton({
  icon,
  accessibilityLabel,
  disabled,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  accessibilityLabel: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles.buttonIdle,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}>
      <Feather
        name={icon}
        size={14}
        color={disabled ? lightColors.textMuted : lightColors.textPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    flexWrap: 'wrap',
  },
  button: {
    minWidth: SIZE,
    height: SIZE,
    paddingHorizontal: spacing[2],
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIdle: {
    backgroundColor: lightColors.surfacePrimary,
    borderWidth: borders.hair,
    borderColor: lightColors.border,
  },
  buttonActive: {
    backgroundColor: lightColors.brandSubtle,
    borderWidth: borders.thin,
    borderColor: lightColors.brand,
  },
  buttonPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  activeLabel: {
    fontWeight: '500',
  },
  ellipsis: {
    minWidth: SIZE / 1.5,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
