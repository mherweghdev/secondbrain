# ADR-002: Database and Authentication Strategy

## Status
Accepted

## Date
2026-01-11

## Context

The secondbrain project requires:
- **Database**: PostgreSQL with full-text search (FTS) for <5 sec search latency (critical NFR)
- **Authentication**: Simple auth for MVP (single user), extensible to multi-user SaaS in Phase 2
- **Constraints**: Solo developer, <$5/month API budget, 16-week timeline, TDD culture

Key requirements driving this decision:
- **Performance**: PostgreSQL FTS with tsvector indexing for 50,000+ notes
- **Scalability**: Phase 2 multi-tenant readiness without refactoring
- **Data Integrity**: Zero data loss policy (ACID transactions, daily backups, 24h RTO)
- **Development Speed**: Minimize auth development time (2-3 days saved vs custom)

## Decision

We will use **Supabase** as a unified solution providing:
1. **Managed PostgreSQL 15** (Free Tier: 500MB database)
2. **Supabase Auth** (built-in authentication with email/password, OAuth-ready)
3. **Row Level Security (RLS)** ready for Phase 2 multi-tenancy

**Database Configuration:**
```typescript
// .env.local
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/[DB]?pgbouncer=true"  // Pooled connection
DIRECT_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/[DB]"                    // Direct (migrations)
```

**Authentication Integration:**
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

**Session Management:**
- JWT tokens (httpOnly cookies) with 30-day expiry
- 2-hour inactivity timeout (client-side monitoring)
- Password hashing: bcrypt (Supabase native)

## Consequences

### Positive
- **Free Tier Sufficient for MVP**: 500MB = ~50,000 notes = 6-12 months solo usage before paid tier
- **Auth Development Saved**: 2-3 days saved vs building custom auth (email verification, password reset, session management)
- **Phase 2 Ready**: Row Level Security (RLS) enables multi-tenant SaaS without database refactoring
- **Managed Backups**: Daily automated backups (2am UTC) meet 24h RTO/RPO requirements
- **Connection Pooling**: Built-in PgBouncer for production performance
- **Zero Data Loss**: ACID transactions + managed backups guarantee critical reliability requirement

### Negative
- **Vendor Lock-In Risk**: Dependency on Supabase platform
- **Free Tier Limits**: 500MB database, must migrate when exceeded
- **Latency**: Supabase-hosted database may have higher latency than self-hosted (mitigated: typically <50ms)

### Mitigations
- **Migration Path Documented**:
  - **Option A**: Upgrade to Supabase Pro ($25/month, 8GB DB, priority support)
  - **Option B**: Migrate to self-hosted PostgreSQL (OVH VPS Docker, 3-5 days effort)
  - Migration script ready: `pg_dump [SUPABASE_URL] > backup.sql`
- **Latency Acceptable**: <50ms typical latency meets <5 sec search requirement with significant margin
- **No Feature Lock-In**: Using standard PostgreSQL + Prisma ORM means database is portable

## Alternatives Considered

### Alternative 1: Self-Hosted PostgreSQL (OVH VPS Docker)
- **Pros**: Full control, no vendor lock-in, potentially lower latency, no database size limits
- **Cons**:
  - Manual backup setup and verification (2-3 days effort)
  - Manual auth implementation (3-5 days effort)
  - Manual connection pooling configuration
  - More DevOps overhead for solo developer
- **Rejected Because**: Premature optimization. Free tier sufficient for MVP, migration path exists when needed.

### Alternative 2: PlanetScale (MySQL)
- **Pros**: Generous free tier, automatic scaling, branching for schema changes
- **Cons**:
  - MySQL full-text search inferior to PostgreSQL (slower, less flexible)
  - No native support for arrays, JSONB (needed for metadata storage)
  - Prisma compatibility issues with PlanetScale branching
- **Rejected Because**: PostgreSQL FTS requirement is critical (<5 sec search latency NFR)

### Alternative 3: Firebase/Firestore
- **Pros**: Real-time sync, generous free tier, Google-managed
- **Cons**:
  - NoSQL document model doesn't fit relational note/metadata/connection schema
  - No native full-text search (requires Algolia integration = extra cost)
  - Query limitations (no complex joins for connection-aware search)
- **Rejected Because**: Relational model is natural fit for note connections + metadata relationships

### Alternative 4: Neon (Serverless PostgreSQL)
- **Pros**: Serverless PostgreSQL, auto-scaling, branching for dev/staging
- **Cons**:
  - Free tier: 0.5GB storage (same as Supabase) but compute limits
  - No built-in authentication (must implement separately)
  - Less mature than Supabase (fewer tutorials/community support)
- **Rejected Because**: Supabase provides auth + database in single platform, saving integration effort

## Related Decisions
- ADR-003: ORM Selection (Prisma chosen for type-safety + Supabase compatibility)
- ADR-005: State Management (Zustand chosen, no need for Redux with Supabase Auth handling sessions)
- Epic 7 (Data Integrity): ACID transactions + audit log implementation

## Implementation Notes

**Epic 0 Story 0.2: Setup Prisma + Supabase Connection**
1. Create Supabase project (free tier)
2. Configure `DATABASE_URL` and `DIRECT_URL` in `.env.local`
3. Install dependencies: `@supabase/auth-helpers-nextjs`, `@supabase/supabase-js`
4. Create `src/lib/supabase/client.ts` and `middleware.ts`
5. Test connection: `npx prisma db pull` to verify schema access

**Success Criteria:**
- ✅ Supabase project created and accessible
- ✅ Prisma can connect to database (both pooled and direct)
- ✅ Middleware protects `/app/*` routes
- ✅ Auth flow working: login → session → protected route access

**Free Tier Monitoring:**
- Database size: Check Supabase dashboard weekly
- Connection count: Monitor for connection exhaustion
- API requests: Track against free tier limits (50,000 requests/month)

**Phase 2 Migration Trigger:**
When database >400MB (80% of free tier), evaluate:
1. Upgrade to Supabase Pro ($25/mo, 8GB, priority support)
2. Migrate to OVH VPS self-hosted PostgreSQL (3-5 days effort)

Decision criteria: Cost vs control trade-off at that time.
