# ADR-001: Starter Template Selection

## Status

Accepted

## Context

We need to build a full-stack Next.js 15 project (frontend + API backend) as a solo developer with intermediate TypeScript/Next.js skill level. The project will grow from MVP single-user to Phase 2 multi-tenancy. A Test-Driven Development (TDD) culture requires progressive construction with tests from the start.

### Key Requirements

- Next.js 15 full-stack project
- Solo developer learning TypeScript/Next.js ecosystem
- MVP single-user → Phase 2 multi-tenancy ready
- TDD culture requires progressive construction
- Timeline: Weeks 1-2 ramp-up period expected

## Decision

Use **create-next-app official CLI + manual configuration**.

```bash
npx create-next-app@latest secondbrain \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias="@/*" --turbopack
```

## Rationale

- **Minimal setup, maximum flexibility**: Zero technical debt from boilerplate code
- **Full control**: Complete ownership of every architectural decision
- **TDD compatible**: Build infrastructure progressively with tests
- **Learning-friendly**: Each decision can be documented and understood
- **Modern stack**: Next.js 15 + App Router with Hot Module Replacement

## Consequences

### Positive

- ✅ Zero boilerplate code to remove or understand
- ✅ Complete ownership of architecture patterns
- ✅ Ideal for learning (each decision documented via ADRs)
- ✅ Flexible for Phase 2 scaling needs (multi-tenancy)
- ✅ Fast Hot Module Replacement with Turbopack
- ✅ No framework opinions to fight against

### Negative

- ❌ Manual configuration required (testing, database, Redis, auth)
- ❌ Developer responsibility for pattern consistency
- ❌ More initial setup time vs enterprise templates (mitigated by documentation)

## Alternatives Considered

### Alternative A: Vercel Postgres Auth Starter (Drizzle ORM)

- ✅ **Advantages**: Pre-configured database + auth, includes Drizzle ORM
- ❌ **Disadvantages**: ORM choice too opinionated (Drizzle over Prisma choice), overengineered for MVP
- **Rejected because**: Slows learning curve and removes flexibility in choosing ORM

### Alternative B: Next.js Enterprise Boilerplate

- ✅ **Advantages**: Comprehensive folder structure, many patterns included
- ❌ **Disadvantages**: Over-engineered for solo developer, steep learning curve (weeks of pattern discovery)
- **Rejected because**: Pattern imposition vs pattern discovery - defeats learning goal

### Alternative C: Create T3 App (tRPC + Prisma + NextAuth)

- ✅ **Advantages**: Good full-stack TypeScript integration
- ❌ **Disadvantages**: tRPC adds complexity for simple REST API needs, opinionated choices
- **Rejected for MVP**: Good for future Phase 2 consideration if complexity justifies it

## Implementation Notes

### Initial Setup Command

```bash
npx create-next-app@latest secondbrain \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias="@/*" \
  --turbopack
```

### Configuration Structure

```
secondbrain/
├── src/
│   ├── app/                 # App router pages + layouts
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utilities and helpers
│   └── middleware.ts        # Auth middleware
├── prisma/                  # Database schema
├── docs/                    # Documentation
├── .env.local              # Local environment variables
└── next.config.ts          # Next.js configuration
```

## Migration Path

If the project needs to migrate to a different template in the future:

1. **To Enterprise Template**: Export pages and components, import into new structure (2-3 days)
2. **To Different Framework**: All business logic portable, only UI layer changes (1 week)
3. **Effort**: ~2-3 days to migrate to Vercel starter if needed

## See Also

- [ADR-002: Database Strategy](./adr-002-database-supabase-postgresql.md) - Database choice complements this starter
- [ADR-010: CI/CD Pipeline](./adr-010-cicd-github-actions.md) - Testing infrastructure setup
- [ADR-011: Testing Framework](./adr-011-testing-jest-rtl.md) - TDD implementation
