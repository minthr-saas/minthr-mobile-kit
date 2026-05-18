import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Card, SearchBar, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

const PEOPLE = [
  'Sara Boudia',
  'Yassine Amrani',
  'Lina Idrissi',
  'Mehdi Tazi',
  'Imane El Fassi',
  'Karim Bennis',
  'Nour Saidi',
  'Rachid Haddad',
];

export default function SearchBarDemo() {
  const [plain, setPlain] = useState('');
  const [withCancel, setWithCancel] = useState('');

  const filtered = useMemo(
    () =>
      withCancel.length === 0
        ? PEOPLE
        : PEOPLE.filter((p) => p.toLowerCase().includes(withCancel.toLowerCase())),
    [withCancel],
  );

  return (
    <ScrollView
      contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}
      keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'SearchBar' }} />

      <Text variant="body" tone="secondary">
        Mobile-style search input. Magnifier glyph leads, an × clears the field when text is
        present. With <Text variant="body" tone="primary">showCancel</Text>, a Cancel button
        slides in while focused.
      </Text>

      <Section label="Plain">
        <SearchBar value={plain} onChangeText={setPlain} placeholder="Search anything" />
        <Text variant="caption" tone="muted">
          Value: {plain || '—'}
        </Text>
      </Section>

      <Section label="With Cancel + live filter">
        <SearchBar
          value={withCancel}
          onChangeText={setWithCancel}
          placeholder="Search people"
          showCancel
        />
        <View style={{ gap: spacing[2] }}>
          {filtered.map((p) => (
            <Card key={p}>
              <Text variant="body">{p}</Text>
            </Card>
          ))}
          {filtered.length === 0 ? (
            <Text variant="caption" tone="muted">
              No matches.
            </Text>
          ) : null}
        </View>
      </Section>

      <Section label="Disabled">
        <SearchBar value="" onChangeText={() => {}} placeholder="Locked" disabled />
      </Section>
    </ScrollView>
  );
}
