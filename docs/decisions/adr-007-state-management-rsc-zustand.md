# ADR-007: State Management (React Server Components + Zustand)

## Status

Accepted

## Context

- Editor state: Notes, content, metadata
- Refinement workflow: Suggestion tracking, accept/reject state
- Search filters: Query, tags, date range
- Global UI state: Theme, sidebar state
- Solo developer: Minimal complexity preferred

## Decision

Use **React Server Components (RSC) for server-side data + Zustand for client-side UI state**

- Server-side rendering: Database queries in Server Components
- Client-side state: Zustand store (3KB, minimal overhead)
- Form handling: React form hooks + Supabase mutations

## Rationale

- **Reduced bundle size**: RSC keeps data queries on server
- **Minimal boilerplate**: Zustand simpler than Redux
- **Type-safe**: Full TypeScript support
- **Next.js native**: RSC integrated in App Router
- **Easy to learn**: Zustand 5-minute learning curve

## Consequences

### Positive

- ✅ Smaller JavaScript bundles (server-side queries)
- ✅ Simple store API (Zustand)
- ✅ Type-safe state (TypeScript)
- ✅ Native Next.js integration (RSC)
- ✅ Easy to test (pure functions)

### Negative

- ❌ Zustand less feature-rich than Redux
- ❌ RSC debugging less familiar (newer pattern)
- ❌ Middleware not as powerful as Redux

## Alternatives Considered

### Alternative A: Redux + Redux Thunk

- ✅ **Advantages**: Powerful middleware, time-travel debugging
- ❌ **Disadvantages**: Boilerplate, steeper learning curve
- **Rejected**: Overkill for MVP, Zustand simpler

### Alternative B: React Context API

- ✅ **Advantages**: Built-in, no external library
- ❌ **Disadvantages**: Performance issues (re-renders), not scalable
- **Rejected**: Context for simple state only, Zustand better

### Alternative C: Jotai / Recoil

- ✅ **Advantages**: Atomic state management, good DX
- ❌ **Disadvantages**: Less ecosystem, fewer examples
- **Rejected**: Zustand more popular, better docs

## Implementation Notes

### Zustand Store Example

```typescript
// lib/store.ts
import { create } from 'zustand'

interface EditorState {
  currentNoteId: string | null
  isDraft: boolean
  setCurrentNote: (id: string) => void
  setDraft: (draft: boolean) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  currentNoteId: null,
  isDraft: false,
  setCurrentNote: (id) => set({ currentNoteId: id }),
  setDraft: (draft) => set({ isDraft: draft })
}))
```

### Server Component Example

```typescript
// app/notes/page.tsx
import { getNotes } from '@/lib/api/notes'

export default async function NotesPage() {
  const notes = await getNotes()
  
  return (
    <div>
      {notes.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}
```

## Migration Path

**To Redux**: 2-3 days to migrate Zustand stores to Redux (similar API)

**To TanStack Query**: 1-2 days if server-side data caching becomes complex

## See Also

- [ADR-001: Starter Template](./adr-001-starter-template.md) - Next.js RSC support
- [ADR-004: Authentication](./adr-004-authentication-supabase-auth.md) - Auth state
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
