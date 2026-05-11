import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { Text, Textarea, spacing } from '@/components/ui-kit';

import { Section } from './_components/Section';

export default function TextareaDemo() {
  const [bio, setBio] = useState('');
  const [feedback, setFeedback] = useState('');

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Textarea' }} />

      <Text variant="body" tone="secondary">
        Multi-line text input. Same label / hint / error contract as Input. Pass `rows` to
        configure minimum visible height.
      </Text>

      <Section label="Plain">
        <Textarea placeholder="Type a longer message..." />
      </Section>

      <Section label="With label and hint">
        <Textarea
          label="Bio"
          placeholder="A short paragraph about yourself"
          value={bio}
          onChangeText={setBio}
          hint="Visible to your teammates only."
          rows={3}
        />
      </Section>

      <Section label="With error">
        <Textarea
          label="Feedback"
          placeholder="What could we have done better?"
          value={feedback}
          onChangeText={setFeedback}
          error="Feedback must be at least 20 characters."
          rows={5}
        />
      </Section>
    </ScrollView>
  );
}
