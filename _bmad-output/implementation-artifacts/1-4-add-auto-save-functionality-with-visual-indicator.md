# Story 1.4: Add Auto-Save Functionality with Visual Indicator

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want my notes to auto-save automatically while typing,
so that I never lose my work if I close the browser or lose connectivity.

## Acceptance Criteria

1. **Given** I am editing a note in the markdown editor
2. **When** I type or modify content
3. **Then** Auto-save is triggered after 500ms of inactivity (debounced)
4. **And** Visual indicator shows "Saving..." during API call
5. **And** Visual indicator shows "Saved" when save completes successfully
6. **And** If save fails, indicator shows "Error - Retrying..." and retries up to 3 times
7. **And** Note content is persisted to PostgreSQL via POST /api/notes
8. **And** Save operation completes in <1 second (NFR-P2)
9. **And** Note metadata (createdAt, updatedAt, userId) is automatically captured
10. **And** The system handles both "Create" (first save) and "Update" (subsequent saves) gracefully

## Technical Requirements

- **Hook**: Custom `useAutoSave` hook (`src/hooks/useAutoSave.ts`)
- **Debounce**: `useDebounce` utility hook (`src/hooks/useDebounce.ts`)
- **API**:
  - `POST /api/notes` for creation (auto-triggered if no ID)
  - `PATCH /api/notes/[id]` for updates (standard operation)
- **State Integration**: Connects to `useNoteStore` (from Story 1.3)
  - Listens to `content` changes
  - Updates `saveStatus` ('idle' | 'saving' | 'saved' | 'error')
  - Resets `isDirty` to false on success
- **Visuals**:
  - Simple status text or icon in the header/footer of the editor
  - "Unsaved changes" warning if user tries to leave before auto-save completes (optional enhancement, nice to have)
- **Retry Logic**: Simple retry mechanism (3 attempts) on network failure

## Architecture Compliance

- **Hooks Location**: `src/hooks/`
- **Store Integration**: `src/stores/note-store.ts` needs a new slice or field for `saveStatus` and `lastSavedAt`.
- **API Pattern**: Use route handlers (`/api/notes/...`) consistent with architecture.
- **Data Flow**:
  1. Editor updates Store `content` + `isDirty`.
  2. Component uses `useAutoSave(content, noteId)`.
  3. `useAutoSave` debounces input.
  4. On effect: calls API.
  5. Updates Store `saveStatus`.

## Tasks / Subtasks

- [ ] Update Store (`src/stores/note-store.ts`)
  - [ ] Add `saveStatus`: 'idle' | 'saving' | 'saved' | 'error'
  - [ ] Add `lastSavedAt`: Date | null
  - [ ] Add `noteId`: string | null (to track if created)
  - [ ] Add actions: `setSaveStatus`, `setNoteId`
- [ ] Create `useDebounce` Hook (`src/hooks/useDebounce.ts`)
  - [ ] Standard debounce implementation
- [ ] Create `useAutoSave` Hook (`src/hooks/useAutoSave.ts`)
  - [ ] Import store
  - [ ] Implement effect on debounced content
  - [ ] Handle POST vs PATCH logic based on `noteId` existence
  - [ ] Implement retry logic
- [ ] Implementation API Endpoints
  - [ ] `src/app/api/notes/route.ts` (POST)
  - [ ] `src/app/api/notes/[id]/route.ts` (PATCH)
- [ ] Update Editor Wrapper (`src/app/app/notes/new/page.tsx`)
  - [ ] Integrate `useAutoSave`
  - [ ] Display `SaveStatusIndicator` component
- [ ] Create Status Indicator (`src/components/notes/SaveStatusIndicator.tsx`)
  - [ ] Visual badge/text
- [ ] Verify Implementation
  - [ ] Test auto-creation on first type
  - [ ] Test updates on subsequent typing
  - [ ] Network disconnect simulation (retry logic)

## Dev Context

### Latest Tech Information (React Hooks + Next.js)

**`useAutoSave` Pattern**:

```typescript
import { useEffect, useRef } from "react";
import { useDebounce } from "./useDebounce";
import { useNoteStore } from "@/stores/note-store";

export function useAutoSave() {
  const { content, noteId, isDirty, setSaveStatus, setNoteId, markClean } =
    useNoteStore();
  const debouncedContent = useDebounce(content, 500);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!isDirty || !debouncedContent) return;

    const save = async () => {
      setSaveStatus("saving");
      try {
        const url = noteId ? `/api/notes/${noteId}` : "/api/notes";
        const method = noteId ? "PATCH" : "POST";

        const res = await fetch(url, {
          method,
          body: JSON.stringify({ content: debouncedContent }),
        });

        if (!res.ok) throw new Error("Save failed");

        const data = await res.json();
        if (!noteId && data.id) setNoteId(data.id); // Capture ID on first create

        setSaveStatus("saved");
        markClean(); // Reset dirty flag
      } catch (error) {
        setSaveStatus("error");
        // Retry logic could go here or in a wrapper
      }
    };

    save();
  }, [debouncedContent, noteId]);
}
```

## References

- [Epic 1 Specification](../planning-artifacts/epics/epic-1-note-capture-basic-storage.md)
- [Architecture Decisions](../planning-artifacts/architecture/core-architectural-decisions.md)
- [Previous Story (Editor)](./1-3-implement-markdown-editor-with-codemirror-6.md)

## Dev Agent Record

### Agent Model Used

BMad Custom Agent (sm/create-story)

### Debug Log References

- Verified hook pattern for debouncing
- Confirmed API patterns

### Completion Notes List

- Story focuses on the _Auto-Save Mechanism_ and _API Integration_.
- Connects the Editor (1.3) to the Backend (1.2).
