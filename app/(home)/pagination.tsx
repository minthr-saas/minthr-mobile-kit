import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { Pagination, Text, spacing } from '@/components/ui-kit';

import { Section } from './_components/Section';

export default function PaginationDemo() {
  const [shortPage, setShortPage] = useState(1);
  const [longPage, setLongPage] = useState(7);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Pagination' }} />

      <Text variant="body" tone="secondary">
        Page chips with prev / next buttons. Few pages render fully; many pages truncate with
        ellipses, always keeping the first, last, and a window around the current.
      </Text>

      <Section label="Few pages (3 of 5)">
        <Pagination page={shortPage} totalPages={5} onPageChange={setShortPage} />
        <Text variant="caption" tone="muted">
          Current: {shortPage}
        </Text>
      </Section>

      <Section label="Many pages (7 of 24)">
        <Pagination page={longPage} totalPages={24} onPageChange={setLongPage} />
        <Text variant="caption" tone="muted">
          Current: {longPage}
        </Text>
      </Section>

      <Section label="At edges">
        <Pagination page={1} totalPages={24} onPageChange={() => {}} />
        <Pagination page={24} totalPages={24} onPageChange={() => {}} />
      </Section>
    </ScrollView>
  );
}
