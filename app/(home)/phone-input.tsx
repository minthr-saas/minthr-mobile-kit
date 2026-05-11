import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import { PhoneInput, Text, spacing } from '@/components/ui-kit';

export default function PhoneInputScreen() {
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('FR');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'PhoneInput' }} />

      <View style={styles.section}>
        <Text variant="subtitle">Basic PhoneInput</Text>
        <Text variant="body" tone="secondary">
          International phone input with country selector.
        </Text>
        <PhoneInput
          label="Phone Number"
          placeholder="6 12 34 56 78"
          value={phone}
          onChangeText={setPhone}
          countryCode={country}
          onCountryChange={setCountry}
        />
        <Text variant="caption" tone="brand">
          Current: +{country} {phone}
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Default Country</Text>
        <PhoneInput
          label="USA Phone"
          defaultCountry="US"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">States</Text>
        <PhoneInput
          label="Disabled"
          disabled
          value="0612345678"
        />
        <PhoneInput
          label="With Error"
          error="Invalid phone number"
          value="123"
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
