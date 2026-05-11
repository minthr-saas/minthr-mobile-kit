/**
 * ActionSheet — mobile-idiomatic alternative to the web kit's DropdownMenu.
 * Opens a BottomSheet with a list of tappable action items.
 *
 * Supports regular items, danger items, separators, and section labels.
 * On mobile, bottom-anchored sheets are the natural replacement for
 * desktop-style dropdown menus.
 *
 * Usage:
 *   <ActionSheet
 *     visible={open}
 *     onClose={close}
 *     title="Actions"
 *     items={[
 *       { label: 'Edit', icon: 'edit-2', onPress: handleEdit },
 *       { type: 'separator' },
 *       { label: 'Delete', icon: 'trash-2', variant: 'danger', onPress: handleDelete },
 *     ]}
 *   />
 */
import { Feather } from '@expo/vector-icons';
import {
  Modal as RNModal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Text } from './Text';
import { borders } from './tokens/borders';
import { lightColors, palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { shadows } from './tokens/shadows';
import { spacing } from './tokens/spacing';
import { fontWeight } from './tokens/typography';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActionSheetItemVariant = 'default' | 'danger';

export type ActionSheetRegularItem = {
  type?: 'item';
  label: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  variant?: ActionSheetItemVariant;
  disabled?: boolean;
  onPress?: () => void;
};

export type ActionSheetSeparatorItem = {
  type: 'separator';
};

export type ActionSheetSectionItem = {
  type: 'section';
  label: string;
  items: ActionSheetItem[];
};

export type ActionSheetItem =
  | ActionSheetRegularItem
  | ActionSheetSeparatorItem
  | ActionSheetSectionItem;

export interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  items: ActionSheetItem[];
  /** Cancel button label. Defaults to 'Cancel'. Pass `null` to hide. */
  cancelLabel?: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ActionSheet({
  visible,
  onClose,
  title,
  items,
  cancelLabel = 'Cancel',
}: ActionSheetProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
        />
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            {/* Main sheet */}
            <View style={[styles.sheet, shadows.drawer]}>
              <View style={styles.handleWrap}>
                <View style={styles.handle} />
              </View>
              {title ? (
                <View style={styles.titleWrap}>
                  <Text variant="caption" tone="muted">
                    {title}
                  </Text>
                </View>
              ) : null}
              {renderItems(items, onClose)}
            </View>

            {/* Cancel button */}
            {cancelLabel !== null ? (
              <Pressable
                onPress={onClose}
                android_ripple={{ color: lightColors.surfaceSubtle, borderless: false }}
                style={({ pressed }) => [
                  styles.cancelButton,
                  shadows.sm,
                  pressed && styles.cancelPressed,
                ]}>
                <Text
                  variant="body"
                  tone="brand"
                  style={{ fontWeight: fontWeight.medium }}>
                  {cancelLabel}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </RNModal>
  );
}

// ─── Item renderer ────────────────────────────────────────────────────────────

function renderItems(items: ActionSheetItem[], onClose: () => void) {
  return items.map((item, idx) => {
    const type = 'type' in item ? item.type : 'item';

    if (type === 'separator') {
      return <View key={`sep-${idx}`} style={styles.separator} />;
    }

    if (type === 'section') {
      const section = item as ActionSheetSectionItem;
      return (
        <View key={`section-${idx}`}>
          <View style={styles.sectionLabel}>
            <Text variant="caption" tone="muted">
              {section.label}
            </Text>
          </View>
          {renderItems(section.items, onClose)}
        </View>
      );
    }

    const regular = item as ActionSheetRegularItem;
    const isDanger = regular.variant === 'danger';

    return (
      <Pressable
        key={`item-${idx}`}
        onPress={() => {
          regular.onPress?.();
          onClose();
        }}
        disabled={regular.disabled}
        android_ripple={{ color: isDanger ? lightColors.dangerSubtle : lightColors.surfaceSubtle, borderless: false }}
        style={({ pressed }) => [
          styles.item,
          pressed && (isDanger ? styles.itemPressedDanger : styles.itemPressed),
          regular.disabled && styles.itemDisabled,
        ]}>
        {regular.icon ? (
          <Feather
            name={regular.icon}
            size={16}
            color={
              regular.disabled
                ? lightColors.textMuted
                : isDanger
                  ? lightColors.danger
                  : lightColors.textSecondary
            }
          />
        ) : null}
        <Text
          variant="body"
          tone={regular.disabled ? 'muted' : isDanger ? 'danger' : 'primary'}
          style={{ fontWeight: fontWeight.regular, flex: 1 }}>
          {regular.label}
        </Text>
      </Pressable>
    );
  });
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 14, 11, 0.45)',
  },
  container: {
    paddingHorizontal: spacing[2],
    paddingBottom: spacing[6],
    gap: spacing[2],
  },
  sheet: {
    backgroundColor: lightColors.surfacePrimary,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: borders.hair,
    borderColor: lightColors.border,
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.gray[300],
  },
  titleWrap: {
    alignItems: 'center',
    paddingBottom: spacing[2],
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  itemPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  itemPressedDanger: {
    backgroundColor: lightColors.dangerSubtle,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  separator: {
    height: borders.hair,
    backgroundColor: lightColors.border,
    marginHorizontal: spacing[4],
  },
  sectionLabel: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[1],
  },
  cancelButton: {
    backgroundColor: lightColors.surfacePrimary,
    borderRadius: radius.xl,
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderWidth: borders.hair,
    borderColor: lightColors.border,
  },
  cancelPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
});
