import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  Button,
  Divider,
  Radio,
  RadioGroup,
  type SheetBodyProps,
  Text,
  spacing,
  useSheet,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

// ─── Quick actions sheet ──────────────────────────────────────────────────────

function QuickActionsBody({ handleClose = () => {} }: SheetBodyProps<void>) {
  return (
    <View style={{ padding: spacing[5], gap: spacing[3] }}>
      <Text variant="subtitle">Quick actions</Text>
      <Button label="Mark all as read" variant="secondary" onPress={handleClose} />
      <Button label="Export to CSV" variant="secondary" onPress={handleClose} />
      <Divider spacing="sm" />
      <Button label="Delete all" variant="danger" onPress={handleClose} />
    </View>
  );
}

// ─── Layout picker sheet ──────────────────────────────────────────────────────

interface LayoutPickerParams {
  initial: string;
  onApply: (layout: string) => void;
}

function LayoutPickerBody({
  params,
  handleClose = () => {},
}: SheetBodyProps<LayoutPickerParams>) {
  const [selected, setSelected] = useState(params.initial);

  function handleApply() {
    params.onApply(selected);
    handleClose();
  }

  return (
    <View style={{ padding: spacing[5], gap: spacing[3] }}>
      <Text variant="subtitle">Layout</Text>
      <RadioGroup value={selected} onChange={setSelected}>
        <Radio value="list" label="List" description="One row per item, dense reading." />
        <Radio value="grid" label="Grid" description="Two-column cards." />
        <Radio value="compact" label="Compact" description="Half-height rows, no descriptions." />
      </RadioGroup>
      <Button label="Apply" onPress={handleApply} fullWidth />
    </View>
  );
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

export default function BottomSheetDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'BottomSheet' }} />
      <BottomSheetBody />
    </ScrollView>
  );
}

export function BottomSheetBody() {
  const sheet = useSheet();
  const [layout, setLayout] = useState('list');

  function openActions() {
    sheet.open<void>({ body: QuickActionsBody });
  }

  function openLayoutPicker() {
    sheet.open<LayoutPickerParams>({
      body: LayoutPickerBody,
      params: { initial: layout, onApply: setLayout },
    });
  }

  return (
    <>
      <Text variant="body" tone="secondary">
        Slide-up sheet anchored to the bottom edge. Idiomatic on mobile for action menus, filter
        panels, and pickers — anywhere the user needs context above to remain visible. Sheets are
        opened through the SheetProvider host via the useSheet() hook.
      </Text>

      <Section label="Action sheet">
        <Button label="Open actions" onPress={openActions} />
      </Section>

      <Section label="Filter panel">
        <Button label="Pick layout" variant="secondary" onPress={openLayoutPicker} />
        <Text variant="caption" tone="muted">
          Currently: {layout}
        </Text>
      </Section>
    </>
  );
}
