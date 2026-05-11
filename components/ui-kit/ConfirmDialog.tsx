/**
 * ConfirmDialog — precomposed yes / no confirmation built on Modal.
 * Mobile counterpart of the web kit's ConfirmDialog.
 *
 * Usage:
 *   <ConfirmDialog
 *     visible={open}
 *     onClose={close}
 *     onConfirm={handleDelete}
 *     title="Delete employee?"
 *     message="This action cannot be undone."
 *     variant="danger"
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Button } from './Button';
import { Modal } from './Modal';
import { Text } from './Text';
import { lightColors, palette } from './tokens/colors';
import { spacing } from './tokens/spacing';

export type ConfirmDialogVariant = 'default' | 'danger';

export interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: ConfirmDialogVariant;
  confirmLabel?: string;
  cancelLabel?: string;
}

const iconMap: Record<ConfirmDialogVariant, { name: React.ComponentProps<typeof Feather>['name']; color: string }> = {
  default: { name: 'help-circle', color: lightColors.brand },
  danger: { name: 'alert-triangle', color: lightColors.danger },
};

export function ConfirmDialog({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'default',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ConfirmDialogProps) {
  const icon = iconMap[variant];

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      actions={
        <>
          <Button label={cancelLabel} variant="ghost" onPress={onClose} />
          <Button
            label={confirmLabel}
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onPress={onConfirm}
          />
        </>
      }>
      <View style={styles.body}>
        <View style={[styles.iconCircle, { backgroundColor: variant === 'danger' ? lightColors.dangerSubtle : lightColors.brandSubtle }]}>
          <Feather name={icon.name} size={20} color={icon.color} />
        </View>
        <Text variant="body" tone="secondary">
          {message}
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing[3],
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
