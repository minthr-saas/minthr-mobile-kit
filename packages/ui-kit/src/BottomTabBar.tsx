/**
 * BottomTabBar — kit-styled bottom navigation bar.
 * Persistent screen chrome. Use as a custom `tabBar` for
 * @react-navigation/bottom-tabs, or wire up manually with local state.
 *
 * Usage:
 *   const [active, setActive] = useState<'home' | 'inbox' | 'profile'>('home');
 *
 *   <BottomTabBar
 *     active={active}
 *     onChange={setActive}
 *     items={[
 *       { key: 'home', label: 'Home', icon: 'home' },
 *       { key: 'inbox', label: 'Inbox', icon: 'inbox', badge: 3 },
 *       { key: 'profile', label: 'Profile', icon: 'user', badge: true },
 *     ]}
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from './Text';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontSize, fontWeight } from './tokens/typography';

export type BottomTabBarVariant = 'default' | 'compact';

export interface BottomTabBarItem<T extends string = string> {
  key: T;
  label: string;
  icon: ComponentProps<typeof Feather>['name'];
  /** number renders a count badge; true renders a dot; undefined renders nothing. */
  badge?: number | boolean;
  disabled?: boolean;
}

export interface BottomTabBarProps<T extends string = string> {
  items: readonly BottomTabBarItem<T>[];
  active: T;
  onChange: (key: T) => void;
  /** 'compact' hides labels (icon-only). Defaults to 'default'. */
  variant?: BottomTabBarVariant;
}

const ROW_HEIGHT = 56;
const ICON_SIZE = 20;

export function BottomTabBar<T extends string = string>({
  items,
  active,
  onChange,
  variant = 'default',
}: BottomTabBarProps<T>) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom },
      ]}
      accessibilityRole="tablist">
      <View style={[styles.row, variant === 'compact' && styles.rowCompact]}>
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <BottomTabBarItemView
              key={item.key}
              item={item}
              active={isActive}
              variant={variant}
              onPress={() => !item.disabled && onChange(item.key)}
            />
          );
        })}
      </View>
    </View>
  );
}

interface BottomTabBarItemViewProps<T extends string> {
  item: BottomTabBarItem<T>;
  active: boolean;
  variant: BottomTabBarVariant;
  onPress: () => void;
}

export function BottomTabBarItemView<T extends string>({
  item,
  active,
  variant,
  onPress,
}: BottomTabBarItemViewProps<T>) {
  const tint = active ? lightColors.brand : lightColors.textSecondary;
  const hasNumericBadge = typeof item.badge === 'number' && item.badge > 0;
  const hasDotBadge = item.badge === true;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: active, disabled: !!item.disabled }}
      disabled={item.disabled}
      onPress={onPress}
      android_ripple={{ color: lightColors.surfaceSubtle, borderless: true }}
      style={({ pressed }) => [
        styles.tab,
        pressed && styles.tabPressed,
        item.disabled && styles.tabDisabled,
      ]}>
      <View style={styles.iconWrap}>
        <Feather name={item.icon} size={ICON_SIZE} color={tint} />
        {hasNumericBadge ? (
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountLabel} numberOfLines={1}>
              {(item.badge as number) > 99 ? '99+' : String(item.badge)}
            </Text>
          </View>
        ) : null}
        {hasDotBadge ? <View style={styles.badgeDot} /> : null}
      </View>
      {variant === 'default' ? (
        <Text
          variant="caption"
          numberOfLines={1}
          style={[
            styles.label,
            { color: tint },
            active && styles.labelActive,
          ]}>
          {item.label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: lightColors.surfacePrimary,
    borderTopWidth: borders.hair,
    borderTopColor: lightColors.border,
  },
  row: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  rowCompact: {
    height: ROW_HEIGHT - spacing[2],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    paddingVertical: spacing[1],
  },
  tabPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  tabDisabled: {
    opacity: 0.4,
  },
  iconWrap: {
    width: ICON_SIZE + spacing[3],
    height: ICON_SIZE + spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
  },
  labelActive: {
    fontWeight: fontWeight.medium,
  },
  badgeCount: {
    position: 'absolute',
    top: -2,
    end: -spacing[1],
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: radius.full,
    backgroundColor: lightColors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountLabel: {
    color: lightColors.onBrand,
    fontSize: 10,
    fontWeight: fontWeight.medium,
    lineHeight: 12,
  },
  badgeDot: {
    position: 'absolute',
    top: 0,
    end: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lightColors.danger,
  },
});
