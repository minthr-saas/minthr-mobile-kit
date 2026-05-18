import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import { DatePicker, Text, spacing } from '@minthr-saas/mobile-ui-kit';

export default function DatePickerScreen() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'DatePicker' }} />

      <View style={styles.section}>
        <Text variant="subtitle">Basic DatePicker</Text>
        <Text variant="body" tone="secondary">
          Native calendar picker wrapper.
        </Text>
        <DatePicker
          label="Select Date"
          value={date}
          onChange={setDate}
        />
        {date && (
          <Text variant="caption" tone="brand">
            Selected: {date.toDateString()}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">With Limits</Text>
        <DatePicker
          label="Future Only"
          value={date}
          onChange={setDate}
          minDate={new Date()}
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">States</Text>
        <DatePicker
          label="Disabled"
          disabled
          placeholder="Cannot pick"
        />
        <DatePicker
          label="With Error"
          error="Date is required"
          value={null}
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
