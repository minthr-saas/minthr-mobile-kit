import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import {
  Card,
  DatePicker,
  Form,
  FormField,
  FormRow,
  FormSection,
  Input,
  Select,
  Switch,
  Text,
  Textarea,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

const CONTRACT_OPTIONS = [
  { label: 'Permanent', value: 'cdi' },
  { label: 'Fixed term', value: 'cdd' },
  { label: 'Internship', value: 'internship' },
];

const SITE_OPTIONS = [
  { label: 'Casablanca', value: 'casa' },
  { label: 'Rabat', value: 'rabat' },
];

export default function FormDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Form' }} />
      <FormBody />
    </ScrollView>
  );
}

export function FormBody() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contract, setContract] = useState<string | null>(null);
  const [site, setSite] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [active, setActive] = useState(true);

  return (
    <>
      <Text variant="body" tone="secondary">
        The stack every form screen and form sheet shares. Form owns the content inset and the
        rhythm between fields, FormRow puts two fields on one line, and FormSection groups them
        under a title. Drop kit controls straight in — no per-field wrapper View.
      </Text>

      <Section label="A plain stack">
        <Card padding="none">
          <Form>
            <Input label="Title" floating value={firstName} onChangeText={setFirstName} />
            <Select
              label="Site"
              floating
              options={SITE_OPTIONS}
              value={site}
              onChange={setSite}
            />
          </Form>
        </Card>
      </Section>

      <Section label="Side-by-side fields">
        <Card padding="none">
          <Form>
            <FormRow>
              <Input label="First name" floating value={firstName} onChangeText={setFirstName} />
              <Input label="Last name" floating value={lastName} onChangeText={setLastName} />
            </FormRow>
          </Form>
        </Card>
      </Section>

      <Section label="Titled sections">
        <Card padding="none">
          <Form>
            <FormSection title="Identity">
              <FormRow>
                <Input
                  label="First name"
                  floating
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <Input label="Last name" floating value={lastName} onChangeText={setLastName} />
              </FormRow>
            </FormSection>

            <FormSection
              divided
              title="Contract"
              description="Shown on the employee's profile.">
              <FormRow>
                <Select
                  label="Type"
                  floating
                  options={CONTRACT_OPTIONS}
                  value={contract}
                  onChange={setContract}
                />
                <DatePicker
                  label="Start date"
                  floating
                  value={startDate}
                  onChange={setStartDate}
                />
              </FormRow>
              <Textarea label="Notes" value={notes} onChangeText={setNotes} />
              <FormField label="Active">
                <Switch value={active} onValueChange={setActive} />
              </FormField>
            </FormSection>
          </Form>
        </Card>
      </Section>

      <Section label="padding=none — the parent already insets">
        <Card padding="md">
          <Form padding="none" gap="sm">
            <Input label="Title" floating value={firstName} onChangeText={setFirstName} />
            <Input label="Reference" floating value={lastName} onChangeText={setLastName} />
          </Form>
        </Card>
      </Section>
    </>
  );
}
