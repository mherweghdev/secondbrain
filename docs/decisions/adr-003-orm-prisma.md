# ADR-003: ORM Selection (Prisma)

## Status

Accepted

## Context

The project requires:
- TypeScript type safety (prevent runtime errors)
- Database migrations (schema evolution)
- Full-text search support (PostgreSQL FTS)
- Solo developer: DX (Developer Experience) matters

## Decision

Use **Prisma 5.x** as the primary ORM.

## Rationale

- **Type-safe queries**: Auto-generated TypeScript types from schema
- **Migration workflow**: `prisma migrate dev` (development), `prisma migrate deploy` (production)
- **FTS support**: Via `@@fulltext` directive (PostgreSQL native)
- **Excellent DX**: Auto-completion and IntelliSense
- **Active community**: Well-documented with extensive examples

## Consequences

### Positive

- ✅ Zero runtime type errors (compile-time safety)
- ✅ Auto-generated types (no manual definitions)
- ✅ Migration history tracked in git (`prisma/migrations/`)
- ✅ Great DX with Prisma Studio (database UI)
- ✅ Production-ready performance

### Negative

- ❌ Slight performance overhead vs raw SQL (negligible for MVP)
- ❌ Learning curve Prisma schema syntax
- ❌ Binary dependency (prisma-engines)

## Alternatives Considered

### Alternative A: Drizzle ORM

- ✅ **Advantages**: Lightweight, type-safe, SQL-first approach
- ❌ **Disadvantages**: Newer, less mature than Prisma, smaller community
- **Rejected for MVP**: Prisma has more resources and documentation

### Alternative B: TypeORM

- ✅ **Advantages**: Decorator-based, works with multiple databases
- ❌ **Disadvantages**: Verbose syntax, less type-safe than Prisma
- **Rejected because**: Migrations more manual, decorator overhead

### Alternative C: Raw SQL with pg

- ✅ **Advantages**: Maximum control, best performance
- ❌ **Disadvantages**: No type safety (runtime errors), manual migrations
- **Rejected because**: Development velocity sacrificed for performance

## Implementation Notes

### Installation

```bash
npm install @prisma/client
npm install -D prisma
```

### Migration Workflow

```bash
# Development: auto-create and apply migrations
npx prisma migrate dev --name add_notes_table

# Production: apply existing migrations
npx prisma migrate deploy
```

## Migration Path

Estimated effort: 2-3 days to switch to alternative ORM while preserving data

## See Also

- [ADR-002: Database Strategy](./adr-002-database-supabase-postgresql.md) - Prisma works with this database
- [ADR-001: Starter Template](./adr-001-starter-template.md) - TypeScript requirement
- [Prisma Documentation](https://www.prisma.io/docs)
