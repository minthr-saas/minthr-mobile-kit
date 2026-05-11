/**
 * SelectionBar — floating bottom-anchored bulk-actions pill.
 * Mobile counterpart of the web kit's SelectionBar.
 *
 * Non-blocking, persistent while `count > 0`. Hides itself when count hits 0.
 * Source-agnostic — works with any list or grid.
 *
 * Usage:
 *   <SelectionBar
 *     count={selectedIds.length}
 *     actions={[
 *       { label: 'Export', icon: 'download', onPress: handleExport },
 *       { label: 'Delete', icon: 'trash-2', variant: 'danger', onPress: handleDelete },
 *     ]}
 *     onClear={() => setSelectedIds([])}
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text as RNText,
  View,
} from 'react-native';
import { useEffect, useRef } from 'react';

import { Text } from './Text';
import { borders } from './tokens/borders';
import { lightColors, palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { shadows } from './tokens/shadows';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectionBarAction {
  label: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  onPress: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export interface SelectionBarProps {
  count: number;
  label?: string;
  actions: SelectionBarAction[];
  onClear?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SelectionBar({
  count,
  label = 'Selected',
  actions,
  onClear,
}: SelectionBarProps) {
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (count > 0) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 200,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 80,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [count > 0]);

  if (count <= 0) return null;

  return (
    <Animated.View
      style={[
        styles.bar,
        shadows.lg,
        { transform: [{ translateY }], opacity },
      ]}
      accessibilityRole="toolbar"
      accessibilityLabel="Bulk actions">
      {/* Count pill + label */}
      <View style={styles.countSection}>
        <View style={styles.countPill}>
          <RNText style={styles.countText}>{count}</RNText>
        </View>
        <Text variant="caption" style={{ fontWeight: fontWeight.medium }}>
          {label}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Actions */}
      <View style={styles.actionsRow}>
        {actions.map((action, i) => {
          const isDanger = action.variant === 'danger';
          return (
            <Pressable
              key={`${action.label}-${i}`}
              onPress={action.onPress}
              disabled={action.disabled}
              android_ripple={{
                color: isDanger ? lightColors.dangerSubtle : lightColors.surfaceSubtle,
                borderless: false,
              }}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && (isDanger ? styles.actionPressedDanger : styles.actionPressed),
                action.disabled && styles.actionDisabled,
              ]}>
              {action.icon ? (
                <Feather
                  name={action.icon}
                  size={14}
                  color={isDanger ? lightColors.danger : lightColors.textPrimary}
                />
              ) : null}
              <Text
                variant="caption"
                tone={isDanger ? 'danger' : 'primary'}
                style={{ fontWeight: fontWeight.medium }}>
                {action.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Clear button */}
      {onClear ? (
        <>
          <View style={styles.divider} />
          <Pressable
            onPress={onClear}
            accessibilityRole="button"
            accessibilityLabel="Clear selection"
            hitSlop={4}
            android_ripple={{ color: lightColors.surfaceSubtle, borderless: false }}
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.actionPressed,
            ]}>
            <Feather name="x" size={14} color={lightColors.textMuted} />
          </Pressable>
        </>
      ) : null}
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: spacing[6],
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    height: 40,
    paddingHorizontal: spacing[3],
    backgroundColor: lightColors.surfacePrimary,
    borderRadius: 9999,
    borderWidth: borders.hair,
    borderColor: lightColors.border,
  },
  countSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  countPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: lightColors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: lightColors.onBrand,
    fontFamily: fontFamily.sans,
    fontSize: 11,
    fontWeight: fontWeight.medium,
    fontVariant: ['tabular-nums'],
  },
  divider: {
    width: borders.hair,
    height: 18,
    backgroundColor: lightColors.border,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    height: 30,
    paddingHorizontal: spacing[2],
    borderRadius: radius.md,
  },
  actionPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  actionPressedDanger: {
    backgroundColor: lightColors.dangerSubtle,
  },
  actionDisabled: {
    opacity: 0.5,
  },
  clearButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
});
