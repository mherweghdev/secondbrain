# Implementation Patterns & Consistency Rules

## Pattern Categories Defined

**Critical Conflict Points Identified**: 28 areas where AI agents could make different choices without explicit rules

## Naming Patterns

### Database Naming (Prisma)

**Table Names**: PascalCase
```prisma
model Note { }
model NoteMetadata { }
model Connection { }
model Digest { }
model AuditLog { }
```

**Column Names**: camelCase
```prisma
model Note {
  userId      String
  createdAt   DateTime
  rawContent  String
  archivedAt  DateTime?
}
```

**Relations**: Descriptive names
```prisma
connectionsFrom Connection[] @relation("SourceNote")
connectionsTo   Connection[] @relation("TargetNote")
```

**Indexes**: Descriptive with @@index directive
```prisma
@@index([userId, status])
@@index([createdAt])
@@fulltext([content, rawContent])
```

---

### API Naming (Next.js Routes)

**Endpoints**: Plural lowercase with REST semantics
- ✅ `/api/notes` (GET list, POST create)
- ✅ `/api/notes/[id]` (GET single, PATCH update, DELETE archive)
- ✅ `/api/search` (GET with query params)
- ✅ `/api/refine/[id]` (POST trigger refinement)
- ✅ `/api/digests` (GET list, POST generate)

**Route Parameters**: `[id]` dynamic segments
```typescript
// app/api/notes/[id]/route.ts
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) { }
```

**Query Parameters**: camelCase
```typescript
// /api/notes?userId=123&status=raw&limit=50
const { userId, status, limit } = Object.fromEntries(url.searchParams);
```

**HTTP Methods**: Semantic usage
- `GET`: Retrieve data (idempotent)
- `POST`: Create resource or trigger action
- `PATCH`: Partial update
- `PUT`: Full replacement (avoid, use PATCH)
- `DELETE`: Soft delete (archive)

---

### Code Naming (TypeScript)

**Components**: PascalCase files + exports
```typescript
// src/components/notes/NoteEditor.tsx
export function NoteEditor() { }
```

**Functions**: camelCase verbs
```typescript
// src/lib/prisma/notes.ts
export async function createNote() { }
export async function enrichWithClaude() { }
export async function archiveNote() { }
```

**Variables**: camelCase
```typescript
const noteId = '123';
const connectionCount = 5;
const isLoading = false;
```

**Types/Interfaces**: PascalCase
```typescript
// src/types/note.ts
interface Note { }
interface NoteMetadata { }
type ApiResponse<T> = { data: T } | { error: Error };
```

**Enums**: PascalCase keys
```typescript
enum NoteStatus {
  Raw = 'raw',
  Refined = 'refined',
  Archived = 'archived'
}
```

**Constants**: SCREAMING_SNAKE_CASE (environment)
```typescript
// .env.local
DATABASE_URL="..."
CLAUDE_API_KEY="..."
REDIS_URL="..."
```

---

## Structure Patterns

### Project Organization (Next.js 15 App Router)

**Mandatory Structure**:
```
src/
├── app/                    # Next.js App Router (routes)
│   ├── api/               # API Routes (REST endpoints)
│   ├── (auth)/            # Route groups (login, signup)
│   └── app/               # Authenticated app pages
├── components/            # React components
│   ├── notes/            # Feature-based organization
│   ├── digests/
│   ├── refinement/
│   └── ui/               # Reusable UI components
├── lib/                   # Business logic & utilities
│   ├── prisma/           # Prisma client & query functions
│   ├── supabase/         # Supabase auth helpers
│   ├── redis/            # Bull queues & job handlers
│   ├── claude/           # Claude API integration
│   ├── tier1/            # Local heuristics engine
│   ├── validation/       # Zod schemas
│   └── utils/            # Shared utilities
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
└── types/                 # Shared TypeScript types
```

**Test Organization**:
- ✅ **Unit tests**: Co-located `*.test.ts` (e.g., `createNote.test.ts` next to `createNote.ts`)
- ✅ **Integration tests**: `__tests__/integration/` in feature folders
- ✅ **E2E tests**: Root-level `e2e/` (Phase 2, if Playwright/Cypress)

**File Structure Conventions**:
- ✅ **Config files**: Root level (`prisma/`, `.env.local`, `next.config.js`)
- ✅ **Documentation**: `docs/` (ADRs in `docs/decisions/`)
- ✅ **Static assets**: `public/` (Next.js convention)

---

## Format Patterns

### API Response Format (Standardized)

**Success Response**:
```typescript
{
  data: T,           // Type-safe payload
  meta?: {          // Optional metadata
    timestamp: string,
    requestId: string
  }
}
```

**Error Response**:
```typescript
{
  error: {
    message: string,     // User-facing message
    code: string,        // Error code (e.g., "VALIDATION_ERROR")
    details?: unknown    // Optional debug info (dev only)
  }
}
```

**Example Implementation**:
```typescript
// app/api/notes/route.ts
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validData = createNoteSchema.parse(body);
    const note = await createNote(validData);

    return NextResponse.json({ data: note }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors
        }
      }, { status: 400 });
    }

    return NextResponse.json({
      error: { message: 'Internal error', code: 'INTERNAL_ERROR' }
    }, { status: 500 });
  }
}
```

---

### Date/Time Formats

**API JSON**: ISO 8601 strings
```typescript
{
  createdAt: "2026-01-11T14:30:00.000Z",
  updatedAt: "2026-01-11T15:45:23.512Z"
}
```

**Database**: Prisma DateTime (auto-handled)
```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

**UI Display**: date-fns with French locale
```typescript
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

format(new Date(createdAt), 'PPP', { locale: fr });
// "11 janvier 2026"
```

---

### JSON Field Naming

**API Requests/Responses**: camelCase
```typescript
{
  userId: "123",
  noteContent: "...",
  createdAt: "2026-01-11T14:30:00.000Z"
}
```

**Database**: camelCase (Prisma convention)
```prisma
model Note {
  userId     String
  content    String
  createdAt  DateTime
}
```

**Environment Variables**: SCREAMING_SNAKE_CASE
```bash
DATABASE_URL="..."
CLAUDE_API_KEY="..."
NEXT_PUBLIC_SUPABASE_URL="..."
```

---

### Status Code Usage (HTTP)

**Success Codes**:
- `200 OK`: Success (GET, PATCH)
- `201 Created`: Resource created (POST)
- `204 No Content`: Success with no response body (DELETE)

**Client Error Codes**:
- `400 Bad Request`: Validation error (Zod schema failure)
- `401 Unauthorized`: Auth missing or invalid
- `403 Forbidden`: Auth valid but insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: State conflict (e.g., duplicate creation)

**Server Error Codes**:
- `500 Internal Server Error`: Unexpected error
- `503 Service Unavailable`: External service down (Claude API)

---

## Communication Patterns

### Event System (Bull Queue)

**Event Naming**: `ENTITY.ACTION` (lowercase)
```typescript
// src/lib/redis/queues/tier2-queue.ts
tier2Queue.add('note.enrich', {
  noteId: string,
  userId: string,
  priority: number
});

digestQueue.add('digest.generate', {
  userId: string,
  period: 'daily' | 'weekly'
});
```

**Event Payload Structure**: Type-safe
```typescript
// src/types/jobs.ts
interface NoteEnrichJob {
  noteId: string;
  userId: string;
  priority: number;
}

interface DigestGenerateJob {
  userId: string;
  period: 'daily' | 'weekly';
}
```

---

### State Management (Zustand)

**Store Structure**: Actions + State
```typescript
// src/stores/note-store.ts
interface NoteStore {
  // State
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;

  // Actions (camelCase verbs)
  setNotes: (notes: Note[]) => void;
  selectNote: (id: string) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
}
```

**Immutable Updates**: ALWAYS use spread operators
```typescript
// ✅ CORRECT
set((state) => ({ notes: [...state.notes, newNote] }));
set((state) => ({
  notes: state.notes.map(n => n.id === id ? { ...n, ...data } : n)
}));

// ❌ WRONG
state.notes.push(newNote); // Mutation!
```

---

### Logging Format (Pino)

**Structured Logging**: JSON with context
```typescript
// src/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['password', 'token', 'apiKey', 'email'], // Scrub sensitive data
});

// Usage
logger.info({ userId, noteId, action: 'note.created' }, 'Note created successfully');
logger.error({ userId, error: err.message, stack: err.stack }, 'Failed to enrich note');
logger.warn({ userId, tokens: count }, 'Approaching API budget limit');
```

**NEVER log sensitive data**:
- ❌ Passwords
- ❌ API keys / tokens
- ❌ Session IDs
- ❌ Email addresses (in production)

---

## Process Patterns

### Error Handling (Centralized)

**API Routes**: try/catch with standard responses
```typescript
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validData = createNoteSchema.parse(body); // Zod validation

    const note = await createNote(validData);

    return NextResponse.json({ data: note }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors
        }
      }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({
          error: { message: 'Duplicate entry', code: 'DUPLICATE_ERROR' }
        }, { status: 409 });
      }
    }

    logger.error({ error }, 'Unexpected error in POST /api/notes');
    return NextResponse.json({
      error: { message: 'Internal server error', code: 'INTERNAL_ERROR' }
    }, { status: 500 });
  }
}
```

**React Components**: Error boundaries
```typescript
// src/components/ui/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error({ error, errorInfo }, 'React error boundary caught');
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

### Loading State Handling

**Component-Level**: useState for local loading
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

async function handleSave() {
  setIsLoading(true);
  setError(null);
  try {
    await saveNote(content);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}
```

**Global Loading States**: Zustand for app-wide state
```typescript
// src/stores/app-store.ts
interface AppStore {
  isInitializing: boolean;
  globalError: string | null;
  setInitializing: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
}
```

---

### Retry Logic (Bull Queue)

**Exponential Backoff**: Claude API failures
```typescript
// src/lib/redis/queues/tier2-queue.ts
tier2Queue.add('note.enrich', payload, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000  // 2s, 4s, 8s
  }
});

// Job handler
tier2Queue.process(async (job) => {
  try {
    const result = await enrichWithClaude(job.data.noteId);
    return result;
  } catch (error) {
    logger.error({ jobId: job.id, error }, 'Tier-2 enrichment failed');
    throw error; // Bull will retry
  }
});
```

---

## Enforcement Guidelines

**All AI Agents MUST:**

1. ✅ **Respect naming conventions**
   - camelCase for variables/functions
   - PascalCase for components/types
   - lowercase plural for API routes

2. ✅ **Use standardized API response format**
   - `{data: T}` for success
   - `{error: {...}}` for errors

3. ✅ **Validate with Zod at API boundaries**
   - All POST/PATCH requests must validate input
   - No database writes without validation

4. ✅ **Co-locate tests with code**
   - `*.test.ts` next to implementation
   - Integration tests in `__tests__/integration/`

5. ✅ **Use Prisma for ALL database queries**
   - No raw SQL (except FTS if Prisma insufficient)
   - Type-safe queries always

6. ✅ **Log with Pino structured logging**
   - Never `console.log` in production
   - Redact sensitive data automatically

7. ✅ **Immutable state updates in Zustand**
   - Always use spread operators `[...state.notes]`
   - Never mutate state directly

8. ✅ **ISO 8601 dates in JSON APIs**
   - `"2026-01-11T14:30:00.000Z"`
   - No timestamps or custom formats

9. ✅ **TypeScript strict mode**
   - No `any` types (use `unknown` if needed)
   - Explicit return types for functions

10. ✅ **React error boundaries**
    - Wrap app sections in ErrorBoundary
    - Graceful degradation on component errors

---

## Pattern Verification

**Automated Enforcement**:

**ESLint + Prettier**:
```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

**Pre-commit Hooks** (Husky + lint-staged):
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.test.ts": ["jest --findRelatedTests"]
  }
}
```

**TypeScript Strict Checks** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Jest Coverage Thresholds**:
```json
// jest.config.js
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

---

## Pattern Examples

### ✅ Good Example (Note Creation API)

```typescript
// app/api/notes/route.ts
import { createNoteSchema } from '@/lib/validation/note-schema';
import { createNote } from '@/lib/prisma/notes';
import { tier2Queue } from '@/lib/redis/queues/tier2-queue';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validData = createNoteSchema.parse(body);

    const note = await createNote({
      userId: validData.userId,
      content: validData.content,
      status: 'raw'
    });

    // Trigger async Tier-2 enrichment
    await tier2Queue.add('note.enrich', { noteId: note.id });

    logger.info({ userId: note.userId, noteId: note.id }, 'Note created');

    return NextResponse.json({ data: note }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details: error.errors }
      }, { status: 400 });
    }

    logger.error({ error }, 'Failed to create note');
    return NextResponse.json({
      error: { message: 'Internal error', code: 'INTERNAL_ERROR' }
    }, { status: 500 });
  }
}
```

### ❌ Anti-Patterns (À ÉVITER)

```typescript
// ❌ NO: Raw SQL instead of Prisma
const notes = await prisma.$queryRaw`SELECT * FROM notes WHERE user_id = ${userId}`;

// ❌ NO: Missing validation
const note = await createNote(req.body); // No Zod validation

// ❌ NO: Inconsistent API response
return { success: true, note }; // Should be {data: note}

// ❌ NO: console.log in production
console.log('Note created:', note); // Use Pino logger

// ❌ NO: Mutable state update
state.notes.push(newNote); // Use [...state.notes, newNote]

// ❌ NO: Non-ISO date format
{ createdAt: Date.now() } // Should be ISO 8601 string

// ❌ NO: Using 'any' type
const data: any = await fetchData(); // Use specific type

// ❌ NO: Not handling errors
const note = await createNote(data); // Wrap in try/catch

// ❌ NO: Inconsistent naming
function get_user_notes() { } // Should be getUserNotes()
```

---

## Pattern Compliance Checklist

Before merging any code, verify:

- [ ] All naming conventions followed (camelCase, PascalCase, lowercase APIs)
- [ ] API responses use standard `{data: T}` or `{error: {...}}` format
- [ ] All inputs validated with Zod schemas
- [ ] All database queries use Prisma (no raw SQL)
- [ ] All logs use Pino structured logging (no `console.log`)
- [ ] All state updates immutable (spread operators)
- [ ] All dates in ISO 8601 format
- [ ] TypeScript strict mode passes (no `any`, explicit types)
- [ ] Tests co-located with code (`*.test.ts`)
- [ ] Error handling implemented (try/catch + error boundaries)
- [ ] ESLint + Prettier pass
- [ ] Jest coverage >80%

---
