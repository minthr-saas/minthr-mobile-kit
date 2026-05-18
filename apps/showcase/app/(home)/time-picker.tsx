import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import { TimePicker, Text, spacing } from '@minthr-saas/mobile-ui-kit';

export default function TimePickerScreen() {
  const [time, setTime] = useState<Date | null>(new Date());

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'TimePicker' }} />

      <View style={styles.section}>
        <Text variant="subtitle">Basic TimePicker</Text>
        <Text variant="body" tone="secondary">
          Native time picker wrapper.
        </Text>
        <TimePicker
          label="Select Time"
          value={time}
          onChange={setTime}
        />
        {time && (
          <Text variant="caption" tone="brand">
            Selected: {time.toLocaleTimeString()}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">States</Text>
        <TimePicker
          label="Disabled"
          disabled
          placeholder="Cannot pick"
        />
        <TimePicker
          label="With Error"
          error="Time must be in the future"
          value={time}
          onChange={setTime}
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
