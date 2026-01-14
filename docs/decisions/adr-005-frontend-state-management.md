# ADR-005: Frontend State Management

## Status
Accepted

## Date
2026-01-11

## Context

The secondbrain frontend requires state management for:

1. **UI State**: Editor content, loading states, modals, filters, refinement workflow progress
2. **Server State**: Notes, metadata, digests, search results (fetched from API)
3. **User Preferences**: Theme, keyboard shortcuts, UI settings

Key requirements:
- **React Server Components**: Next.js 15 App Router uses RSC for server-side data fetching
- **Simple Client State**: No complex global state (single-user MVP, no collaboration features)
- **TypeScript Native**: Type-safe state updates and selectors
- **Developer Experience**: Solo developer needs simple, understandable patterns
- **Bundle Size**: Keep client bundle small (<100KB for state management library)

Next.js 15 App Router implications:
- Server Components fetch data (no need for client-side data fetching library)
- Client Components only for interactive UI (editor, modals, forms)
- Session management handled by Supabase Auth (JWT tokens, no need for Redux sessions)

## Decision

We will use a **hybrid approach**:
1. **React Server Components (RSC)** for server data fetching
2. **Zustand** for client-side UI state management

**Zustand Configuration:**
```typescript
// src/stores/note-store.ts
import { create } from 'zustand';

interface NoteStore {
  // State
  currentContent: string;
  isDirty: boolean;
  isSaving: boolean;

  // Actions
  setContent: (content: string) => void;
  markDirty: () => void;
  setSaving: (saving: boolean) => void;
  reset: () => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  currentContent: '',
  isDirty: false,
  isSaving: false,

  setContent: (content) => set({ currentContent: content, isDirty: true }),
  markDirty: () => set({ isDirty: true }),
  setSaving: (saving) => set({ isSaving: saving }),
  reset: () => set({ currentContent: '', isDirty: false, isSaving: false })
}));

// Usage in Client Component
'use client';

import { useNoteStore } from '@/stores/note-store';

export function NoteEditor() {
  const { currentContent, isDirty, setContent } = useNoteStore();

  return (
    <div>
      <CodeMirror value={currentContent} onChange={setContent} />
      {isDirty && <span>Unsaved changes</span>}
    </div>
  );
}
```

**Server Component Data Fetching:**
```typescript
// src/app/app/notes/page.tsx (Server Component)
import { prisma } from '@/lib/prisma/client';
import { NoteList } from '@/components/notes/NoteList';

export default async function NotesPage() {
  // Fetch data server-side (no client state needed)
  const notes = await prisma.note.findMany({
    where: { status: { not: 'archived' } },
    include: { metadata: true },
    orderBy: { createdAt: 'desc' }
  });

  // Pass to Client Component as props
  return <NoteList initialNotes={notes} />;
}
```

**Refinement Workflow Store:**
```typescript
// src/stores/refinement-store.ts
import { create } from 'zustand';

interface RefinementStore {
  currentIndex: number;
  totalNotes: number;
  isReviewing: boolean;

  nextNote: () => void;
  previousNote: () => void;
  setTotalNotes: (count: number) => void;
  startReview: () => void;
  endReview: () => void;
}

export const useRefinementStore = create<RefinementStore>((set) => ({
  currentIndex: 0,
  totalNotes: 0,
  isReviewing: false,

  nextNote: () => set((state) => ({
    currentIndex: Math.min(state.currentIndex + 1, state.totalNotes - 1)
  })),
  previousNote: () => set((state) => ({
    currentIndex: Math.max(state.currentIndex - 1, 0)
  })),
  setTotalNotes: (count) => set({ totalNotes: count }),
  startReview: () => set({ isReviewing: true, currentIndex: 0 }),
  endReview: () => set({ isReviewing: false, currentIndex: 0 })
}));
```

**Why NOT Redux:**
- Supabase Auth handles sessions (no need for Redux session management)
- RSC fetches server data (no need for Redux Toolkit Query / RTK Query)
- No complex global state (single-user, no collaboration)
- Zustand simpler: 3KB vs Redux 47KB + Redux Toolkit 35KB

## Consequences

### Positive
- **Minimal Bundle Size**: Zustand = 3KB (vs Redux 47KB + RTK 35KB)
- **Simple Mental Model**:
  - Server Components → fetch data server-side
  - Zustand → manage UI state client-side
  - No complex middleware, actions, reducers
- **Type-Safe**: TypeScript-native, no need for Redux types boilerplate
- **React Server Components Compatible**: Zustand only used in Client Components
- **No Boilerplate**: Create store in ~10 lines, no actions/reducers/selectors separation
- **DevTools Support**: Zustand DevTools for debugging state changes
- **Immutable Updates Simple**: `set()` function handles immutability, no need for Immer

### Negative
- **No Time-Travel Debugging**: Redux DevTools time-travel not available (acceptable for MVP)
- **No Middleware Ecosystem**: Redux middleware (sagas, thunks) not available (not needed)
- **Manual Persistence**: Must implement localStorage persistence manually (Zustand middleware available)

### Trade-offs Accepted
- **Server Data in Server Components**: Data lives in Server Components, passed as props to Client Components (React 19 pattern)
- **No Global Client-Side Cache**: Server Components re-fetch on navigation (acceptable for MVP, can add SWR/React Query in Phase 2 if needed)

## Alternatives Considered

### Alternative 1: Redux + Redux Toolkit
- **Pros**:
  - Industry standard, massive ecosystem
  - Time-travel debugging
  - Redux Toolkit Query for data fetching/caching
  - Middleware for complex side effects
- **Cons**:
  - **Heavy**: 47KB (Redux) + 35KB (RTK) = 82KB vs Zustand 3KB
  - **Boilerplate**: Actions, reducers, selectors, store configuration
  - **Over-Engineering**: RTK Query redundant with RSC server-side fetching
  - **Session Management**: Not needed (Supabase Auth handles sessions)
  - **Learning Curve**: Steeper for intermediate developer
- **Rejected Because**: Complexity overkill for single-user MVP with RSC data fetching

### Alternative 2: React Context + useReducer
- **Pros**:
  - Zero dependencies, built-in React
  - Simple for small state
- **Cons**:
  - **Performance**: Context re-renders all consumers on any state change
  - **Boilerplate**: Must create Context + Provider + useReducer for each store
  - **No DevTools**: Debugging state changes difficult
  - **Selector Performance**: No built-in memoization (must use useMemo manually)
- **Rejected Because**: Zustand has better performance + DX for same simplicity

### Alternative 3: Jotai (Atomic State Management)
- **Pros**:
  - Tiny (3KB like Zustand)
  - Atomic state (fine-grained reactivity)
  - Built-in persistence, DevTools
- **Cons**:
  - Atom-based model less intuitive than Zustand stores
  - Smaller community than Zustand
  - More concepts to learn (atoms, derived atoms, etc.)
- **Rejected Because**: Zustand's store model simpler for solo developer

### Alternative 4: Recoil (Facebook)
- **Pros**:
  - Atomic state management
  - Facebook-backed (used in production)
- **Cons**:
  - Experimental (still v0.x)
  - Larger bundle (20KB)
  - More complex API than Zustand
  - Less active development recently
- **Rejected Because**: Experimental status + complexity vs Zustand

### Alternative 5: Valtio (Proxy-Based)
- **Pros**:
  - Tiny (3KB)
  - Mutable syntax (feels like plain objects)
  - Auto-tracking (no manual selectors)
- **Cons**:
  - Proxy-based (debugging harder, performance edge cases)
  - Less mature than Zustand
  - Mutable syntax conflicts with React immutability best practices
- **Rejected Because**: Zustand's immutable patterns more idiomatic React

### Alternative 6: TanStack Query (React Query) + useState
- **Pros**:
  - Best-in-class data fetching/caching
  - Stale-while-revalidate patterns
  - Background refetching
- **Cons**:
  - **Redundant with RSC**: Server Components already fetch data server-side
  - Adds complexity (cache invalidation, refetch strategies)
  - Heavier than Zustand (40KB)
- **Rejected Because**: RSC server-side fetching sufficient for MVP, can add React Query in Phase 2 if needed

## Related Decisions
- ADR-002: Database & Auth Strategy (Supabase Auth handles sessions, no Redux needed)
- ADR-004: Async Processing (Bull Queue handles background jobs, no Redux sagas needed)
- Epic 1 (Note Capture): `note-store.ts` for editor state
- Epic 4 (Refinement Workflow): `refinement-store.ts` for workflow progress

## Implementation Notes

**Epic 0 Story 0.3: Setup State Management**

1. Install Zustand:
```bash
npm install zustand
```

2. Create store directory:
```bash
mkdir -p src/stores
```

3. Create initial stores:
   - `src/stores/note-store.ts` (editor state)
   - `src/stores/refinement-store.ts` (refinement workflow)
   - `src/stores/search-store.ts` (search filters)
   - `src/stores/app-store.ts` (global UI state)

**Success Criteria:**
- ✅ `useNoteStore()` hook works in Client Components
- ✅ State updates trigger re-renders correctly
- ✅ Zustand DevTools connected (browser extension)
- ✅ TypeScript types inferred correctly (no `any` types)

**Testing Pattern:**
```typescript
// src/stores/note-store.test.ts
import { renderHook, act } from '@testing-library/react';
import { useNoteStore } from './note-store';

describe('useNoteStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useNoteStore.setState({ currentContent: '', isDirty: false, isSaving: false });
  });

  it('updates content and marks dirty', () => {
    const { result } = renderHook(() => useNoteStore());

    act(() => {
      result.current.setContent('New content');
    });

    expect(result.current.currentContent).toBe('New content');
    expect(result.current.isDirty).toBe(true);
  });

  it('resets state correctly', () => {
    const { result } = renderHook(() => useNoteStore());

    act(() => {
      result.current.setContent('Test');
      result.current.reset();
    });

    expect(result.current.currentContent).toBe('');
    expect(result.current.isDirty).toBe(false);
  });
});
```

**Zustand DevTools Setup:**
```typescript
// src/stores/note-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useNoteStore = create<NoteStore>()(
  devtools(
    (set) => ({
      currentContent: '',
      setContent: (content) => set({ currentContent: content, isDirty: true }),
      // ... rest of store
    }),
    { name: 'NoteStore' } // Show as "NoteStore" in DevTools
  )
);
```

**Persistence (Optional):**
```typescript
// src/stores/app-store.ts (for user preferences)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'light',
      keyboardShortcutsEnabled: true,
      setTheme: (theme) => set({ theme }),
      toggleKeyboardShortcuts: () => set((state) => ({
        keyboardShortcutsEnabled: !state.keyboardShortcutsEnabled
      }))
    }),
    { name: 'app-settings' } // localStorage key
  )
);
```

**Immutability Best Practices:**
```typescript
// ✅ CORRECT: Use spread operators
set((state) => ({ notes: [...state.notes, newNote] }));
set((state) => ({
  notes: state.notes.map(n => n.id === id ? { ...n, ...updates } : n)
}));

// ❌ WRONG: Direct mutation
set((state) => {
  state.notes.push(newNote); // DON'T DO THIS
  return state;
});
```

**Server Component → Client Component Data Flow:**
```typescript
// Server Component (fetches data)
export default async function NotesPage() {
  const notes = await prisma.note.findMany({ ... });
  return <NoteList initialNotes={notes} />; // Pass as prop
}

// Client Component (manages UI state with Zustand)
'use client';
export function NoteList({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes); // Server data in local state
  const { isLoading, setLoading } = useAppStore(); // UI state in Zustand

  // ... UI logic
}
```

**Performance Optimization:**
```typescript
// Use selectors to prevent unnecessary re-renders
const content = useNoteStore((state) => state.currentContent); // Only re-render when content changes
const isDirty = useNoteStore((state) => state.isDirty);         // Only re-render when isDirty changes

// Instead of:
const { content, isDirty, isSaving } = useNoteStore(); // Re-renders on ANY state change
```

**Migration Path (Zustand → Redux):**
If Phase 2 requires Redux (e.g., complex collaboration features, time-travel debugging):
1. Keep Zustand for simple UI state (modals, loading)
2. Add Redux only for complex features (collaboration, undo/redo)
3. **Effort**: 2-3 days to add Redux alongside Zustand

Zustand and Redux can coexist - use the right tool for each use case.
