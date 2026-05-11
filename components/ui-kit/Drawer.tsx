/**
 * Drawer — side-sliding panel.
 * Mobile counterpart of the web kit's Drawer.
 *
 * Slides in from the right (respects RTL) edge. Use for detail views,
 * settings panels, or form sidebars that don't warrant a full screen push.
 *
 * Usage:
 *   <Drawer visible={open} onClose={close} title="Employee details">
 *     <Text>…content…</Text>
 *   </Drawer>
 */
import { Feather } from '@expo/vector-icons';
import { type ReactNode, useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal as RNModal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Text } from './Text';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { shadows } from './tokens/shadows';
import { spacing } from './tokens/spacing';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DrawerSide = 'start' | 'end';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  /** Footer slot — typically action buttons. */
  footer?: ReactNode;
  /** Which edge the drawer slides from. Defaults to 'end' (right in LTR). */
  side?: DrawerSide;
  /** Width preset. Defaults to 'md'. */
  size?: DrawerSize;
  /** Tap on backdrop dismisses. Defaults to true. */
  dismissOnBackdrop?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const sizeWidths: Record<DrawerSize, number> = {
  sm: Math.min(280, SCREEN_WIDTH * 0.7),
  md: Math.min(340, SCREEN_WIDTH * 0.82),
  lg: Math.min(420, SCREEN_WIDTH * 0.92),
  full: SCREEN_WIDTH,
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Drawer({
  visible,
  onClose,
  title,
  children,
  footer,
  side = 'end',
  size = 'md',
  dismissOnBackdrop = true,
}: DrawerProps) {
  const drawerWidth = sizeWidths[size];
  const slideAnim = useRef(new Animated.Value(drawerWidth)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 220,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: drawerWidth,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, drawerWidth]);

  const translateX = side === 'start'
    ? Animated.multiply(slideAnim, -1)
    : slideAnim;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropOpacity },
          ]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={dismissOnBackdrop ? onClose : undefined}
            accessibilityRole="button"
            accessibilityLabel="Dismiss drawer"
          />
        </Animated.View>

        {/* Drawer panel */}
        <Animated.View
          style={[
            styles.drawer,
            shadows.drawer,
            {
              width: drawerWidth,
              transform: [{ translateX }],
            },
            side === 'start' ? styles.drawerStart : styles.drawerEnd,
          ]}>
          {/* Header */}
          {title || true ? (
            <View style={styles.header}>
              {title ? (
                <Text variant="subtitle" style={{ flex: 1 }} numberOfLines={1}>
                  {title}
                </Text>
              ) : (
                <View style={{ flex: 1 }} />
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close drawer"
                hitSlop={8}
                onPress={onClose}>
                <Feather name="x" size={18} color={lightColors.textSecondary} />
              </Pressable>
            </View>
          ) : null}

          {/* Body */}
          <View style={styles.body}>{children}</View>

          {/* Footer */}
          {footer ? (
            <View style={styles.footer}>{footer}</View>
          ) : null}
        </Animated.View>
      </View>
    </RNModal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 14, 11, 0.45)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: lightColors.surfacePrimary,
  },
  drawerStart: {
    start: 0,
    borderEndWidth: borders.hair,
    borderEndColor: lightColors.border,
  },
  drawerEnd: {
    end: 0,
    borderStartWidth: borders.hair,
    borderStartColor: lightColors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
  },
  body: {
    flex: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: borders.hair,
    borderTopColor: lightColors.border,
  },
});
