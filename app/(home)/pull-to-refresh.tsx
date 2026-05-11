import { Stack } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { Card, PullToRefresh, Text, spacing } from '@/components/ui-kit';

import { Section } from './_components/Section';

function fakeLoad(): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ts = new Date().toLocaleTimeString();
      resolve([
        `Refreshed at ${ts}`,
        'Sara Boudia · checked in',
        'Yassine Amrani · PTO request approved',
        'Lina Idrissi · expense report submitted',
        'Mehdi Tazi · pulse survey response',
      ]);
    }, 900);
  });
}

export default function PullToRefreshDemo() {
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<string[]>([
    'Sara Boudia · checked in',
    'Yassine Amrani · PTO request approved',
    'Lina Idrissi · expense report submitted',
    'Mehdi Tazi · pulse survey response',
  ]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const next = await fakeLoad();
    setItems(next);
    setRefreshing(false);
  }, []);

  return (
    <PullToRefresh
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'PullToRefresh' }} />

      <Text variant="body" tone="secondary">
        Pull down to refresh. Wraps a ScrollView with a kit-tinted RefreshControl. For FlatList
        consumers, use the exported KitRefreshControl directly.
      </Text>

      <Section label="Feed">
        <View style={{ gap: spacing[2] }}>
          {items.map((item, idx) => (
            <Card key={idx}>
              <Text variant="body">{item}</Text>
            </Card>
          ))}
        </View>
      </Section>
    </PullToRefresh>
  );
}
