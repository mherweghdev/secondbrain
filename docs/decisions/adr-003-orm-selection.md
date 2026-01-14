# ADR-003: ORM Selection

## Status
Accepted

## Date
2026-01-11

## Context

The secondbrain project requires an ORM to interact with Supabase PostgreSQL. Key requirements:

- **Type Safety**: TypeScript-native with auto-completion and compile-time checks
- **Full-Text Search**: Support PostgreSQL FTS with tsvector/tsquery for <5 sec search latency
- **Migrations**: Schema evolution support with version control
- **Supabase Compatibility**: Works with both pooled (PgBouncer) and direct connections
- **Developer Experience**: Solo developer needs excellent DX, clear error messages, good documentation
- **Testing Support**: Easy to mock for unit tests, seeding for integration tests

## Decision

We will use **Prisma ORM 5.x** for all database interactions.

**Prisma Schema Example:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")       // Pooled connection (PgBouncer)
  directUrl = env("DIRECT_URL")         // Direct connection (migrations)
}

model Note {
  id          String   @id @default(cuid())
  userId      String
  content     String   @db.Text
  rawContent  String   @db.Text
  status      String   // "raw", "refined", "archived"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  archivedAt  DateTime?

  metadata    NoteMetadata?
  connectionsFrom Connection[] @relation("SourceNote")
  connectionsTo   Connection[] @relation("TargetNote")

  @@index([userId, status])
  @@index([createdAt])
  @@fulltext([content, rawContent])  // PostgreSQL FTS
}

model NoteMetadata {
  id                String   @id @default(cuid())
  noteId            String   @unique
  note              Note     @relation(fields: [noteId], references: [id], onDelete: Cascade)

  // Tier-1 results (local heuristics)
  tier1Keywords     String[]
  tier1Type         String?
  tier1Entities     String[]

  // Tier-2 results (Claude API)
  tier2Type         String?
  tier2Tags         String[]
  tier2Summary      String?
  tier2Connections  Json?
  tier2ProcessedAt  DateTime?

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

**Migration Strategy:**
- **Development**: `npx prisma migrate dev` (creates + applies migrations)
- **Production**: `npx prisma migrate deploy` (applies pending migrations)
- **Client Generation**: `npx prisma generate` (generates type-safe client)

**Usage Pattern:**
```typescript
// src/lib/prisma/client.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// src/lib/prisma/notes.ts
export async function createNote(data: { userId: string; content: string }) {
  return prisma.note.create({
    data: {
      userId: data.userId,
      content: data.content,
      rawContent: data.content,
      status: 'raw'
    },
    include: { metadata: true }
  });
}

// Type-safe: TypeScript knows exact shape of returned Note + metadata
```

## Consequences

### Positive
- **Type-Safe Database Queries**: Auto-generated TypeScript client with IntelliSense prevents runtime errors
- **Excellent Developer Experience**:
  - `npx prisma studio` provides GUI for data exploration during development
  - Clear error messages with actionable suggestions
  - Auto-completion in VS Code for all queries
- **Migration Support**: Version-controlled schema changes with rollback capability
- **Supabase Compatible**: Dual-connection support (pooled for queries, direct for migrations)
- **Full-Text Search Support**: `@@fulltext` directive generates PostgreSQL tsvector indexes
- **Easy Testing**:
  - Mock Prisma client for unit tests
  - `prisma.note.deleteMany()` for test cleanup
  - Seeding via `prisma/seed.ts`
- **Performance**: Query optimization suggestions, connection pooling aware

### Negative
- **Abstraction Layer**: Adds layer between code and SQL (mitigated: raw SQL escape hatch available)
- **Learning Curve**: Prisma schema syntax + migration workflow (mitigated: excellent documentation)
- **Bundle Size**: Prisma Client adds ~500KB to bundle (acceptable for backend)
- **Migration Limitations**: Complex schema changes may require manual SQL (rare for our use case)

### Trade-offs Accepted
- **Raw SQL Fallback**: If Prisma's `@@fulltext` insufficient for complex FTS queries, can use `prisma.$queryRaw`
- **Schema-First**: Prisma schema is source of truth (vs code-first like TypeORM decorators)

## Alternatives Considered

### Alternative 1: Drizzle ORM
- **Pros**:
  - Lighter bundle size (~200KB vs Prisma's 500KB)
  - SQL-like syntax (closer to raw SQL)
  - Better tree-shaking
- **Cons**:
  - Less mature ecosystem (fewer tutorials, community support)
  - Migration tooling less polished than Prisma
  - No GUI equivalent to Prisma Studio
  - TypeScript inference sometimes requires manual type annotations
- **Rejected Because**: Prisma's maturity and DX outweigh bundle size concerns for backend

### Alternative 2: TypeORM
- **Pros**:
  - Mature, battle-tested ORM
  - Decorator-based (familiar to Angular/NestJS developers)
  - Active Record + Data Mapper patterns
- **Cons**:
  - Heavy bundle size (~1MB)
  - Decorators add complexity (not idiomatic Next.js)
  - Type safety weaker than Prisma (requires manual type guards)
  - No equivalent to Prisma Studio
  - Migration issues with Supabase PgBouncer
- **Rejected Because**: Prisma's type safety and Supabase compatibility superior

### Alternative 3: Kysely (Query Builder)
- **Pros**:
  - Tiny bundle size (~100KB)
  - Type-safe SQL query builder
  - Full control over generated SQL
- **Cons**:
  - No schema migrations (must manage separately)
  - No GUI tool
  - More boilerplate code vs Prisma
  - Steeper learning curve for intermediate developer
- **Rejected Because**: Lack of migration tooling increases complexity for solo developer

### Alternative 4: Raw SQL with `node-postgres` (pg)
- **Pros**:
  - Zero abstraction, full SQL control
  - Smallest bundle size
  - Maximum performance
- **Cons**:
  - No type safety (must manually type query results)
  - No migration tooling (must build custom or use external tools)
  - SQL injection risk without careful parameterization
  - More boilerplate, error-prone for intermediate developer
- **Rejected Because**: Type safety and migration support critical for TDD culture

## Related Decisions
- ADR-002: Database & Auth Strategy (Supabase PostgreSQL chosen)
- ADR-006: Testing Strategy (Prisma mock patterns for unit tests)
- Epic 2 (Tier-1 Analysis): Metadata storage in `NoteMetadata` model
- Epic 6 (Search): PostgreSQL FTS via `@@fulltext([content, rawContent])`

## Implementation Notes

**Epic 0 Story 0.2: Setup Prisma + Supabase Connection**

1. Install Prisma:
```bash
npm install prisma @prisma/client
npm install -D prisma
```

2. Initialize Prisma:
```bash
npx prisma init
```

3. Configure `prisma/schema.prisma` with dual connections:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")    // Pooled (PgBouncer)
  directUrl = env("DIRECT_URL")       // Direct (migrations)
}
```

4. Create initial migration:
```bash
npx prisma migrate dev --name init
```

5. Generate Prisma Client:
```bash
npx prisma generate
```

**Success Criteria:**
- ✅ `prisma/schema.prisma` defines all 5 models (Note, NoteMetadata, Connection, Digest, AuditLog)
- ✅ `npx prisma migrate dev` creates migration successfully
- ✅ `npx prisma studio` opens GUI to explore database
- ✅ `src/lib/prisma/client.ts` exports singleton Prisma client
- ✅ Type-safe queries work with auto-completion in VS Code

**Testing Setup:**
```typescript
// __tests__/__mocks__/prisma.ts
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

export const prismaMock = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});

// src/lib/prisma/notes.test.ts
import { prismaMock } from '@/__tests__/__mocks__/prisma';
import { createNote } from './notes';

test('createNote creates a note with correct data', async () => {
  const mockNote = { id: '1', userId: 'user1', content: 'Test', status: 'raw' };
  prismaMock.note.create.mockResolvedValue(mockNote);

  const result = await createNote({ userId: 'user1', content: 'Test' });

  expect(result).toEqual(mockNote);
  expect(prismaMock.note.create).toHaveBeenCalledWith({
    data: { userId: 'user1', content: 'Test', rawContent: 'Test', status: 'raw' },
    include: { metadata: true }
  });
});
```

**Full-Text Search Implementation:**
```typescript
// src/lib/prisma/search.ts
export async function searchNotes(query: string, userId: string) {
  return prisma.note.findMany({
    where: {
      userId,
      OR: [
        { content: { search: query } },      // FTS on content
        { rawContent: { search: query } }    // FTS on rawContent
      ],
      status: { not: 'archived' }
    },
    include: { metadata: true },
    orderBy: { _relevance: { fields: ['content'], search: query, sort: 'desc' } }
  });
}
```

**Performance Optimization:**
- Use `include` sparingly (eager loading can slow queries)
- Prefer `select` for specific fields when full object not needed
- Use `@@index` for frequently queried fields (`userId`, `status`, `createdAt`)
- Monitor query performance via Prisma logs in development

**Migration Best Practices:**
- Always review generated SQL in `prisma/migrations/` before committing
- Test migrations on development database before production deploy
- Backup database before applying migrations in production
- Keep migrations small and focused (one logical change per migration)
