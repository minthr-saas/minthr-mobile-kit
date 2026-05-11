import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import { Paginator, Text, spacing } from '@/components/ui-kit';

export default function PaginatorScreen() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const totalRecords = 125;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Paginator' }} />

      <View style={styles.section}>
        <Text variant="subtitle">Basic Paginator</Text>
        <Text variant="body" tone="secondary">
          Stand-alone pagination controls.
        </Text>
        <Paginator
          currentPage={page}
          totalPages={Math.ceil(totalRecords / rows)}
          totalRecords={totalRecords}
          rowsPerPage={rows}
          onPageChange={setPage}
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">With Rows per Page</Text>
        <Paginator
          currentPage={page}
          totalPages={Math.ceil(totalRecords / rows)}
          totalRecords={totalRecords}
          rowsPerPage={rows}
          onPageChange={setPage}
          onRowsPerPageChange={(r) => {
            setRows(r);
            setPage(1);
          }}
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Custom Labels</Text>
        <Paginator
          currentPage={page}
          totalPages={Math.ceil(50 / 10)}
          totalRecords={50}
          rowsPerPage={10}
          onPageChange={setPage}
          recordLabel={{ singular: 'employee', plural: 'employees' }}
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Empty State</Text>
        <Paginator
          currentPage={1}
          totalPages={0}
          totalRecords={0}
          rowsPerPage={10}
          onPageChange={() => {}}
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
