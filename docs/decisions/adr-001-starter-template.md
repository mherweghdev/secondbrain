# ADR-001: Starter Template Selection

## Status
Accepted

## Date
2026-01-11

## Context

The secondbrain project requires a full-stack TypeScript application with Next.js as the chosen framework. As an intermediate developer learning TypeScript/Next.js (weeks 1-2 learning phase), we need to select an appropriate starter template that balances:

- Learning-first approach (understand each architectural decision)
- TDD compatibility (build infrastructure progressively with tests)
- MVP simplicity (single-user, avoid unnecessary enterprise complexity)
- Flexibility for specific needs (PostgreSQL FTS, connection pooling)
- Phase 2 readiness (architected for scalability without premature optimization)

## Decision

We will use **create-next-app** (official Next.js CLI) with manual configuration rather than pre-configured boilerplates.

**Initialization Command:**
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

**Configuration Choices:**
- `--typescript`: TypeScript enabled (PRD requirement)
- `--tailwind`: Tailwind CSS for rapid styling
- `--eslint`: ESLint for code quality
- `--app`: App Router (Next.js 13+ modern architecture)
- `--src-dir`: Code in `/src` directory (clean separation)
- `--import-alias="@/*"`: Absolute imports for better maintainability
- `--turbopack`: Fast build tool for development speed

## Consequences

### Positive
- **Learning-First**: Minimal starter allows understanding each architectural decision rather than deciphering a complex boilerplate
- **TDD Compatible**: Build infrastructure progressively with tests, no pre-imposed patterns to work around
- **Zero Technical Debt**: No pre-imposed architectural decisions to later refactor
- **Full Flexibility**: PostgreSQL FTS and connection pooling can be configured exactly as needed
- **Official Support**: Well-maintained by Vercel, guaranteed compatibility with Next.js updates
- **Phase 2 Ready**: Can architect for scalability (stateless design, Redis sessions) without unnecessary enterprise complexity in MVP

### Negative
- **Manual Configuration Required**: Must configure PostgreSQL, Redis, testing infrastructure, authentication manually
- **More Initial Setup**: No pre-configured database, ORM, or auth (addressed in Epic 0 stories)
- **Learning Curve**: Need to understand and configure each integration point

### Mitigations
- Epic 0 (Project Infrastructure) explicitly includes 6 stories for manual setup:
  - Story 0.1: Initialize Next.js
  - Story 0.2: Setup Prisma + Supabase connection
  - Story 0.3: Configure Jest + React Testing Library
  - Story 0.4: Setup GitHub Actions CI
  - Story 0.5: Add pre-commit hooks
  - Story 0.6: Create initial ADRs

## Alternatives Considered

### Alternative 1: Vercel Postgres Auth Starter (Drizzle)
- **Repository**: `nextjs-postgres-auth-starter`
- **Stack**: Next.js + TypeScript + Tailwind + Drizzle ORM + NextAuth + PostgreSQL
- **Rejected Because**:
  - Opinionated ORM choice (Drizzle) before evaluating Prisma vs alternatives
  - Over-engineered auth for single-user MVP
  - Pre-configured patterns might not align with specific FTS and connection pooling needs
  - Harder to understand each decision when learning TypeScript/Next.js

### Alternative 2: Next.js Enterprise Boilerplate
- **Stack**: Next.js 15 + TypeScript + Testing + Docker + Production patterns
- **Rejected Because**:
  - Over-engineered for solo developer
  - Steep learning curve (weeks 1-2 should focus on fundamentals, not enterprise patterns)
  - Premature optimization for single-user MVP
  - Enterprise patterns (observability, multi-tenancy, etc.) needed in Phase 2, not MVP

### Alternative 3: Build from Scratch (No Starter)
- **Rejected Because**:
  - Reinventing standard Next.js configuration is wasted effort
  - Official CLI provides battle-tested defaults (TypeScript config, ESLint rules, Tailwind setup)
  - Time better spent on business logic than build tooling configuration

## Related Decisions
- ADR-002: Database & Auth Strategy (Supabase selection)
- ADR-003: ORM Selection (Prisma choice)
- ADR-004: Async Processing (Redis + Bull Queue)

## Notes

**Party Mode Insights Integration:**
- **Winston (Architect)**: "Delay architectural decisions until you have data. The official starter gives you exactly this flexibility without premature commitments."
- **Amelia (Developer)**: "Week 3 MUST include Jest + RTL setup story. No TDD without testing infrastructure - non-negotiable."
- **Murat (Test Architect)**: "Epic 0: Project Infrastructure is critical. Include testing database (Docker Compose postgres:alpine) from day 1."

**Implementation Priority:**
This is Story 0.1 of Epic 0 (Project Infrastructure, Week 3-4). All testing infrastructure must be in place by Week 4 to enable TDD for feature development.
