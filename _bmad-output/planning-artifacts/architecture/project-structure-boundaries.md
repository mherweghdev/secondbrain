# Project Structure & Boundaries

## Complete Project Directory Structure

```
secondbrain/
├── README.md
├── package.json
├── package-lock.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── .env.local                  # Local environment (gitignored)
├── .env.example                # Environment template
├── .gitignore
├── .prettierrc
├── .prettierignore
├── .eslintrc.json
├── jest.config.js
├── jest.setup.js
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint, typecheck, test
│       └── deploy.yml          # Vercel deployment
│
├── docs/
│   ├── decisions/              # Architecture Decision Records
│   │   ├── adr-001-starter-template.md
│   │   ├── adr-002-supabase-vs-self-hosted.md
│   │   ├── adr-003-prisma-orm.md
│   │   └── adr-004-redis-bull-queue.md
│   ├── api/                    # API documentation
│   │   └── endpoints.md
│   └── deployment/             # Deployment guides
│       ├── vercel.md
│       └── ovh-vps.md
│
├── prisma/
│   ├── schema.prisma           # Prisma schema (Note, NoteMetadata, Connection, Digest, AuditLog)
│   ├── seed.ts                 # Database seeding script
│   └── migrations/             # Generated migrations
│       └── 20260111_init/
│           └── migration.sql
│
├── public/
│   ├── favicon.ico
│   ├── assets/
│   │   └── images/
│   └── locales/                # i18n JSON files (if needed)
│       └── fr.json
│
├── src/
│   ├── middleware.ts           # Supabase Auth middleware
│   │
│   ├── app/                    # Next.js 15 App Router
│   │   ├── globals.css
│   │   ├── layout.tsx          # Root layout (ErrorBoundary, Providers)
│   │   ├── page.tsx            # Landing page
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   │
│   │   ├── (auth)/             # Route group (auth pages)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   │
│   │   ├── app/                # Authenticated app (requires session)
│   │   │   ├── layout.tsx      # App layout (sidebar, nav)
│   │   │   ├── page.tsx        # Dashboard/Notes list
│   │   │   │
│   │   │   ├── notes/          # Note capture & list
│   │   │   │   ├── page.tsx            # Notes list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx        # Create new note
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # Edit note
│   │   │   │
│   │   │   ├── refine/         # Refinement workflow
│   │   │   │   └── page.tsx            # Refinement UI
│   │   │   │
│   │   │   ├── digests/        # Digest history
│   │   │   │   ├── page.tsx            # Digest list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # View digest
│   │   │   │
│   │   │   └── search/         # Search interface
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                # API Routes (REST)
│   │       ├── notes/
│   │       │   ├── route.ts                # GET (list), POST (create)
│   │       │   └── [id]/
│   │       │       └── route.ts            # GET, PATCH, DELETE (archive)
│   │       │
│   │       ├── refine/
│   │       │   └── [id]/
│   │       │       └── route.ts            # POST (trigger Tier-1 + queue Tier-2)
│   │       │
│   │       ├── search/
│   │       │   └── route.ts                # GET (FTS search)
│   │       │
│   │       ├── digests/
│   │       │   ├── route.ts                # GET (list), POST (generate)
│   │       │   └── [id]/
│   │       │       └── route.ts            # GET single digest
│   │       │
│   │       └── health/
│   │           └── route.ts                # Health check endpoint
│   │
│   ├── components/             # React components
│   │   ├── notes/
│   │   │   ├── NoteEditor.tsx              # CodeMirror markdown editor
│   │   │   ├── NoteCard.tsx                # Note list item
│   │   │   ├── NoteList.tsx                # Notes list with filters
│   │   │   ├── NoteMetadata.tsx            # Display Tier-1/Tier-2 metadata
│   │   │   └── __tests__/
│   │   │       └── NoteEditor.test.tsx
│   │   │
│   │   ├── refinement/
│   │   │   ├── RefinementFlow.tsx          # Refinement workflow orchestrator
│   │   │   ├── SuggestionReview.tsx        # Review Tier-2 suggestions
│   │   │   ├── ProgressTracker.tsx         # "2 of 8 notes refined"
│   │   │   └── __tests__/
│   │   │       └── RefinementFlow.test.tsx
│   │   │
│   │   ├── digests/
│   │   │   ├── DigestView.tsx              # Display weekly digest
│   │   │   ├── DigestList.tsx              # Digest history
│   │   │   └── DigestExport.tsx            # Export digest as markdown
│   │   │
│   │   ├── search/
│   │   │   ├── SearchBar.tsx               # Keyword/tag search input
│   │   │   ├── SearchResults.tsx           # Results list
│   │   │   └── SearchFilters.tsx           # Filter by tags, type
│   │   │
│   │   └── ui/                 # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── __tests__/
│   │           └── Button.test.tsx
│   │
│   ├── lib/                    # Business logic & utilities
│   │   ├── prisma/
│   │   │   ├── client.ts                   # Prisma client singleton
│   │   │   ├── notes.ts                    # Note CRUD operations
│   │   │   ├── notes.test.ts
│   │   │   ├── search.ts                   # FTS search queries
│   │   │   ├── search.test.ts
│   │   │   ├── digests.ts                  # Digest CRUD
│   │   │   └── connections.ts              # Connection management
│   │   │
│   │   ├── supabase/
│   │   │   ├── client.ts                   # Supabase client
│   │   │   ├── auth.ts                     # Auth helpers
│   │   │   └── middleware-client.ts        # Middleware Supabase client
│   │   │
│   │   ├── redis/
│   │   │   ├── client.ts                   # Redis connection
│   │   │   ├── queues/
│   │   │   │   ├── tier2-queue.ts          # Tier-2 enrichment queue
│   │   │   │   └── digest-queue.ts         # Digest generation queue
│   │   │   └── jobs/
│   │   │       ├── enrich-note.ts          # Job handler: Tier-2 enrichment
│   │   │       ├── enrich-note.test.ts
│   │   │       ├── generate-digest.ts      # Job handler: Digest generation
│   │   │       └── generate-digest.test.ts
│   │   │
│   │   ├── tier1/              # Local heuristics engine
│   │   │   ├── index.ts                    # Tier-1 orchestrator
│   │   │   ├── keyword-extractor.ts        # Extract hashtags, @mentions
│   │   │   ├── keyword-extractor.test.ts
│   │   │   ├── type-classifier.ts          # Classify note type
│   │   │   ├── type-classifier.test.ts
│   │   │   ├── connection-detector.ts      # Entity matching
│   │   │   └── connection-detector.test.ts
│   │   │
│   │   ├── claude/             # Claude API integration
│   │   │   ├── client.ts                   # Claude API client
│   │   │   ├── enrichment.ts               # Tier-2 enrichment logic
│   │   │   ├── enrichment.test.ts
│   │   │   ├── digest-generator.ts         # Digest generation with Claude
│   │   │   ├── digest-generator.test.ts
│   │   │   └── token-tracker.ts            # Track API usage for budget
│   │   │
│   │   ├── validation/         # Zod schemas
│   │   │   ├── note-schema.ts              # Note validation
│   │   │   ├── digest-schema.ts            # Digest validation
│   │   │   └── search-schema.ts            # Search query validation
│   │   │
│   │   ├── utils/              # Shared utilities
│   │   │   ├── debounce.ts                 # Debounce auto-save
│   │   │   ├── date-formatter.ts           # Date formatting (date-fns)
│   │   │   ├── markdown-parser.ts          # Markdown utilities
│   │   │   └── error-handler.ts            # Centralized error handling
│   │   │
│   │   └── logger.ts           # Pino logger configuration
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useDebounce.ts
│   │   ├── useAutoSave.ts                  # Auto-save hook (500ms debounce)
│   │   ├── useKeyboardShortcuts.ts         # Global keyboard shortcuts
│   │   └── __tests__/
│   │       └── useAutoSave.test.ts
│   │
│   ├── stores/                 # Zustand stores
│   │   ├── note-store.ts                   # Note editor state
│   │   ├── refinement-store.ts             # Refinement workflow state
│   │   ├── search-store.ts                 # Search filters state
│   │   └── app-store.ts                    # Global app state
│   │
│   └── types/                  # Shared TypeScript types
│       ├── note.ts                         # Note, NoteMetadata types
│       ├── digest.ts                       # Digest types
│       ├── api.ts                          # ApiResponse<T>, ApiError types
│       └── jobs.ts                         # Job payload types
│
├── __tests__/                  # Test utilities & integration tests
│   ├── setup.ts                            # Jest global setup
│   ├── integration/
│   │   ├── note-workflow.test.ts           # End-to-end note creation → refinement
│   │   ├── search.test.ts                  # Search integration tests
│   │   └── digest-generation.test.ts
│   └── __mocks__/
│       ├── supabase.ts                     # Mock Supabase client
│       ├── prisma.ts                       # Mock Prisma client
│       └── claude-api.ts                   # Mock Claude API
│
└── docker/                     # Docker configuration (if OVH VPS deployment)
    ├── Dockerfile
    ├── docker-compose.yml                  # PostgreSQL + Redis for local dev
    └── .dockerignore
```

---

## Architectural Boundaries

### API Boundaries

**Public API Endpoints** (`/api/*`):
- `GET /api/notes` → List user notes (filtered by status)
- `POST /api/notes` → Create new note (Tier-1 auto-triggered)
- `GET /api/notes/[id]` → Get single note with metadata
- `PATCH /api/notes/[id]` → Update note content
- `DELETE /api/notes/[id]` → Archive note (soft delete)
- `POST /api/refine/[id]` → Trigger refinement (Tier-1 + queue Tier-2)
- `GET /api/search?q=keyword&tags=auth` → FTS search
- `GET /api/digests` → List digests
- `POST /api/digests` → Generate new digest
- `GET /api/health` → Health check

**Authentication Boundary**:
- Middleware (`src/middleware.ts`) enforces Supabase session on `/app/*` routes
- API routes validate session via `@supabase/auth-helpers-nextjs`

**Rate Limiting Boundary**:
- `next-rate-limit` middleware: 100 req/min per user
- Applied to all `/api/*` routes

---

### Component Boundaries

**Frontend → API**:
- React components call API routes via `fetch()` or SWR
- All state managed via Zustand stores
- No direct database access from frontend

**API Routes → Services**:
- API routes handle HTTP concerns (validation, auth, response formatting)
- Business logic delegated to `src/lib/prisma/` functions
- Separation: routes = thin controllers, lib = business logic

**Services → Database**:
- All database access via Prisma client (`src/lib/prisma/client.ts`)
- No raw SQL except FTS queries (if Prisma insufficient)

---

### Service Boundaries

**Tier-1 Service** (`src/lib/tier1/`):
- Synchronous processing (<100ms requirement)
- Stateless functions (keyword extraction, type classification)
- No external API calls

**Tier-2 Service** (`src/lib/claude/`):
- Async processing via Bull Queue
- External API dependency (Claude API)
- Retry logic (3 attempts, exponential backoff)

**Queue Workers** (`src/lib/redis/jobs/`):
- Background processes (Tier-2, digest generation)
- Idempotent job handlers (safe retries)
- Logging all job lifecycle events

---

### Data Boundaries

**Supabase Auth** (`auth.users`):
- Managed by Supabase (no direct access)
- Referenced via `userId` foreign key in Prisma schema

**Prisma Models**:
- `Note` → Core note data + FTS indexing
- `NoteMetadata` → Tier-1 + Tier-2 enrichment results
- `Connection` → Semantic/entity-based note links
- `Digest` → Weekly synthesized reports
- `AuditLog` → Immutable event log

**Caching Boundaries**:
- Redis: Only for Bull Queue (NOT sessions - Supabase handles)
- Vercel Edge Cache: Automatic for static pages
- Client-side: Zustand stores cache UI state

---

## Requirements to Structure Mapping

**Epic 1: Note Capture & Storage (FRs 1-5)**
- Frontend: [src/app/app/notes/](src/app/app/notes/) + [src/components/notes/NoteEditor.tsx](src/components/notes/NoteEditor.tsx)
- API: [src/app/api/notes/route.ts](src/app/api/notes/route.ts), [src/app/api/notes/[id]/route.ts](src/app/api/notes/[id]/route.ts)
- Database: Prisma `Note` model
- State: [src/stores/note-store.ts](src/stores/note-store.ts)
- Tests: `src/components/notes/__tests__/`, `src/lib/prisma/notes.test.ts`

**Epic 2: Tier-1 Analysis (FRs 6-9)**
- Service: [src/lib/tier1/](src/lib/tier1/) (keyword-extractor, type-classifier, connection-detector)
- Integration: Auto-triggered on note creation (POST `/api/notes`)
- Tests: `src/lib/tier1/*.test.ts`

**Epic 3: Tier-2 Enrichment (FRs 10-13)**
- Queue: [src/lib/redis/queues/tier2-queue.ts](src/lib/redis/queues/tier2-queue.ts)
- Service: [src/lib/claude/enrichment.ts](src/lib/claude/enrichment.ts)
- Job Handler: [src/lib/redis/jobs/enrich-note.ts](src/lib/redis/jobs/enrich-note.ts)
- Integration: Queued on note creation, processed async
- Tests: `src/lib/claude/enrichment.test.ts`, `src/lib/redis/jobs/enrich-note.test.ts`

**Epic 4: Refinement Workflow (FRs 14-19)**
- Frontend: [src/app/app/refine/](src/app/app/refine/) + [src/components/refinement/](src/components/refinement/)
- API: [src/app/api/refine/[id]/route.ts](src/app/api/refine/[id]/route.ts)
- State: [src/stores/refinement-store.ts](src/stores/refinement-store.ts)
- Tests: `src/components/refinement/__tests__/RefinementFlow.test.tsx`

**Epic 5: Digest Generation (FRs 20-23)**
- Queue: [src/lib/redis/queues/digest-queue.ts](src/lib/redis/queues/digest-queue.ts)
- Service: [src/lib/claude/digest-generator.ts](src/lib/claude/digest-generator.ts)
- Job Handler: [src/lib/redis/jobs/generate-digest.ts](src/lib/redis/jobs/generate-digest.ts)
- API: [src/app/api/digests/route.ts](src/app/api/digests/route.ts)
- Frontend: [src/components/digests/DigestView.tsx](src/components/digests/DigestView.tsx)
- Tests: `__tests__/integration/digest-generation.test.ts`

**Epic 6: Search & Retrieval (FRs 24-28)**
- Frontend: [src/app/app/search/](src/app/app/search/) + [src/components/search/](src/components/search/)
- API: [src/app/api/search/route.ts](src/app/api/search/route.ts)
- Service: [src/lib/prisma/search.ts](src/lib/prisma/search.ts) (FTS queries)
- State: [src/stores/search-store.ts](src/stores/search-store.ts)
- Tests: `__tests__/integration/search.test.ts`

**Epic 7: Data Integrity (FRs 29-33)**
- Database: `AuditLog` Prisma model
- Service: `src/lib/prisma/audit.ts` (log all mutations)
- Backups: Supabase automatic daily backups (managed)
- Tests: Transaction safety tests in `src/lib/prisma/*.test.ts`

**Epic 8: Authentication (FRs 34-36)**
- Middleware: [src/middleware.ts](src/middleware.ts) (Supabase Auth)
- Auth helpers: [src/lib/supabase/auth.ts](src/lib/supabase/auth.ts)
- Frontend: [src/app/(auth)/login/](src/app/(auth)/login/), [src/app/(auth)/signup/](src/app/(auth)/signup/)
- Rate limiting: `src/lib/rate-limit.ts`

**Cross-Cutting Concerns**:
- **Validation**: [src/lib/validation/](src/lib/validation/) (Zod schemas at API boundaries)
- **Logging**: [src/lib/logger.ts](src/lib/logger.ts) (Pino structured logging)
- **Error Handling**: `src/lib/utils/error-handler.ts` + [src/components/ui/ErrorBoundary.tsx](src/components/ui/ErrorBoundary.tsx)
- **Testing Infrastructure**: `__tests__/setup.ts`, `jest.config.js`, `__tests__/__mocks__/`

---

## Integration Points

### Internal Communication

**Frontend ↔ API**:
- HTTP/HTTPS (REST)
- JSON payloads (camelCase)
- Standard response format: `{data: T}` or `{error: {...}}`

**API ↔ Services**:
- Direct function calls (`import { createNote } from '@/lib/prisma/notes'`)
- Type-safe via TypeScript

**Services ↔ Database**:
- Prisma Client (type-safe queries)
- Connection pooling (Supabase managed, max 50 connections)

**Services ↔ Redis Queue**:
- Bull Queue (Redis-backed)
- Event-driven async processing
- Retry logic with exponential backoff

### External Integrations

**Supabase**:
- Auth: `@supabase/auth-helpers-nextjs`
- Database: PostgreSQL via Prisma
- Connection: `DATABASE_URL` (pooled), `DIRECT_URL` (migrations)

**Claude API**:
- HTTP REST API (`anthropic` SDK)
- Environment: `CLAUDE_API_KEY`
- Token tracking: [src/lib/claude/token-tracker.ts](src/lib/claude/token-tracker.ts)
- Rate limiting: Handled by API (retries on 429)

**Upstash Redis** (or Docker Redis):
- Bull Queue backend
- Connection: `REDIS_URL`
- Fallback: Local Docker Redis if Upstash unavailable

**Vercel** (deployment):
- Edge functions for API routes
- Automatic static optimization
- Environment variables via Vercel dashboard

### Data Flow

**Note Creation Flow**:
1. User types in `NoteEditor` → Zustand `note-store` (debounced 500ms)
2. POST `/api/notes` → Zod validation
3. `createNote(data)` → Prisma insert to `Note` table
4. Trigger `Tier-1` analysis (sync, <100ms)
5. Queue `Tier-2` enrichment → Bull Queue `tier2Queue.add('note.enrich', {noteId})`
6. Return `{data: note}` to frontend
7. Background: Bull worker processes Tier-2 → Claude API → Update `NoteMetadata`

**Search Flow**:
1. User enters query in `SearchBar` → `search-store` (debounced 300ms)
2. GET `/api/search?q=keyword&tags=auth`
3. `searchNotes(query)` → Prisma FTS query (`@@fulltext([content, rawContent])`)
4. Return `{data: notes[]}` to frontend
5. Render `SearchResults` component

**Refinement Flow**:
1. User clicks "Refine" → Navigate to `/app/refine`
2. Load unrefined notes → GET `/api/notes?status=raw`
3. Display suggestions from `NoteMetadata` (Tier-2 results)
4. User accepts/rejects → PATCH `/api/notes/[id]` (update metadata)
5. Progress tracker: "2 of 8 notes refined"

---

## File Organization Patterns

### Configuration Files

**Root Level**:
- `package.json` → Dependencies, scripts, lint-staged config
- `next.config.ts` → Next.js configuration (CORS, env vars)
- `tailwind.config.ts` → Tailwind CSS customization
- `tsconfig.json` → TypeScript compiler options (strict mode)
- `.env.local` → Environment variables (gitignored)
- `.env.example` → Environment template (committed)
- `.eslintrc.json` → ESLint rules
- `.prettierrc` → Prettier formatting rules
- `jest.config.js` → Jest configuration (coverage thresholds)

**Prisma**:
- `prisma/schema.prisma` → Database schema
- `prisma/seed.ts` → Database seeding script

**GitHub Actions**:
- `.github/workflows/ci.yml` → CI pipeline (lint, typecheck, test)
- `.github/workflows/deploy.yml` → Deployment automation

### Source Organization

**Next.js App Router** (`src/app/`):
- Route groups: `(auth)/` for auth pages
- API routes: `api/*/route.ts`
- Pages: `app/**/page.tsx`
- Layouts: `layout.tsx` at each level

**Components** (`src/components/`):
- Feature-based: `notes/`, `refinement/`, `digests/`, `search/`
- Shared UI: `ui/` (Button, Input, Modal, etc.)
- Co-located tests: `__tests__/` in each feature folder

**Business Logic** (`src/lib/`):
- Database: `prisma/` (queries, client)
- External services: `supabase/`, `claude/`, `redis/`
- Core logic: `tier1/` (heuristics)
- Utilities: `validation/`, `utils/`, `logger.ts`

### Test Organization

**Unit Tests**:
- Co-located: `*.test.ts` next to implementation
- Example: `src/lib/tier1/keyword-extractor.test.ts`

**Integration Tests**:
- Root-level: `__tests__/integration/`
- Example: `__tests__/integration/note-workflow.test.ts`

**Mocks**:
- `__tests__/__mocks__/` for Supabase, Prisma, Claude API mocks

**Test Utilities**:
- `__tests__/setup.ts` → Global Jest setup
- `jest.setup.js` → Jest configuration

### Asset Organization

**Static Assets** (`public/`):
- `favicon.ico`
- `assets/images/` → Images, icons
- `locales/` → i18n JSON files (if needed)

**Dynamic Assets**:
- User uploads: Supabase Storage (Phase 2)
- Generated digests: Database (`Digest` table)

---

## Development Workflow Integration

### Development Server Structure

**Local Development**:
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start dev server (Turbopack)
npm run dev
```

**Environment Setup**:
```bash
# .env.local (copy from .env.example)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
REDIS_URL="redis://localhost:6379"
CLAUDE_API_KEY="sk-ant-..."
```

**Docker Compose** (if using local PostgreSQL + Redis):
```bash
docker-compose up -d
```

### Build Process Structure

**Production Build**:
```bash
# Typecheck
npm run typecheck

# Lint
npm run lint

# Test
npm test

# Build Next.js
npm run build

# Start production server
npm start
```

**Build Output**:
- `.next/` → Next.js build output (gitignored)
- `.next/static/` → Static assets
- `.next/server/` → Server bundles

### Deployment Structure

**Vercel Deployment**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Environment Variables** (Vercel Dashboard):
- `DATABASE_URL` (Supabase connection string)
- `REDIS_URL` (Upstash Redis URL)
- `CLAUDE_API_KEY` (Claude API key)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**OVH VPS Deployment** (Docker alternative):
```bash
# Build Docker image
docker build -t secondbrain:latest .

# Run container
docker-compose -f docker-compose.prod.yml up -d
```

---
