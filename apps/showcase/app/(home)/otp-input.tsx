import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, OtpInput, Text, useToast, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function OtpInputDemo() {
  const [code, setCode] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [errorCode, setErrorCode] = useState('123');
  const toast = useToast();

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'OtpInput' }} />

      <Text variant="body" tone="secondary">
        Verification code entry. On iOS, the keyboard auto-fill picks up SMS codes via
        textContentType=&quot;oneTimeCode&quot; — no extra wiring required.
      </Text>

      <Section label="6 digits (default)">
        <OtpInput
          value={code}
          onChange={setCode}
          label="Verification code"
          onComplete={(v) => toast.success({ title: 'Code complete', description: v })}
        />
      </Section>

      <Section label="4 digits">
        <OtpInput value={shortCode} onChange={setShortCode} length={4} label="PIN" />
      </Section>

      <Section label="With error">
        <View style={{ gap: spacing[2] }}>
          <OtpInput
            value={errorCode}
            onChange={setErrorCode}
            length={6}
            error="That code is incorrect or expired."
          />
          <Button
            label="Resend code"
            variant="link"
            onPress={() => toast.info('A new code is on its way.')}
          />
        </View>
      </Section>
    </ScrollView>
  );
}
