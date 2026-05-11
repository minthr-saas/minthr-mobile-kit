import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import { CurrencyInput, Text, spacing } from '@/components/ui-kit';

export default function CurrencyInputScreen() {
  const [amount, setAmount] = useState<number | null>(100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'CurrencyInput' }} />

      <View style={styles.section}>
        <Text variant="subtitle">Basic CurrencyInput</Text>
        <Text variant="body" tone="secondary">
          Input with currency symbol and precision.
        </Text>
        <CurrencyInput
          label="Price"
          value={amount}
          onChange={setAmount}
          currency="USD"
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Switchable Currency</Text>
        <Text variant="body" tone="secondary">
          Tap the currency symbol to change it.
        </Text>
        <CurrencyInput
          label="Total Amount"
          value={amount}
          onChange={setAmount}
          currency="EUR"
          switchable
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Symbol at End</Text>
        <CurrencyInput
          value={amount}
          onChange={setAmount}
          currency="MAD"
          symbolPosition="end"
          switchable
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">States</Text>
        <CurrencyInput
          label="Disabled"
          value={123.45}
          onChange={() => {}}
          currency="GBP"
          disabled
        />
        <CurrencyInput
          label="Error"
          value={null}
          onChange={setAmount}
          currency="USD"
          error="Value too low"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: spacing[4],
    gap: spacing[6],
  },
  section: {
    gap: spacing[2],
  },
});
