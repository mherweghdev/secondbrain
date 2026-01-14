# Starter Template Evaluation

## Primary Technology Domain

**Full-stack Web Application** based on project requirements analysis (Next.js + PostgreSQL + Redis + Claude API)

## Starter Options Considered

**Option 1: create-next-app (Official Next.js CLI)**
- Command: `npx create-next-app@latest`
- Default 2026 setup: TypeScript, Tailwind CSS, ESLint, App Router, Turbopack
- Advantages: Minimal setup, official support, maximum flexibility, well-maintained
- Disadvantages: No PostgreSQL pre-configuration, no testing setup, minimal structure

**Option 2: Vercel Postgres Auth Starter (Drizzle)**
- Repository: [nextjs-postgres-auth-starter](https://github.com/vercel/nextjs-postgres-auth-starter)
- Stack: Next.js + TypeScript + Tailwind + Drizzle ORM + NextAuth + PostgreSQL
- Advantages: PostgreSQL configured, Auth included, Drizzle ORM modern
- Disadvantages: Opinionated ORM choice, potentially over-engineered auth for MVP

**Option 3: Next.js Enterprise Boilerplate**
- Source: Enterprise-focused starter templates
- Stack: Next.js 15 + TypeScript + Testing + Docker + Production patterns
- Advantages: Enterprise patterns, Docker included, Testing infrastructure
- Disadvantages: Over-engineered for solo developer, steep learning curve

## Selected Starter: create-next-app (Official) + Manual Configuration

**Rationale for Selection:**

1. **Learning-First Approach**: As an intermediate developer learning TypeScript/Next.js (weeks 1-2), a minimal starter allows understanding each architectural decision rather than deciphering a complex boilerplate.

2. **TDD Compatibility**: Culture TDD requires building infrastructure progressively with tests. Pre-configured starters often impose ORMs or patterns before you've validated them with tests.

3. **MVP Simplicity**: Single-user MVP doesn't need NextAuth or enterprise patterns initially. Build what's needed, when it's needed.

4. **ORM Flexibility**: PostgreSQL full-text search (FTS) and connection pooling are critical. Manual configuration ensures these specific needs are properly addressed without ORM constraints.

5. **Zero Technical Debt**: No pre-imposed architectural decisions to later refactor or work around.

6. **Phase 2 Ready**: Architected for scalability from day 1 (stateless design, Redis sessions) without unnecessary enterprise complexity.

**Party Mode Insights Integration:**

- **Winston (Architect)**: "Delay architectural decisions until you have data. The official starter gives you exactly this flexibility without premature commitments."
- **Amelia (Developer)**: "Week 3 MUST include Jest + RTL setup story. No TDD without testing infrastructure - non-negotiable."
- **Murat (Test Architect)**: "Epic 0: Project Infrastructure is critical. Include testing database (Docker Compose postgres:alpine) from day 1."

## Initialization Command

```bash
npx create-next-app@latest secondbrain --typescript --tailwind --eslint --app --src-dir --import-alias="@/*" --turbopack
```

**Options Explained:**
- `--typescript`: TypeScript enabled (PRD requirement)
- `--tailwind`: Tailwind CSS for rapid styling (can be replaced by CSS modules if preferred)
- `--eslint`: ESLint for code quality
- `--app`: App Router (Next.js 13+ modern architecture)
- `--src-dir`: Code in `/src` directory (clean separation src vs config)
- `--import-alias="@/*"`: Absolute imports (`import { X } from '@/components/X'`)
- `--turbopack`: Fast build tool (development speed boost)

## Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript 5.x (strict mode configurable manually)
- Node.js 20.x LTS (compatible with OVH VPS)
- React 19 (Next.js 15 default)

**Styling Solution:**
- Tailwind CSS 4.x configured out-of-the-box
- PostCSS setup included
- CSS Modules available as alternative/complement
- Responsive breakpoints by default

**Build Tooling:**
- Turbopack (ultra-fast dev server with HMR)
- Next.js compiler (production optimizations)
- Automatic tree-shaking
- Code splitting per route

**Code Organization (Default Structure):**
```
secondbrain/
├── src/
│   ├── app/              # App Router (routes, layouts, pages)
│   ├── components/       # React components (to create)
│   └── lib/              # Utilities, helpers, services (to create)
├── public/               # Static assets
├── package.json
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind configuration
└── next.config.ts        # Next.js configuration
```

**Recommended Structure Evolution (Week 3-4):**
```
secondbrain/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # UI components
│   │   ├── editor/       # Markdown editor components
│   │   ├── refinement/   # Refinement workflow UI
│   │   ├── digest/       # Digest display components
│   │   └── search/       # Search interface components
│   ├── lib/
│   │   ├── db/           # PostgreSQL connection, queries, migrations
│   │   ├── redis/        # Bull Queue setup, job handlers
│   │   ├── tier1/        # Local heuristics suggestion engine
│   │   ├── claude/       # Tier-2 Claude API integration
│   │   ├── auth/         # Simple authentication (session-based)
│   │   └── utils/        # Shared utilities
│   └── types/            # TypeScript type definitions
├── tests/                # Test files (Jest + RTL)
├── docker/               # Docker configurations
│   ├── Dockerfile
│   └── docker-compose.yml (PostgreSQL + Redis for dev/test)
└── docs/
    └── decisions/        # Architecture Decision Records (ADRs)
```

**Development Experience:**
- Hot Module Replacement (HMR) via Turbopack - instant feedback
- TypeScript IntelliSense in VS Code
- ESLint real-time feedback
- Fast Refresh (React state preserved during edits)

**Testing Framework:**
- ⚠️ **NOT INCLUDED** - Must configure manually in Week 3-4:
  - Jest + React Testing Library (unit + component tests)
  - Playwright or Cypress (E2E tests, Phase 2)
  - Testing coverage reporting (Istanbul/nyc)
  - Test database setup (Docker Compose with postgres:alpine)

**Critical Decisions to Make Manually (Weeks 3-4):**

1. **PostgreSQL Setup**
   - Library: `pg` (node-postgres) vs Prisma vs Drizzle
   - Connection pooling configuration
   - Migration strategy (manual SQL, Prisma Migrate, or db-migrate)
   - Full-text search (FTS) setup with tsvector

2. **Redis + Bull Queue Configuration**
   - Bull Queue for async job processing
   - Job definitions (Tier-2 suggestions, digest generation)
   - Redis connection and error handling

3. **Authentication Layer**
   - Simple session-based auth (MVP)
   - Session storage in Redis
   - Password hashing (bcrypt)

4. **Testing Infrastructure (Epic 0 - Critical)**
   - Jest configuration (`jest.config.js`)
   - React Testing Library setup
   - Test utilities and custom matchers
   - Docker Compose for test database
   - GitHub Actions CI workflow

5. **Docker Configuration**
   - `Dockerfile` for Next.js application
   - `docker-compose.yml` for local dev (PostgreSQL + Redis)
   - Multi-stage build for production optimization
   - OVH VPS deployment configuration

6. **Architecture Decision Records (ADRs)**
   - Document each major decision in `docs/decisions/`
   - Format: `adr-001-starter-template.md`, `adr-002-orm-choice.md`, etc.
   - Ensures AI agents implement consistently with documented rationale

**Epic 0: Project Infrastructure (Week 3-4 Deliverables)**

Based on Party Mode expert recommendations, the following infrastructure stories are **non-negotiable** for TDD success:

1. **Story 0.1**: Initialize Next.js with create-next-app
2. **Story 0.2**: Setup Jest + React Testing Library + test utilities
3. **Story 0.3**: Configure PostgreSQL test database (Docker Compose)
4. **Story 0.4**: Setup GitHub Actions CI (lint, typecheck, tests)
5. **Story 0.5**: Add pre-commit hooks (Husky + lint-staged)
6. **Story 0.6**: Create initial ADR documenting starter template decision

**Note:** Project initialization using this command is the **first implementation story** (Story 0.1). All testing infrastructure must be in place by Week 4 to enable TDD for feature development.
