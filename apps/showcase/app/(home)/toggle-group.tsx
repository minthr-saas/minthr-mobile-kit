import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { Text, ToggleGroup, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function ToggleGroupDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'ToggleGroup' }} />
      <ToggleGroupBody />
    </ScrollView>
  );
}

export function ToggleGroupBody() {
  const [state, setState] = useState<'active' | 'inactive'>('active');
  const [halves, setHalves] = useState<string[]>(['morning']);
  const [shift, setShift] = useState<'day' | 'night' | null>('day');
  const [density, setDensity] = useState<'compact' | 'cosy'>('cosy');
  const [align, setAlign] = useState<'start' | 'center' | 'end'>('center');

  return (
    <>
      <Text variant="body" tone="secondary">
        Pills on a subtle track, the active one filled with brand. Use it for a two- or
        three-way state a form owns — SegmentedControl stays the quieter choice for switching
        a view.
      </Text>

      <Section label="Pick one (full width — default)">
        <ToggleGroup
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          value={state}
          onChange={setState}
        />
        <Text variant="caption" tone="muted">
          Selected: {state}
        </Text>
      </Section>

      <Section label="Toggle each on its own (multiple)">
        <ToggleGroup
          multiple
          options={[
            { value: 'morning', label: 'Morning' },
            { value: 'afternoon', label: 'Afternoon' },
          ]}
          value={halves}
          onChange={setHalves}
        />
        <Text variant="caption" tone="muted">
          Any number can be active at once, including none: {halves.join(', ') || 'none'}
        </Text>
      </Section>

      <Section label="Soft variant, clearable">
        <ToggleGroup
          variant="soft"
          allowDeselect
          options={[
            { value: 'day', label: 'Day shift' },
            { value: 'night', label: 'Night shift' },
          ]}
          value={shift}
          onChange={setShift}
        />
        <Text variant="caption" tone="muted">
          A second press on the active pill clears it: {shift ?? 'none'}
        </Text>
      </Section>

      <Section label="Small, auto width">
        <ToggleGroup
          size="sm"
          fullWidth={false}
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'cosy', label: 'Cosy' },
          ]}
          value={density}
          onChange={setDensity}
        />
      </Section>

      <Section label="Icons">
        <ToggleGroup
          fullWidth={false}
          options={[
            { value: 'start', icon: 'align-left' },
            { value: 'center', icon: 'align-center' },
            { value: 'end', icon: 'align-right' },
          ]}
          value={align}
          onChange={setAlign}
        />
        <Text variant="caption" tone="muted">
          A pill with an icon and no label renders icon-only.
        </Text>
      </Section>

      <Section label="Disabled">
        <ToggleGroup
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          value={state}
          onChange={setState}
          disabled
        />
        <ToggleGroup
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive', disabled: true },
          ]}
          value={state}
          onChange={setState}
        />
        <Text variant="caption" tone="muted">
          The whole group, or a single pill.
        </Text>
      </Section>
    </>
  );
}
