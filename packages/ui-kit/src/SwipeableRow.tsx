/**
 * SwipeableRow — list row that reveals action buttons on horizontal swipe.
 * No real web equivalent. Uses react-native-gesture-handler.
 *
 * Usage:
 *   <SwipeableRow
 *     rightActions={[{ icon: 'trash-2', color: 'danger', onPress: handleDelete }]}
 *     leftActions={[{ icon: 'archive', color: 'brand', onPress: handleArchive }]}>
 *     <ListRowContent />
 *   </SwipeableRow>
 *
 * Mount a GestureHandlerRootView ancestor (mintkit wires one in app/_layout.tsx).
 */
import { Feather } from '@expo/vector-icons';
import { type ComponentProps, type ReactNode, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { Text } from './Text';
import { lightColors } from './tokens/colors';
import { spacing } from './tokens/spacing';

export type SwipeActionColor = 'default' | 'brand' | 'success' | 'danger' | 'warning';

export interface SwipeAction {
  label?: string;
  icon?: ComponentProps<typeof Feather>['name'];
  color?: SwipeActionColor;
  onPress: () => void;
}

export interface SwipeableRowProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  /** Width allotted to each action button. Defaults to 72. */
  actionWidth?: number;
  /** Called after the row closes on its own (e.g. after an action fires). */
  onClose?: () => void;
}

const DEFAULT_ACTION_WIDTH = 72;

function backgroundFor(color: SwipeActionColor): string {
  switch (color) {
    case 'brand':
      return lightColors.brand;
    case 'success':
      return lightColors.success;
    case 'danger':
      return lightColors.danger;
    case 'warning':
      return lightColors.warning;
    default:
      return lightColors.surfaceSubtle;
  }
}

function foregroundFor(color: SwipeActionColor): string {
  return color === 'default' ? lightColors.textPrimary : lightColors.onBrand;
}

export function SwipeableRow({
  children,
  leftActions,
  rightActions,
  actionWidth = DEFAULT_ACTION_WIDTH,
  onClose,
}: SwipeableRowProps) {
  const swipeRef = useRef<Swipeable>(null);

  function renderActions(actions: SwipeAction[], side: 'left' | 'right') {
    return (
      <View
        style={[
          styles.actionsContainer,
          { width: actions.length * actionWidth },
          side === 'left' ? styles.actionsLeft : styles.actionsRight,
        ]}>
        {actions.map((action, idx) => {
          const color = action.color ?? 'default';
          return (
            <Pressable
              key={idx}
              accessibilityRole="button"
              accessibilityLabel={action.label ?? action.icon}
              onPress={() => {
                action.onPress();
                swipeRef.current?.close();
              }}
              android_ripple={{ color: lightColors.surfacePrimary }}
              style={({ pressed }) => [
                styles.action,
                { width: actionWidth, backgroundColor: backgroundFor(color) },
                pressed && styles.actionPressed,
              ]}>
              {action.icon ? (
                <Feather
                  name={action.icon}
                  size={18}
                  color={foregroundFor(color)}
                />
              ) : null}
              {action.label ? (
                <Text
                  variant="caption"
                  style={[styles.actionLabel, { color: foregroundFor(color) }]}
                  numberOfLines={1}>
                  {action.label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <Swipeable
      ref={swipeRef}
      friction={2}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableClose={onClose}
      renderLeftActions={
        leftActions && leftActions.length > 0
          ? () => renderActions(leftActions, 'left')
          : undefined
      }
      renderRightActions={
        rightActions && rightActions.length > 0
          ? () => renderActions(rightActions, 'right')
          : undefined
      }>
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  actionsLeft: {
    justifyContent: 'flex-start',
  },
  actionsRight: {
    justifyContent: 'flex-end',
  },
  action: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionLabel: {
    fontWeight: '500',
  },
});
