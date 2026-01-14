# ADR-002: Database Strategy (Supabase PostgreSQL)

## Status

Accepted

## Context

The project requires:
- 41 Functional Requirements + 22 Non-Functional Requirements
- Full-text search (FTS) critical for Epic 6 (Search, <5 sec latency)
- Zero data loss backup requirement (NFR-11)
- Phase 2 multi-tenancy readiness (Row Level Security)
- Budget constraint: <$5/month API + hosting (MVP)

## Decision

Use **Supabase managed PostgreSQL** with the following configuration:

- Version: PostgreSQL 15.x
- Connection pooling: PgBouncer (managed by Supabase)
- Backup strategy: Automated point-in-time recovery
- Free tier initially (~500MB storage for MVP)

## Rationale

- **Free tier sufficient**: 500MB storage (~50,000 notes = 6-12 months solo usage)
- **Native FTS**: PostgreSQL FTS with tsvector (no external search engine needed)
- **Auth integration**: Supabase Auth + Database integration (saves 2-3 days setup)
- **RLS ready**: Row Level Security prepared for Phase 2 multi-tenancy
- **Managed backups**: Zero data loss requirement met with point-in-time recovery

## Consequences

### Positive

- ✅ $0 MVP cost (free tier sufficient)
- ✅ Native FTS (no Elasticsearch needed)
- ✅ Built-in Auth integration (Supabase Auth)
- ✅ Automatic backups (point-in-time recovery)
- ✅ Scalable to Phase 2 (RLS for multi-tenancy)
- ✅ Excellent developer experience (Web UI, API docs)

### Negative

- ❌ Vendor lock-in to Supabase (mitigation: 3-5 days to self-hosted PostgreSQL)
- ❌ Free tier limits (500MB) require paid upgrade after ~6 months ($25/month Pro)
- ❌ PostgreSQL FTS less powerful than Elasticsearch (acceptable for MVP)

## Alternatives Considered

### Alternative A: Firebase Firestore

- ✅ **Advantages**: Managed service, easy to set up
- ❌ **Disadvantages**: Limited FTS (requires Algolia integration), unpredictable costs (pay-per-query)
- **Rejected because**: NoSQL less suited for structured note data, complex pricing

### Alternative B: MongoDB + Atlas

- ✅ **Advantages**: Flexible schema, good for NoSQL
- ❌ **Disadvantages**: Text search less optimized vs PostgreSQL FTS, learning curve
- **Rejected because**: Structured requirements don't need NoSQL flexibility

### Alternative C: Self-hosted PostgreSQL (Docker)

- ✅ **Advantages**: Complete control, no vendor lock-in
- ❌ **Disadvantages**: Adds DevOps complexity for solo dev, manual backups
- **Deferred Phase 2**: Supabase free tier sufficient for MVP

## Implementation Notes

### Connection Setup

```typescript
// prisma/.env.local
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]"
```

### Full-Text Search Example

```sql
-- Enable FTS on notes table
CREATE INDEX notes_content_fts ON notes USING GIN (to_tsvector('english', content));

-- Query using FTS
SELECT * FROM notes 
WHERE to_tsvector('english', content) @@ plainto_tsquery('search term')
ORDER BY ts_rank(to_tsvector('english', content), plainto_tsquery('search term')) DESC;
```

### Backup Configuration

Supabase manages backups automatically:
- Daily automated backups
- Point-in-time recovery (14 days retention on free tier)
- Backup storage included in free tier

## Migration Path

When exceeding 500MB or >100 req/day:

**Option A: Upgrade to Supabase Pro** ($25/month, 8GB storage)
```bash
# Via Supabase dashboard - automatic upgrade
```

**Option B: Migrate to self-hosted PostgreSQL** (3-5 days effort)
```bash
# Export from Supabase
pg_dump [SUPABASE_CONNECTION_STRING] > backup.sql

# Restore to local PostgreSQL
pg_restore -d [LOCAL_POSTGRES] backup.sql

# Update DATABASE_URL in .env.production
DATABASE_URL="postgresql://user:pass@localhost:5432/secondbrain"
```

## See Also

- [ADR-001: Starter Template](./adr-001-starter-template.md) - Framework choice
- [ADR-003: ORM Selection](./adr-003-orm-prisma.md) - Prisma works with this database
- [ADR-006: API Design](./adr-006-api-design-nextjs-routes.md) - API endpoints interact with database
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL FTS](https://www.postgresql.org/docs/current/textsearch.html)
