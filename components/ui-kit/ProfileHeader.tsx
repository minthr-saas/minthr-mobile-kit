/**
 * ProfileHeader — entity-profile hero strip.
 * Mobile counterpart of the web kit's ProfileHeader.
 *
 * Renders an avatar, name, subtitle, optional status badge, quick-action
 * buttons, and a tabbed navigation slot. Designed for employee / contact
 * profile screens.
 *
 * Usage:
 *   <ProfileHeader
 *     avatar={<Avatar name="Sara Boudia" size="xl" />}
 *     name="Sara Boudia"
 *     subtitle="Software Engineer · Engineering"
 *     status={<Badge label="Active" variant="success" dot />}
 *     quickActions={<>…</>}
 *     tabs={<Tabs … />}
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { fontWeight } from './tokens/typography';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProfileHeaderDensity = 'default' | 'compact';

export interface ProfileHeaderProps extends ViewProps {
  /** Avatar slot — render an <Avatar /> here. */
  avatar?: ReactNode;
  /** Display name. */
  name: string;
  /** Subtitle text — role, department, etc. */
  subtitle?: string;
  /** Status badge slot — e.g. <Badge label="Active" variant="success" dot />. */
  status?: ReactNode;
  /** Extra identity content rendered below the subtitle. */
  identityExtra?: ReactNode;
  /** Quick-action buttons rendered end-aligned. */
  quickActions?: ReactNode;
  /** Overflow menu trigger — renders a '…' button that calls this handler. */
  onOverflowPress?: () => void;
  /** Tab navigation slot — rendered at the bottom edge of the header. */
  tabs?: ReactNode;
  /** Layout density. */
  density?: ProfileHeaderDensity;
  /** Children rendered below the header content. */
  children?: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfileHeader({
  avatar,
  name,
  subtitle,
  status,
  identityExtra,
  quickActions,
  onOverflowPress,
  tabs,
  density = 'default',
  children,
  style,
  ...rest
}: ProfileHeaderProps) {
  const isCompact = density === 'compact';

  return (
    <View
      {...rest}
      style={[
        styles.root,
        isCompact ? styles.rootCompact : styles.rootDefault,
        style,
      ]}>
      {/* Row 1: Avatar + identity + actions */}
      <View style={styles.row1}>
        {/* Start: avatar + identity stack */}
        <View style={styles.identity}>
          {avatar ? <View style={styles.avatarSlot}>{avatar}</View> : null}
          <View style={styles.nameStack}>
            <View style={styles.nameRow}>
              <Text
                variant={isCompact ? 'subtitle' : 'title'}
                numberOfLines={1}
                style={{ fontWeight: fontWeight.medium }}>
                {name}
              </Text>
              {status ? <View style={styles.statusSlot}>{status}</View> : null}
            </View>
            {subtitle ? (
              <Text variant="caption" tone="secondary" numberOfLines={2}>
                {subtitle}
              </Text>
            ) : null}
            {identityExtra ? (
              <View style={styles.identityExtra}>{identityExtra}</View>
            ) : null}
          </View>
        </View>

        {/* End: quick actions + overflow */}
        {(quickActions || onOverflowPress) ? (
          <View style={styles.actions}>
            {quickActions}
            {onOverflowPress ? (
              <Pressable
                onPress={onOverflowPress}
                accessibilityRole="button"
                accessibilityLabel="More actions"
                hitSlop={8}
                android_ripple={{ color: lightColors.surfaceSubtle, borderless: false }}
                style={({ pressed }) => [
                  styles.overflowButton,
                  pressed && styles.overflowPressed,
                ]}>
                <Feather
                  name="more-horizontal"
                  size={18}
                  color={lightColors.textSecondary}
                />
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Row 2: tabs */}
      {tabs ? (
        <View style={styles.tabsRow}>{tabs}</View>
      ) : null}

      {/* Extension */}
      {children ? <View style={styles.extension}>{children}</View> : null}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    backgroundColor: lightColors.surfacePrimary,
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
  },
  rootDefault: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  rootCompact: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  identity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    minWidth: 0,
  },
  avatarSlot: {
    flexShrink: 0,
  },
  nameStack: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  statusSlot: {
    flexShrink: 0,
  },
  identityExtra: {
    marginTop: spacing[1],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flexShrink: 0,
  },
  overflowButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  overflowPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  tabsRow: {
    marginTop: spacing[3],
    marginHorizontal: -spacing[4],
  },
  extension: {
    marginTop: spacing[3],
    paddingBottom: spacing[3],
  },
});
