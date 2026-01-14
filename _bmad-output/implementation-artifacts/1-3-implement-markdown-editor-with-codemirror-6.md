# Story 1.3: Implement Markdown Editor with CodeMirror 6

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to write notes in a markdown editor with syntax highlighting,
so that I can capture notes quickly with proper formatting.

## Acceptance Criteria

1. **Given** I am authenticated and on the note creation or edit page
2. **When** I click "New Note" (Ctrl+N shortcut) or select an existing note
3. **Then** A markdown editor opens using CodeMirror 6
4. **And** Markdown syntax is highlighted in real-time (headings, bold, italic, code blocks, lists)
5. **And** Editor supports standard markdown formatting (# headers, **bold**, _italic_, `code`, [links](url))
6. **And** Editor is keyboard-navigable (Tab for indentation, Shift+Tab for outdent)
7. **And** Editor has a clean, distraction-free interface (no unnecessary toolbars)
8. **And** Editor height adjusts to content (up to viewport height)
9. **And** Placeholder text guides user: "Start typing in markdown..."
10. **And** Content updates in Zustand store (note-store) on change

## Technical Requirements

- **Library**: `@uiw/react-codemirror` (latest, wraps CodeMirror 6)
- **Language Pack**: `@codemirror/lang-markdown`
- **Frontend State**: Zustand store (`src/stores/note-store.ts`) for managing local editor state (content, dirty flag)
- **Styling**: Tailwind CSS for container customization (CodeMirror themes)
- **Keyboard Shortcuts**: Built-in CodeMirror shortcuts + Custom App-level shortcuts (hook later in Epic 10)
- **Theme**: Light Mode (default for MVP), support for custom theme extensions if needed

## Architecture Compliance

- **Component Location**: `src/components/notes/NoteEditor.tsx`
- **Store Location**: `src/stores/note-store.ts`
- **Integration**:
  - The editor MUST NOT manage its own state validation or saving logic directly.
  - It simply syncs content to the Zustand store.
  - Auto-save (Epic 1.4) will react to store changes.
- **Performance**:
  - Load CodeMirror lazily if initial bundle size impact is high (optional optimization).
  - Use `onChange` efficiently (avoid heavy computations on every keystroke).

## Tasks / Subtasks

- [ ] Install Dependencies
  - [ ] `npm install @uiw/react-codemirror @codemirror/lang-markdown @codemirror/view @codemirror/state`
- [ ] Create Zustand Store (`src/stores/note-store.ts`)
  - [ ] Define interface: `content`, `setContent`, `isDirty`, `markDirty`
  - [ ] Implement store with `zustand`
- [ ] Create Editor Component (`src/components/notes/NoteEditor.tsx`)
  - [ ] Import `CodeMirror` and `markdown` extension
  - [ ] Connect to `useNoteStore`
  - [ ] Implement `onChange` handler to update store
  - [ ] Configure basic setup (line numbers off, folding off)
  - [ ] Style container to fill available space
- [ ] Create Note Page Wrapper (`src/app/app/notes/new/page.tsx`)
  - [ ] Basic client component to host `NoteEditor`
- [ ] Verify Implementation
  - [ ] Test typing markdown syntax (headers, lists)
  - [ ] Verify store updates via Redux DevTools or logger
  - [ ] Check responsive resizing

## Dev Context

### Latest Tech Information (@uiw/react-codemirror)

**Basic Usage Pattern**:

```tsx
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { useNoteStore } from "@/stores/note-store";

export function NoteEditor() {
  const { content, setContent } = useNoteStore();

  const onChange = React.useCallback(
    (val: string, viewUpdate: any) => {
      setContent(val);
    },
    [setContent],
  );

  return (
    <CodeMirror
      value={content}
      height="100%"
      extensions={[
        markdown({ base: markdownLanguage, codeLanguages: languages }),
      ]}
      onChange={onChange}
      className="prose max-w-none w-full border-none focus:outline-none"
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: false,
      }}
    />
  );
}
```

**Zustand Store Pattern**:

```typescript
import { create } from "zustand";

interface NoteState {
  content: string;
  isDirty: boolean;
  setContent: (content: string) => void;
  reset: () => void;
}

export const useNoteStore = create<NoteState>((set) => ({
  content: "",
  isDirty: false,
  setContent: (content) => set({ content, isDirty: true }),
  reset: () => set({ content: "", isDirty: false }),
}));
```

## References

- [Epic 1 Specification](../planning-artifacts/epics/epic-1-note-capture-basic-storage.md)
- [Architecture Decisions](../planning-artifacts/architecture/core-architectural-decisions.md)
- [CodeMirror 6 React Docs](https://uiwjs.github.io/react-codemirror/)

## Dev Agent Record

### Agent Model Used

BMad Custom Agent (sm/create-story)

### Debug Log References

- Validated `@uiw/react-codemirror` as the chosen wrapper for CM6
- Confirmed Zustand integration pattern

### Completion Notes List

- Story focuses on the _Editor_ component and _State_ only.
- Auto-save logic is explicitly separated into Story 1.4 to keep this unit testable and focused.
