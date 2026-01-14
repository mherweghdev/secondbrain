# Story 0.6: Create Architecture Decision Records (ADR documentation)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to document critical architectural decisions in ADR format,
So that future developers (and AI agents) understand the rationale behind key choices.

## Acceptance Criteria

**Given** The project has made several architectural decisions (starter template, database, auth, etc.)
**When** I create the docs/decisions/ directory structure
**Then** ADR template is created in docs/decisions/adr-template.md
**And** ADR-001: Starter Template Selection is documented (rationale: create-next-app over boilerplates)
**And** ADR-002: Database and ORM Strategy is documented (rationale: Supabase PostgreSQL + Prisma)
**And** ADR-003: Authentication Strategy is documented (rationale: Supabase Auth)
**And** Each ADR follows the format: Title, Status, Context, Decision, Consequences, Alternatives Considered
**And** ADRs are numbered sequentially (adr-001, adr-002, etc.)
**And** README.md in docs/decisions/ explains the ADR process

## Tasks / Subtasks

- [ ] Create ADR directory structure (AC: docs/decisions/ created)
  - [ ] Create docs/decisions/ directory
  - [ ] Create docs/decisions/README.md explaining ADR process
  - [ ] Create docs/decisions/adr-template.md with standard format
  - [ ] Verify directory structure matches project standards
- [ ] Document ADR-001: Starter Template Selection (AC: create-next-app documented)
  - [ ] Create docs/decisions/adr-001-starter-template.md
  - [ ] Document context: Why template choice mattered
  - [ ] Document decision: create-next-app + manual config
  - [ ] Document alternatives: Vercel boilerplates, enterprise starters
  - [ ] Document consequences: Flexibility vs setup time tradeoff
- [ ] Document ADR-002: Database Strategy (AC: Supabase PostgreSQL documented)
  - [ ] Create docs/decisions/adr-002-database-supabase-postgresql.md
  - [ ] Document context: Persistence, FTS, backup requirements
  - [ ] Document decision: Supabase managed PostgreSQL
  - [ ] Document alternatives: Firebase, MongoDB, self-hosted
  - [ ] Document migration path: Free tier → Pro or self-hosted
- [ ] Document ADR-003: ORM Selection (AC: Prisma documented)
  - [ ] Create docs/decisions/adr-003-orm-prisma.md
  - [ ] Document context: Type safety, migrations, FTS support
  - [ ] Document decision: Prisma 5.x
  - [ ] Document alternatives: Drizzle, TypeORM, raw SQL
  - [ ] Document consequences: Type-safe vs raw performance
- [ ] Document ADR-004: Authentication Strategy (AC: Supabase Auth documented)
  - [ ] Create docs/decisions/adr-004-authentication-supabase-auth.md
  - [ ] Document context: Session management, security requirements
  - [ ] Document decision: Supabase Auth with JWT tokens
  - [ ] Document alternatives: NextAuth.js, Auth0, custom solution
  - [ ] Document Phase 2 extensibility: OAuth, MFA, SAML
- [ ] Document additional critical ADRs (AC: All major decisions covered)
  - [ ] ADR-005: Async Processing (Redis + Bull Queue)
  - [ ] ADR-006: API Design (Next.js API Routes REST)
  - [ ] ADR-007: State Management (RSC + Zustand)
  - [ ] ADR-008: Markdown Editor (CodeMirror 6)
  - [ ] ADR-009: Deployment Strategy (Vercel + OVH VPS fallback)
  - [ ] ADR-010: CI/CD Pipeline (GitHub Actions)
  - [ ] ADR-011: Testing Framework (Jest + React Testing Library)
  - [ ] ADR-012: Logging Infrastructure (Pino structured JSON)
- [ ] Create ADR index and cross-references (AC: Easy navigation)
  - [ ] Update docs/decisions/README.md with full ADR list
  - [ ] Add cross-references between related ADRs
  - [ ] Link ADRs to implementation artifacts (Story files)
  - [ ] Add "See Also" sections for related decisions

## Dev Notes

### Previous Story Intelligence (Epic 0 Summary)

**Story 0.1 - Initialize Next.js:**
- Created project with create-next-app (ADR-001)
- TypeScript, Tailwind CSS, ESLint, App Router
- Import aliases configured (@/*)

**Story 0.2 - Testing Infrastructure:**
- Jest + React Testing Library (ADR-011)
- Coverage thresholds 80%
- Test colocation pattern

**Story 0.3 - Test Database:**
- Docker Compose PostgreSQL + Redis (ADR-002, ADR-005)
- Integration tests with real database
- CI/CD services configuration

**Story 0.4 - CI/CD Pipeline:**
- GitHub Actions workflow (ADR-010)
- Quality gates: lint, typecheck, test, coverage
- Performance <5 minutes

**Story 0.5 - Code Quality Tools:**
- Husky + lint-staged
- Pre-commit hooks
- Prettier + ESLint strict rules

**Epic 0 Completion:**
Story 0.6 documents WHY these decisions were made (ADRs for all)

### Architecture Decision Records (ADR) Format

**Standard ADR Template Structure:**

```markdown
# ADR-XXX: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-YYY]

## Context
[What is the issue that we're seeing that is motivating this decision?]
- Business requirements
- Technical constraints
- Team capabilities
- Timeline constraints

## Decision
[What is the change that we're proposing and/or doing?]
- Clear, concise statement
- Implementation approach
- Technical specifications

## Rationale
[Why this decision over alternatives?]
- Key factors considered
- Critical requirements met
- Trade-offs accepted

## Consequences
### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Compromise 1]
- [Compromise 2]

## Alternatives Considered
### Alternative A: [Name]
- ✅ **Advantages**: ...
- ❌ **Disadvantages**: ...
- **Rejected because**: ...

### Alternative B: [Name]
- ...

## Implementation Notes
[How to implement this decision in practice?]
- Configuration examples
- Code patterns
- Setup instructions

## Migration Path
[How to change this decision if needed?]
- Exit strategy
- Vendor lock-in mitigation
- Estimated migration effort

## See Also
- Related ADR-XXX
- Epic/Story references
- External documentation
```

### ADR-001: Starter Template Selection (create-next-app)

**Context:**
- Next.js 15 full-stack project (frontend + API backend)
- Solo developer (intermediate level) learning TypeScript/Next.js
- MVP single-user → Phase 2 multi-tenancy ready
- TDD culture requires progressive construction with tests

**Decision:**
create-next-app official CLI + manual configuration
```bash
npx create-next-app@latest secondbrain \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias="@/*" --turbopack
```

**Rationale:**
- Minimal setup, maximum flexibility (zero technical debt)
- Full control over every architectural decision
- Compatible with TDD approach (build infrastructure progressively)
- Enables progressive learning (weeks 1-2 ramp-up)
- Next.js 15 + App Router modern with Hot Module Replacement

**Consequences:**
**Positive:**
- Zero boilerplate code to remove or understand
- Complete ownership of architecture patterns
- Ideal for learning (each decision documented)
- Flexible for Phase 2 scaling needs
- Fast Hot Module Replacement with Turbopack

**Negative:**
- Manual configuration required (testing, database, Redis, auth)
- Developer responsibility for pattern consistency
- More initial setup time vs enterprise templates

**Alternatives Considered:**
1. **Vercel Postgres Auth Starter (Drizzle ORM)**
   - ❌ Rejected: ORM choice too opinionated (Drizzle over Prisma)
   - Overengineered for MVP
   - Slows learning curve

2. **Next.js Enterprise Boilerplate**
   - ❌ Rejected: Over-engineered for solo developer
   - Steep learning curve (weeks of pattern discovery)
   - Pattern imposition vs pattern discovery

3. **Create T3 App (tRPC + Prisma + NextAuth)**
   - ❌ Rejected: tRPC adds complexity for simple REST needs
   - Good for future consideration Phase 2

### ADR-002: Database Strategy (Supabase PostgreSQL)

**Context:**
- 41 Functional Requirements + 22 Non-Functional Requirements
- Full-text search (FTS) critical for Epic 6 (Search, <5 sec latency)
- Zero data loss backup requirement (NFR-11)
- Phase 2 multi-tenancy readiness (Row Level Security)
- Budget constraint: <$5/month API + hosting (MVP)

**Decision:**
Supabase managed PostgreSQL (Free Tier initially)
- Version: PostgreSQL 15.x
- Connection pooling: PgBouncer (managed by Supabase)
- Backup strategy: Automated point-in-time recovery

**Rationale:**
- Free tier: 500MB storage (~50,000 notes = 6-12 months solo usage)
- Native full-text search (PostgreSQL FTS with tsvector)
- Supabase Auth + Database integration (saves 2-3 days setup)
- Row Level Security (RLS) ready for Phase 2 multi-tenancy
- Managed backups (zero data loss requirement met)

**Consequences:**
**Positive:**
- $0 MVP cost (free tier sufficient)
- Native FTS (no external search engine needed)
- Built-in Auth integration
- Automatic backups (point-in-time recovery)
- Scalable to Phase 2 (RLS for multi-tenancy)
- Excellent developer experience (Web UI, API docs)

**Negative:**
- Vendor lock-in to Supabase (mitigation: 3-5 days to self-hosted PostgreSQL)
- Free tier limits (500MB) require paid upgrade after ~6 months ($25/month Pro)
- PostgreSQL FTS less powerful than Elasticsearch (acceptable for MVP)

**Alternatives Considered:**
1. **Firebase Firestore**
   - ❌ Rejected: Limited FTS (requires Algolia integration)
   - Costs unpredictable (pay-per-query)
   - NoSQL less suited for structured note data

2. **MongoDB + Atlas**
   - ❌ Rejected: Text search less optimized vs PostgreSQL FTS
   - NoSQL flexible schema unnecessary (structured requirements)
   - Learning curve for solo developer

3. **Self-hosted PostgreSQL (Docker)**
   - ❌ Deferred Phase 2: Adds DevOps complexity for solo dev
   - Backup management manual (automated with Supabase)
   - Free tier Supabase sufficient MVP

**Migration Path:**
```bash
# When exceeding 500MB or >100 req/day:
# Option A: Upgrade to Supabase Pro ($25/month, 8GB storage)
# Option B: Migrate to self-hosted PostgreSQL (3-5 days effort)
pg_dump [SUPABASE_URL] > backup.sql
pg_restore -d [LOCAL_POSTGRES] backup.sql
# Update DATABASE_URL in .env.production
```

### ADR-003: ORM Selection (Prisma)

**Context:**
- TypeScript type safety critical (prevent runtime errors)
- Database migrations required (schema evolution)
- Full-text search support needed (PostgreSQL FTS)
- Solo developer: DX (Developer Experience) matters

**Decision:**
Prisma 5.x as primary ORM
```typescript
// prisma/schema.prisma
model Note {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())
  @@fulltext([content]) // PostgreSQL FTS
}
```

**Rationale:**
- Type-safe queries (auto-generated TypeScript types)
- Migration workflow: `prisma migrate dev` (development), `prisma migrate deploy` (production)
- FTS support via `@@fulltext` directive (PostgreSQL native)
- Excellent auto-completion (IntelliSense)
- Active community and documentation

**Consequences:**
**Positive:**
- Zero runtime type errors (compile-time safety)
- Auto-generated types (no manual type definitions)
- Migration history tracked in git (`prisma/migrations/`)
- Great DX with Prisma Studio (database UI)
- Production-ready performance

**Negative:**
- Slight performance overhead vs raw SQL (negligible for MVP)
- Learning curve Prisma schema syntax
- Binary dependency (prisma-engines)

**Alternatives Considered:**
1. **Drizzle ORM**
   - ❌ Rejected: Newer, less mature than Prisma
   - Smaller community, fewer resources
   - Good alternative Phase 2 if performance critical

2. **TypeORM**
   - ❌ Rejected: Decorator-based (verbose syntax)
   - Less type-safe than Prisma (runtime errors possible)
   - Migrations more manual

3. **Raw SQL with pg**
   - ❌ Rejected: No type safety (runtime errors)
   - Manual migration management
   - Slower development velocity

### ADR-004: Authentication Strategy (Supabase Auth)

**Context:**
- MVP: Single user (simple auth)
- Phase 2: Multi-user SaaS (extensible auth)
- Session management: 30-day token expiry, 2-hour inactivity timeout
- Security: Zero data loss = secure authentication critical

**Decision:**
Supabase Auth with email/password (MVP), OAuth extensible (Phase 2)
```typescript
// Session management via JWT tokens (httpOnly cookies)
// Token auto-refresh: 30-day expiry, configurable
// Password hashing: bcrypt (Supabase native)
// Middleware enforcement: src/middleware.ts
```

**Rationale:**
- Native integration with Next.js (`@supabase/auth-helpers-nextjs`)
- JWT-based sessions (stateless, scalable)
- httpOnly cookies (XSS protection)
- Row Level Security (RLS) ready for Phase 2 multi-tenancy
- Email verification built-in
- Social OAuth (Google, GitHub) extensible Phase 2

**Consequences:**
**Positive:**
- Zero configuration MVP (Supabase project dashboard)
- Secure by default (bcrypt, JWT, httpOnly cookies)
- Middleware enforcement automatic (`middleware.ts`)
- RLS ready (Phase 2 multi-tenancy)
- Social OAuth providers easy to enable
- MFA/SAML available Phase 2 (Supabase enterprise plan)

**Negative:**
- Vendor lock-in to Supabase (mitigation: NextAuth.js migration possible)
- Advanced features (MFA, SAML) require paid plan
- Supabase project dependency (managed service)

**Alternatives Considered:**
1. **NextAuth.js**
   - ❌ Deferred Phase 2: Overkill for single-user MVP
   - More complex setup (providers, adapters, database sessions)
   - Better when multi-user active (Phase 2)

2. **Custom Session + Redis**
   - ❌ Rejected: Redundant with Supabase Auth
   - Security risk (custom implementation)
   - Redis reserved for Bull Queue (async jobs)

3. **Auth0**
   - ❌ Rejected: Costs from start ($25-100/month)
   - Budget constraint: <$5/month API + hosting
   - Supabase Auth free with database

### Complete List of ADRs to Document

**Core Infrastructure (Stories 0.1-0.5):**
1. ✅ ADR-001: Starter Template Selection (create-next-app)
2. ✅ ADR-002: Database Strategy (Supabase PostgreSQL)
3. ✅ ADR-003: ORM Selection (Prisma)
4. ✅ ADR-004: Authentication Strategy (Supabase Auth)

**Additional Critical Decisions:**
5. ADR-005: Async Processing (Redis + Bull Queue)
   - Context: Epic 5 Tier-2 enrichment, Epic 7 digest generation
   - Decision: Docker Redis (local) + Upstash Redis (Vercel)
   - Alternatives: AWS SQS, Celery (Python), inline cron jobs

6. ADR-006: API Design (Next.js API Routes REST)
   - Context: Full-stack Next.js, CRUD operations
   - Decision: RESTful API via `/app/api/*` routes
   - Alternatives: GraphQL (Apollo), tRPC, separate backend

7. ADR-007: State Management (RSC + Zustand)
   - Context: Editor state, refinement workflow, search filters
   - Decision: React Server Components + Zustand (3KB)
   - Alternatives: Redux, Recoil, React Context

8. ADR-008: Markdown Editor (CodeMirror 6)
   - Context: Epic 1 note capture, syntax highlighting, keyboard shortcuts
   - Decision: CodeMirror 6 via `@uiw/react-codemirror`
   - Alternatives: @toast-ui/react-editor, Lexical (Meta)

9. ADR-009: Deployment Strategy (Vercel + OVH VPS fallback)
   - Context: MVP budget, scalability Phase 2
   - Decision: Vercel free tier (primary), OVH VPS Docker (fallback)
   - Alternatives: Heroku, Railway, AWS

10. ADR-010: CI/CD Pipeline (GitHub Actions)
    - Context: Quality gates, automatic deployment
    - Decision: GitHub Actions (native integration)
    - Alternatives: CircleCI, Travis CI, GitLab CI

11. ADR-011: Testing Framework (Jest + React Testing Library)
    - Context: TDD culture, >80% coverage
    - Decision: Jest (unit/integration), Playwright (E2E Phase 2)
    - Alternatives: Vitest, Cypress, Testing Library solo

12. ADR-012: Logging Infrastructure (Pino structured JSON)
    - Context: Production observability, security (no sensitive data)
    - Decision: Pino logger with automatic redaction
    - Alternatives: Winston, console.log (rejected)

### ADR Directory Structure

**Final structure for docs/decisions/:**

```
docs/
└── decisions/
    ├── README.md                         # ADR process explained
    ├── adr-template.md                   # Standard template
    ├── adr-001-starter-template.md
    ├── adr-002-database-supabase-postgresql.md
    ├── adr-003-orm-prisma.md
    ├── adr-004-authentication-supabase-auth.md
    ├── adr-005-async-processing-redis-bull.md
    ├── adr-006-api-design-nextjs-routes.md
    ├── adr-007-state-management-rsc-zustand.md
    ├── adr-008-markdown-editor-codemirror.md
    ├── adr-009-deployment-vercel-ovh.md
    ├── adr-010-cicd-github-actions.md
    ├── adr-011-testing-jest-rtl.md
    └── adr-012-logging-pino.md
```

### docs/decisions/README.md Content

**Purpose of ADR Documentation:**

```markdown
# Architecture Decision Records (ADRs)

## Purpose
This directory contains Architecture Decision Records (ADRs) documenting all major technical decisions made for the SecondBrain project.

## Why ADRs?
- **Knowledge Transfer**: Future developers (and AI agents) understand rationale
- **Prevent Repeated Debates**: Decisions documented with context
- **Onboarding**: New team members learn architecture quickly
- **Accountability**: Clear ownership and consequences understood

## ADR Format
Each ADR follows the standard format:
1. **Status**: Accepted, Proposed, Deprecated, Superseded
2. **Context**: Why was this decision needed?
3. **Decision**: What was decided?
4. **Rationale**: Why this over alternatives?
5. **Consequences**: Positive and negative impacts
6. **Alternatives Considered**: Options rejected and why
7. **Implementation Notes**: How to implement
8. **Migration Path**: How to change if needed
9. **See Also**: Related ADRs and documentation

## ADR Index
| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [001](./adr-001-starter-template.md) | Starter Template Selection | Accepted | 2026-01-11 |
| [002](./adr-002-database-supabase-postgresql.md) | Database Strategy | Accepted | 2026-01-11 |
| [003](./adr-003-orm-prisma.md) | ORM Selection | Accepted | 2026-01-11 |
| [004](./adr-004-authentication-supabase-auth.md) | Authentication Strategy | Accepted | 2026-01-11 |
| [005](./adr-005-async-processing-redis-bull.md) | Async Processing | Accepted | 2026-01-11 |
| [006](./adr-006-api-design-nextjs-routes.md) | API Design | Accepted | 2026-01-11 |
| [007](./adr-007-state-management-rsc-zustand.md) | State Management | Accepted | 2026-01-11 |
| [008](./adr-008-markdown-editor-codemirror.md) | Markdown Editor | Accepted | 2026-01-11 |
| [009](./adr-009-deployment-vercel-ovh.md) | Deployment Strategy | Accepted | 2026-01-11 |
| [010](./adr-010-cicd-github-actions.md) | CI/CD Pipeline | Accepted | 2026-01-11 |
| [011](./adr-011-testing-jest-rtl.md) | Testing Framework | Accepted | 2026-01-11 |
| [012](./adr-012-logging-pino.md) | Logging Infrastructure | Accepted | 2026-01-11 |

## Creating New ADRs
1. Copy `adr-template.md` to `adr-XXX-short-title.md`
2. Fill all sections completely
3. Update this README.md index
4. Commit with message: `docs: add ADR-XXX for [decision]`
5. Discuss with team (if applicable)

## Superseding ADRs
When a decision changes:
1. Update old ADR status to "Superseded by ADR-XXX"
2. Create new ADR explaining new decision
3. Reference old ADR in "Context" section
4. Update README.md index

## References
- [ADR GitHub Repository](https://adr.github.io/)
- [Joel Spolsky on Architectural Decisions](https://www.joelonsoftware.com/2000/05/12/strategy-letter-i-ben-and-jerrys-vs-amazon/)
```

### Project Structure Alignment

**New Files Created:**
```
docs/
└── decisions/
    ├── README.md                         # ADR process (this story)
    ├── adr-template.md                   # Standard template (this story)
    ├── adr-001-starter-template.md       # This story
    ├── adr-002-database-supabase-postgresql.md  # This story
    ├── adr-003-orm-prisma.md            # This story
    ├── adr-004-authentication-supabase-auth.md  # This story
    ├── adr-005-async-processing-redis-bull.md   # This story
    ├── adr-006-api-design-nextjs-routes.md     # This story
    ├── adr-007-state-management-rsc-zustand.md # This story
    ├── adr-008-markdown-editor-codemirror.md   # This story
    ├── adr-009-deployment-vercel-ovh.md        # This story
    ├── adr-010-cicd-github-actions.md          # This story
    ├── adr-011-testing-jest-rtl.md             # This story
    └── adr-012-logging-pino.md                 # This story
```

**Modified Files:**
```
README.md                                 # Link to docs/decisions/ (this story)
```

### Guardrails for Dev Agent

**CRITICAL: DO NOT:**
- ❌ Skip any of the 12 ADRs (all are acceptance criteria)
- ❌ Write vague ADRs without clear rationale
- ❌ Forget "Alternatives Considered" section (critical for understanding)
- ❌ Omit migration paths (vendor lock-in mitigation required)
- ❌ Use inconsistent ADR numbering (sequential required)

**MUST DO:**
- ✅ Follow ADR template format exactly (all sections)
- ✅ Document all alternatives considered (minimum 2 per ADR)
- ✅ Include clear migration paths (exit strategies)
- ✅ Cross-reference related ADRs ("See Also" section)
- ✅ Update docs/decisions/README.md index (complete table)
- ✅ Link ADRs to implementation artifacts (Story references)
- ✅ Use concrete examples (code snippets, commands)
- ✅ Date all ADRs (2026-01-13 for this story)

**Quality Checklist:**
1. All 12 ADRs created with complete sections
2. README.md index updated with all ADRs
3. adr-template.md matches architecture standard format
4. Each ADR includes minimum 2 alternatives considered
5. Each ADR includes clear migration path
6. Cross-references between related ADRs complete
7. Link ADRs to Epic 0 Story files (0.1-0.5)
8. README.md main doc links to docs/decisions/

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-0-project-infrastructure-foundation.md - Story 0.6]
- [Source: _bmad-output/planning-artifacts/architecture/* - All decisions extracted]
- [Previous Stories: 0.1-0.5 implementation artifacts]
- [ADR GitHub: https://adr.github.io/]
- [Michael Nygard ADR article: https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

(To be filled by dev agent during implementation)

### Completion Notes List

(To be filled by dev agent during implementation)

### File List

**Files to be created:**
- docs/decisions/README.md
- docs/decisions/adr-template.md
- docs/decisions/adr-001-starter-template.md
- docs/decisions/adr-002-database-supabase-postgresql.md
- docs/decisions/adr-003-orm-prisma.md
- docs/decisions/adr-004-authentication-supabase-auth.md
- docs/decisions/adr-005-async-processing-redis-bull.md
- docs/decisions/adr-006-api-design-nextjs-routes.md
- docs/decisions/adr-007-state-management-rsc-zustand.md
- docs/decisions/adr-008-markdown-editor-codemirror.md
- docs/decisions/adr-009-deployment-vercel-ovh.md
- docs/decisions/adr-010-cicd-github-actions.md
- docs/decisions/adr-011-testing-jest-rtl.md
- docs/decisions/adr-012-logging-pino.md

**Files to be modified:**
- README.md (link to docs/decisions/)
