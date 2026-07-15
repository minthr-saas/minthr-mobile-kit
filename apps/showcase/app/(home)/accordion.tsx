import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';

import { Accordion, AccordionItem, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function AccordionDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Accordion' }} />
      <AccordionBody />
    </ScrollView>
  );
}

export function AccordionBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        Collapsible sections grouped in a single hair-bordered surface. By default only one item is
        expanded at a time — pass `multiple` to allow many.
      </Text>

      <Section label="Single open (default)">
        <Accordion defaultExpanded={['profile']}>
          <AccordionItem id="profile" title="Profile">
            <Text variant="body" tone="secondary">
              Your name, photo, and pronouns are visible to everyone in your workspace. Edit these
              from your profile screen.
            </Text>
          </AccordionItem>
          <AccordionItem id="employment" title="Employment">
            <Text variant="body" tone="secondary">
              Role, contract type, and start date are managed by your HR team. Reach out to People
              Ops to request changes.
            </Text>
          </AccordionItem>
          <AccordionItem id="benefits" title="Benefits">
            <Text variant="body" tone="secondary">
              Enrollment in health, dental, and pension plans. Open enrollment runs Nov 1–15.
            </Text>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section label="Multiple open">
        <Accordion multiple defaultExpanded={['data', 'export']}>
          <AccordionItem id="data" title="Data and privacy">
            <Text variant="body" tone="secondary">
              Your personal data is encrypted at rest and only accessible by your direct manager
              and People Ops.
            </Text>
          </AccordionItem>
          <AccordionItem id="export" title="Export your data">
            <Text variant="body" tone="secondary">
              Generate a JSON archive of every record we hold about you. Delivery takes up to 24
              hours.
            </Text>
          </AccordionItem>
          <AccordionItem id="delete" title="Delete account">
            <Text variant="body" tone="secondary">
              Account deletion is irreversible. All your historical reviews and survey responses
              will be detached from your name.
            </Text>
          </AccordionItem>
        </Accordion>
      </Section>
    </>
  );
}
