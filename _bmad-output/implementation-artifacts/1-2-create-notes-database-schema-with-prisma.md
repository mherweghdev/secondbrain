# Story 1.2: Create Notes Database Schema with Prisma

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to define the notes and metadata database schema using Prisma ORM,
so that I can persist notes with proper relational integrity.

## Acceptance Criteria

1. **Given** Supabase PostgreSQL database is configured
2. **When** I create the Prisma schema for notes
3. **Then** Notes table includes: id, userId, content (text), createdAt, updatedAt, status (enum: raw/refined/archived), source (string)
4. **And** Metadata table includes: id, noteId (FK), extractedAt, noteType (enum), tags (array), connections (jsonb)
5. **And** Audit trail table includes: id, noteId (FK), action (enum), timestamp, userId
6. **And** Database migrations are created and can be applied with `npx prisma migrate dev`
7. **And** Prisma client is generated and type-safe models are available
8. **And** Foreign key constraints maintain referential integrity
9. **And** Indexes are created on userId, createdAt, status for query performance
10. **And** **CRITICAL**: Use `directUrl` for migrations and `url` with `pgbouncer=true` for client

## Technical Requirements

- **Database**: Supabase PostgreSQL 15.x
- **ORM**: Prisma 5.x
- **Connection Pooling**:
  - `DATABASE_URL`: Transaction pooler (port 6543) with `?pgbouncer=true` -> Used by App
  - `DIRECT_URL`: Session pooler (port 5432) -> Used by Migrations
- **Models**:
  - `User`: Managed by Supabase Auth (referenced by UUID on other tables, but NOT defined in Prisma schema as a model unless using a public profile table)
  - `Note`: Core note content
  - `NoteMetadata`: Extended analysis data (Tier 1 & 2)
  - `AuditLog`: Action tracking
- **Enums**:
  - `NoteStatus`: RAW, REFINED, ARCHIVED
  - `NoteType`: MEETING, IDEA, TODO, REFERENCE, JOURNAL
- **Indexes**:
  - B-tree indexes on `userId` (everywhere), `createdAt`, `status`
  - Gin index on `tags` (array)
  - Full Text Search (FTS) index on `content`

## Architecture Compliance

- **Schema Location**: `prisma/schema.prisma`
- **Migration Strategy**: `prisma migrate dev` for local/preview, `prisma migrate deploy` for prod
- **Naming Conventions**: camelCase for fields, PascalCase for models (Prisma default)
- **Security**: Row Level Security (RLS) policies will be handled in a future story (or manually enabled via SQL migration if needed for Supabase Auth integration)

## Tasks / Subtasks

- [ ] Configure Environment Variables
  - [ ] Update `.env.local` with `DATABASE_URL` (pooler) and `DIRECT_URL` (direct)
- [ ] Initialize Prisma
  - [ ] `npm install prisma --save-dev`
  - [ ] `npm install @prisma/client`
  - [ ] `npx prisma init`
- [ ] Define Schema (`prisma/schema.prisma`)
  - [ ] Configure `datasource db` with `directUrl`
  - [ ] Define `Note` model
  - [ ] Define `NoteMetadata` model (1:1 relation with Note)
  - [ ] Define `AuditLog` model (1:n relation with Note)
  - [ ] Define Enums
- [ ] Generate Migration
  - [ ] `npx prisma migrate dev --name init_notes_schema`
- [ ] Generate Client
  - [ ] `npx prisma generate`
- [ ] Create Database Client Singleton
  - [ ] Create `src/lib/prisma/client.ts` to prevent multiple instances in dev (Next.js HMR issue)
- [ ] Verify Implementation
  - [ ] Create a seeding script `prisma/seed.ts` to test insertion
  - [ ] Run seed and verify data in Supabase Dashboard

## Dev Context

### Latest Tech Information (Prisma + Supabase)

**Connection Usage**:
Prisma Client requires a **Transaction Mode** pooler for serverless environments (Next.js).
Prisma Migrations require a **Session Mode** (Direct) connection.

**`schema.prisma` Configuration**:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "postgresqlExtensions"]
}
```

**Singleton Pattern (Next.js 15)**:

```typescript
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
```

## References

- [Epic 1 Specification](../planning-artifacts/epics/epic-1-note-capture-basic-storage.md)
- [Architecture Decisions](../planning-artifacts/architecture/core-architectural-decisions.md)
- [Prisma Supabase Docs](https://www.prisma.io/docs/guides/database/supabase)

## Dev Agent Record

### Agent Model Used

BMad Custom Agent (sm/create-story)

### Debug Log References

- Verified pooling requirements for Supabase + Prisma
- Validated singleton pattern for Next.js 15

### Completion Notes List

- Added critical configuration for `directUrl` to prevent migration failures.
- Included Singleton pattern to prevent connection exhaustion in dev.
