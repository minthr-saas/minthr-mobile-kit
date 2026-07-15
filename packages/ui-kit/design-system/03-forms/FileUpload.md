# FileUpload

A dashed dropzone that opens the native document picker, with a previewed list of selected files.

## Purpose

Attaching documents — a signed contract, an ID scan, an expense receipt — is a common HR flow. `FileUpload` pairs a tappable **dropzone** (dashed border, upload-cloud icon, prompt + description) with a **file list** that previews each picked file (icon, name, size) and a per-file remove button.

It wraps `expo-document-picker` (`getDocumentAsync`) — the native OS file/document browser — with `copyToCacheDirectory: true`, so you get back a stable local URI you can upload. Supports single or multiple files and an optional cap. The removal control reuses [`IconButton`](../02-actions/IconButton.md).

## Visual anatomy

```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│              ( ⤒ )                 │   ← dropzone (dashed border)
│        Tap to upload a file        │
│        Supports PDF, PNG, JPG      │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
┌────────────────────────────────────┐
│ 📄  contract.pdf                🗑  │   ← file row (solid border)
│     1.24 MB                        │
└────────────────────────────────────┘
```

Dropzone: dashed `1.5`-width `border`, `radius.md`, `spacing[5]` padding, centered; a `Feather` `upload-cloud` (24) in a `48pt` `surfaceSubtle` circle, a medium-weight `placeholder`, and a `secondary` `description`. File rows: `surfacePrimary`, `borders.thin` + `border`, `radius.md`; icon is `image` when the mime type contains "image", otherwise `file`.

## Behavior

- **Single (`multiple={false}`, default)** — picking replaces the current selection with the one chosen file. The dropzone hides once a file is present.
- **Multiple (`multiple={true}`)** — picked files are appended to `values`; the dropzone stays visible so the user can add more.
- **`maxFiles`** — caps the total; new picks beyond the cap are sliced off, and the dropzone hides once the cap is reached.
- **Remove** — each row's trash `IconButton` calls `onChange` with that file filtered out (matched by `uri`).
- **Cancel / errors** — a cancelled picker is a no-op; picker errors are caught and `console.warn`ed (no throw, no error state set).

## States

- **Empty** — only the dropzone.
- **Has files** — the file list; the dropzone shows *only* if `multiple` and under `maxFiles`.
- **Disabled** — `surfaceSubtle` dropzone with `borderStrong`, `muted` icon/text, picking blocked, and the per-row remove buttons hidden.
- **Error** — `danger` border + `dangerSubtle` fill on the dropzone, and the `error` message is *your* responsibility to surface elsewhere (the component styles the dropzone but does not render the `error` string).

## Rules

- **`values` is the source of truth** — it's an array of `expo-document-picker` `DocumentPickerAsset`s (`{ uri, name, size?, mimeType?, … }`). Keep it in your state; the component is controlled.
- **Size is shown in MB** — computed as `size / 1024 / 1024` to 2 decimals, only when the asset reports a `size`.
- **`placeholder` / `description` are sentence case.** Defaults: `"Tap to upload a file"` and `"Supports PDF, PNG, JPG"`. The description is a hint, not an enforced filter — restrict types via the picker if you need to.
- **The dropzone border is dashed** and uses a `1.5` width (the one intentional non-token stroke, for the dashed dropzone convention); its color is the `border` / `borderStrong` / `danger` token.
- **No shadow** (Rule 1) — dropzone and rows are separated by borders.
- **Removal reuses `IconButton`** (`icon="trash-2"`, `variant="danger"`, `size="sm"`) — don't hand-roll a delete affordance.

## Props API

```ts
import type * as DocumentPicker from 'expo-document-picker';

interface FileUploadProps {
  values?: DocumentPicker.DocumentPickerAsset[];               // default []
  onChange?: (assets: DocumentPicker.DocumentPickerAsset[]) => void;
  multiple?: boolean;                                           // default false
  disabled?: boolean;
  error?: string;                                              // styles the dropzone; not rendered as text
  placeholder?: string;                                        // default 'Tap to upload a file'
  description?: string;                                        // default 'Supports PDF, PNG, JPG'
  maxFiles?: number;
}
```

`FileUpload` and `FileUploadProps` are exported. A `DocumentPickerAsset` carries `uri`, `name`, optional `size`, and optional `mimeType`.

## Examples

### Single file
```tsx
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { FileUpload } from '@minthr-saas/mobile-ui-kit';

const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

<FileUpload
  values={files}
  onChange={setFiles}
  placeholder="Upload your contract"
  description="PDF only, up to 10 MB"
/>
```

### Multiple, capped at 3
```tsx
<FileUpload
  values={files}
  onChange={setFiles}
  multiple
  maxFiles={3}
/>
```

### Disabled (read-only attachments)
```tsx
<FileUpload values={existingDocs} disabled />
```

### With a form-level error
```tsx
<FileUpload
  values={files}
  onChange={setFiles}
  error={files.length === 0 ? 'At least one document is required' : undefined}
/>
// Render the message yourself, e.g. under the field, since FileUpload only styles the dropzone.
```

## When NOT to use

- **A profile photo / avatar image** → a dedicated image-picker flow, not a document dropzone.
- **Text the user types** → [`Input`](./Input.md) or [`Textarea`](./Textarea.md).
- **Showing already-uploaded files with download links** (not editing) → a list of [`ListItem`](../08-layout/ListItem.md)s.
- **A camera capture** → an `expo-camera` / `expo-image-picker` flow surfaced through your own trigger.

## Accessibility

- Each file row's remove control is an [`IconButton`](../02-actions/IconButton.md) with `accessibilityLabel="Remove file"`.
- The dropzone is a `Pressable`; its visible `placeholder`/`description` text is what a screen reader reads. If the surrounding form needs an explicit name, label the field group around it (e.g. with a [`FormField`](./FormField.md)).
- When `disabled`, the dropzone's `Pressable` is disabled and remove buttons are hidden, so nothing is falsely actionable.
