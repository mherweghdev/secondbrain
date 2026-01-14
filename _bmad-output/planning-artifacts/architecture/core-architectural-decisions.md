# Core Architectural Decisions

## Decision Summary

All architectural decisions have been made collaboratively with consideration for MVP requirements, Phase 2 scalability, and solo developer constraints.

**Critical Decisions (Block Implementation):**
1. **Database & ORM**: Supabase PostgreSQL + Prisma
2. **Authentication**: Supabase Auth (email/password)
3. **Async Processing**: Redis + Bull Queue
4. **API Design**: Next.js API Routes (REST)
5. **Frontend State**: React Server Components + Zustand
6. **Markdown Editor**: CodeMirror 6

**Important Decisions (Shape Architecture):**
- Deployment: Vercel (Next.js) or OVH VPS (Docker)
- Testing: Jest + React Testing Library
- Styling: Tailwind CSS
- Logging: Pino (structured JSON)

**Deferred Decisions (Post-MVP):**
- Email service provider (Phase 2)
- Monitoring/observability platform (Phase 2)
- E2E testing framework (Playwright vs Cypress, Phase 2)

---

## Data Architecture

### Database: Supabase PostgreSQL

**Decision**: Supabase managed PostgreSQL (Free Tier initially)

**Version**: Supabase Latest, PostgreSQL 15.x

**Rationale**:
- Free tier provides 500MB database (~50,000 notes = 6-12 months solo usage)
- Auth built-in saves 2-3 days development
- Row Level Security ready for Phase 2 multi-user
- Migration path exists (Supabase Pro $25/mois or self-hosted PostgreSQL)

**Connection Details**:
```typescript
// .env.local
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/[DB]?pgbouncer=true"
DIRECT_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/[DB]"
```

**Affects**: All data persistence, Epic 1-10 implementation

---

### ORM: Prisma

**Decision**: Prisma ORM with Supabase PostgreSQL

**Version**: Prisma 5.x (latest stable)

**Rationale**:
- Type-safe database queries (TypeScript native)
- Prisma Migrate for schema migrations
- Supabase compatible (uses direct connection for migrations)
- Excellent DX with auto-completion
- Full-text search via `@@fulltext` directive

**Migration Strategy**:
- Development: `prisma migrate dev` (creates migrations + applies)
- Production: `prisma migrate deploy` (applies pending migrations)
- Prisma Studio: GUI for data exploration during development

**Prisma Client Generation**:
```bash
npx prisma generate  # Generates type-safe client
```

**Affects**: All database interactions, Epic 1-10

---

### Database Schema

**Core Tables**:

1. **`User`** (managed by Supabase Auth, reference via `userId`)
2. **`Note`**: Markdown notes with FTS indexing
3. **`NoteMetadata`**: Tier-1 + Tier-2 enrichment data
4. **`Connection`**: Semantic/entity-based note connections
5. **`Digest`**: Weekly synthesized reports
6. **`AuditLog`**: Immutable event tracking

**Full-Text Search**:
- Prisma `@@fulltext([content, rawContent])` on `Note` table
- PostgreSQL `tsvector` indexing for <5 sec search latency
- Fallback: Raw SQL queries if Prisma FTS insufficient

**Schema File**: `prisma/schema.prisma` (see Starter Template section for full schema)

**Affects**: Epic 1 (Note Capture), Epic 2 (Search), Epic 4 (Tier-1), Epic 5 (Tier-2), Epic 6 (Digest)

---

### Redis: Bull Queue for Async Jobs

**Decision**: Redis for async job processing (NOT sessions - Supabase Auth handles)

**Version**: Redis 7.x (Alpine Docker) or Upstash Redis (serverless)

**Hosting Options**:

**Option A: Docker Compose (Local/OVH VPS)**
```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
```
**Cost**: Free (uses VPS RAM, ~20MB usage)

**Option B: Upstash Redis (Vercel deployment)**
- Free tier: 10,000 commands/day
- Latency: ~20-50ms
- **Cost**: Free for MVP

**Usage**:
1. **Tier-2 Enrichment Queue**: Async Claude API calls
2. **Digest Generation Queue**: Scheduled Friday 2am UTC
3. **Email Queue** (Phase 2): Digest delivery

**Bull Queue Configuration**:
```typescript
// src/lib/redis/queues/tier2-queue.ts
import Queue from 'bull';

export const tier2Queue = new Queue('tier2-enrichment', {
  redis: process.env.REDIS_URL,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  }
});
```

**Affects**: Epic 5 (Tier-2), Epic 6 (Digest Generation)

---

## Authentication & Security

### Authentication: Supabase Auth

**Decision**: Supabase Auth with email/password (MVP), extensible OAuth (Phase 2)

**Version**: `@supabase/auth-helpers-nextjs` latest

**Authentication Flow**:
1. User signs up → Supabase creates `auth.users` record
2. Session managed via JWT tokens (httpOnly cookies)
3. Token auto-refresh (30-day expiry, configurable)
4. Password hashing: bcrypt (Supabase native)

**Next.js Integration**:
```typescript
// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
```

**Session Duration**: 30 days (PRD spec), 2-hour inactivity timeout via client-side monitoring

**Affects**: Epic 1 (User Registration/Login), all authenticated endpoints

---

### API Security

**Decision**: Input validation + Rate limiting + CORS

**Libraries**:
- **Validation**: `zod` (type-safe schema validation)
- **Rate Limiting**: `next-rate-limit` (100 req/min per user)
- **CORS**: Next.js built-in (configured in `next.config.ts`)

**Validation Example**:
```typescript
// src/lib/validation/note-schema.ts
import { z } from 'zod';

export const createNoteSchema = z.object({
  content: z.string().min(1).max(100000),
  status: z.enum(['raw', 'refined', 'archived']).default('raw')
});

// In API route
const body = createNoteSchema.parse(await req.json());
```

**Rate Limiting**:
```typescript
// src/lib/rate-limit.ts
import rateLimit from 'next-rate-limit';

export const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users
});

// Apply to API routes
await limiter.check(res, 100, userId); // 100 req/min
```

**Affects**: All API routes (Epic 1-10)

---

## API & Communication Patterns

### API Design: Next.js API Routes (REST)

**Decision**: RESTful API via Next.js App Router `/app/api` routes

**API Structure**:
```
/app/api/
  ├── notes/
  │   ├── route.ts          # GET (list), POST (create)
  │   └── [id]/
  │       └── route.ts      # GET, PATCH, DELETE
  ├── search/
  │   └── route.ts          # GET (FTS search)
  ├── refine/
  │   └── [id]/
  │       └── route.ts      # POST (trigger Tier-1 + queue Tier-2)
  └── digests/
      ├── route.ts          # GET (list), POST (generate)
      └── [id]/
          └── route.ts      # GET single digest
```

**REST Conventions**:
- `GET /api/notes` → List notes (with filters: `?status=raw&limit=50`)
- `POST /api/notes` → Create note
- `GET /api/notes/[id]` → Get single note
- `PATCH /api/notes/[id]` → Update note
- `DELETE /api/notes/[id]` → Archive note (soft delete)

**Error Handling**:
```typescript
// Standardized error responses
{
  "error": {
    "code": "NOTE_NOT_FOUND",
    "message": "Note with ID 123 not found",
    "statusCode": 404
  }
}
```

**Affects**: All client-server communication (Epic 1-10)

---

## Frontend Architecture

### State Management: React Server Components + Zustand

**Decision**:
- **Server State**: React Server Components (RSC) for data fetching
- **Client State**: Zustand for UI state (editor content, filters, modals)

**Rationale**:
- RSC reduces client bundle, fetches data server-side
- Zustand lightweight (3KB), simpler than Redux for solo dev
- No need for Context API boilerplate

**Zustand Store Example**:
```typescript
// src/lib/stores/editor-store.ts
import { create } from 'zustand';

interface EditorStore {
  content: string;
  setContent: (content: string) => void;
  isDirty: boolean;
  markDirty: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  content: '',
  setContent: (content) => set({ content, isDirty: true }),
  isDirty: false,
  markDirty: () => set({ isDirty: true })
}));
```

**Affects**: Epic 1 (Note Editor), Epic 3 (Refinement UI), Epic 7 (Search UI)

---

### Markdown Editor: CodeMirror 6

**Decision**: `@uiw/react-codemirror` with markdown extensions

**Version**: CodeMirror 6.x (latest)

**Features**:
- Syntax highlighting (markdown mode)
- Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+K built-in)
- Preview side-by-side (toggle with custom component)
- Auto-save integration (debounced 500ms)

**Configuration**:
```typescript
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';

<CodeMirror
  value={content}
  extensions={[markdown()]}
  onChange={(value) => debouncedSave(value)}
  theme="light"
  basicSetup={{
    lineNumbers: false,
    foldGutter: false,
  }}
/>
```

**Alternative Considered**: `@toast-ui/react-editor` (WYSIWYG dual-mode) - rejected for complexity

**Affects**: Epic 1 (Note Capture), Epic 3 (Note Editing during Refinement)

---

## Infrastructure & Deployment

### Deployment Strategy

**Decision**: Vercel (preferred) or OVH VPS (Docker fallback)

**Option A: Vercel (Recommended for MVP)**
- Next.js native platform
- Zero-config deployment (`git push` → deploy)
- Free tier: Unlimited bandwidth, 100GB/month
- Edge functions for API routes
- **Cost**: Free for MVP

**Supabase + Vercel Integration**:
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_KEY]
REDIS_URL=[UPSTASH_URL] # If using Upstash Redis
```

**Option B: OVH VPS (Docker)**
- Multi-stage Dockerfile for Next.js
- Docker Compose with Redis
- Nginx reverse proxy + Let's Encrypt SSL
- **Cost**: ~€5-10/month VPS

**Recommendation**: Start with Vercel (free), migrate to OVH VPS if needed (control, cost optimization)

**Affects**: Epic 0 (Infrastructure Setup), Epic 10 (Deployment)

---

### CI/CD: GitHub Actions

**Decision**: GitHub Actions for lint, typecheck, test, deploy

**Workflow**:
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
```

**Deployment**: Vercel auto-deploys on `main` branch push

**Affects**: Epic 0 (CI/CD Setup), continuous validation

---

### Logging: Pino

**Decision**: `pino` for structured JSON logging

**Rationale**:
- Fast (5x faster than Winston)
- Structured logs (JSON format, easy parsing)
- No sensitive data logging (automatic scrubbing)

**Configuration**:
```typescript
// src/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['password', 'token', 'apiKey'], // Scrub sensitive data
});

// Usage
logger.info({ userId, noteId }, 'Note created');
```

**Affects**: All backend operations (Epic 1-10)

---

## Decision Impact Analysis

### Implementation Sequence

**Phase 1: Foundation (Weeks 3-4)**
1. Initialize Next.js with create-next-app
2. Setup Supabase project + Prisma schema
3. Configure Upstash Redis (or Docker Redis)
4. Setup Jest + React Testing Library
5. Configure GitHub Actions CI

**Phase 2: Core Features (Weeks 5-8)**
6. Implement Note Capture (CodeMirror + Supabase)
7. Implement Tier-1 Analysis (local heuristics)
8. Implement Search (PostgreSQL FTS)
9. Implement Refinement UI

**Phase 3: Advanced Features (Weeks 9-12)**
10. Implement Tier-2 Queue (Bull + Redis + Claude API)
11. Implement Digest Generation
12. Implement Auth (Supabase Auth integration)
13. Deploy to Vercel

**Phase 4: Polish (Weeks 13-16)**
14. Performance optimization
15. Testing coverage >80%
16. Documentation + ADRs

---

### Cross-Component Dependencies

**Supabase** → Affects:
- Auth (Epic 1: User management)
- Database (Epic 1-10: All data persistence)
- Storage (Epic 6: Digest exports, backups)

**Redis + Bull Queue** → Affects:
- Epic 5 (Tier-2 async processing)
- Epic 6 (Digest generation scheduling)
- Epic 9 (Email queue, Phase 2)

**Prisma** → Affects:
- Epic 1-10 (All database queries)
- Testing (Test database seeding)
- Migrations (Schema evolution)

**CodeMirror** → Affects:
- Epic 1 (Note Capture editor)
- Epic 3 (Refinement note editing)

**Zustand** → Affects:
- Epic 1 (Editor state)
- Epic 3 (Refinement workflow state)
- Epic 7 (Search filter state)

---

## Migration Paths & Contingencies

### Supabase Free Tier Exhaustion

**Trigger**: Database >500MB or exceeds free tier limits

**Options**:
1. **Upgrade to Supabase Pro** ($25/mois, 8GB DB, priority support)
2. **Migrate to Self-Hosted PostgreSQL** (OVH VPS Docker, ~3-5 days effort)

**Migration Strategy**:
```bash
# Export Supabase database
pg_dump [SUPABASE_URL] > backup.sql

# Import to self-hosted PostgreSQL
psql [LOCAL_PG_URL] < backup.sql

# Update Prisma connection
DATABASE_URL="postgresql://localhost:5432/secondbrain"

# Migrate auth (Supabase Auth → custom or NextAuth)
# Refactor: Replace Supabase Auth helpers with custom logic
```

**Effort**: 3-5 days (auth refactor + testing)

---

### Redis Upstash Free Tier Exhaustion

**Trigger**: >10,000 commands/day

**Options**:
1. **Upgrade to Upstash Pro** ($10/mois, 100K commands/day)
2. **Switch to Docker Redis** (OVH VPS, free)

**Migration**:
```typescript
// Change REDIS_URL from Upstash to local
REDIS_URL="redis://localhost:6379"
```

**Effort**: <1 day (configuration change only)

---
