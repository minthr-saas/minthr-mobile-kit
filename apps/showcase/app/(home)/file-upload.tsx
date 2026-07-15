import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

import { FileUpload, Text, spacing } from '@minthr-saas/mobile-ui-kit';

export default function FileUploadScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'FileUpload' }} />
      <FileUploadBody />
    </ScrollView>
  );
}

export function FileUploadBody() {
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [singleFile, setSingleFile] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  return (
    <>
      <View style={styles.section}>
        <Text variant="subtitle">Single File Upload</Text>
        <Text variant="body" tone="secondary">
          Allows picking one file at a time.
        </Text>
        <FileUpload
          placeholder="Upload your CV"
          values={singleFile}
          onChange={setSingleFile}
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Multiple Files</Text>
        <Text variant="body" tone="secondary">
          Allows multiple selections with list preview.
        </Text>
        <FileUpload
          placeholder="Upload documents"
          values={files}
          onChange={setFiles}
          multiple
          maxFiles={5}
          description="Maximum 5 files. Supports PDF, DOCX."
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">States</Text>
        <FileUpload
          placeholder="Disabled upload"
          disabled
        />
        <FileUpload
          placeholder="Upload with error"
          error="File size too large"
        />
      </View>
    </>
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
