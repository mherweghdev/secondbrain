# Epic 0: Project Infrastructure & Foundation

**Goal:** L'infrastructure de développement est prête pour construire avec qualité (TDD, CI/CD, tests)

## Story 0.1: Initialize Next.js Project with TypeScript

As a developer,
I want to initialize a Next.js project with TypeScript and recommended tooling,
So that I have a solid foundation for building the application with type safety.

**Acceptance Criteria:**

**Given** I need to start the project from scratch
**When** I run the create-next-app command with specified options
**Then** A Next.js project is created with TypeScript, Tailwind CSS, ESLint, App Router, and Turbopack configured
**And** The project structure includes src/ directory with app/ folder
**And** Import aliases (@/*) are configured in tsconfig.json
**And** The development server starts successfully with `npm run dev`
**And** TypeScript strict mode is enabled in tsconfig.json

---

## Story 0.2: Setup Testing Infrastructure (Jest + React Testing Library)

As a developer,
I want to configure Jest and React Testing Library with TypeScript support,
So that I can write and run unit and component tests following TDD practices.

**Acceptance Criteria:**

**Given** The Next.js project is initialized
**When** I install and configure Jest and React Testing Library
**Then** jest.config.js is created with Next.js preset and TypeScript support
**And** Test utilities are created in src/__tests__/utils/ for custom matchers and helpers
**And** A sample test runs successfully with `npm test`
**And** Test coverage reporting is configured with Istanbul/nyc
**And** Coverage thresholds are set to >80% (lines, branches, functions, statements)
**And** package.json scripts include: test, test:watch, test:coverage

---

## Story 0.3: Configure Test Database (Docker Compose PostgreSQL)

As a developer,
I want a PostgreSQL test database running in Docker Compose,
So that I can run integration tests against a real database without affecting production data.

**Acceptance Criteria:**

**Given** The project needs database testing capabilities
**When** I create docker-compose.yml for local development
**Then** PostgreSQL 15.x container is defined (postgres:15-alpine image)
**And** Test database credentials are configured in .env.test file
**And** Database runs on port 5433 (to avoid conflicts with local PostgreSQL on 5432)
**And** Docker Compose can be started with `docker-compose up -d`
**And** Database persists data in a local volume
**And** A test connection script verifies database connectivity
**And** .env.test is added to .gitignore

---

## Story 0.4: Setup CI/CD Pipeline (GitHub Actions)

As a developer,
I want a GitHub Actions workflow that runs lint, typecheck, and tests on every PR,
So that code quality is enforced automatically before merging.

**Acceptance Criteria:**

**Given** The project is hosted on GitHub
**When** I create .github/workflows/ci.yml
**Then** Workflow triggers on push to main and pull requests
**And** Workflow runs on ubuntu-latest with Node.js 20.x
**And** Steps include: checkout, install dependencies, lint (ESLint), typecheck (tsc --noEmit), test (Jest with coverage)
**And** Workflow fails if lint errors, type errors, or test failures occur
**And** Coverage report is uploaded as artifact
**And** Workflow completes in <5 minutes for typical changes
**And** Branch protection rules can be configured to require CI pass before merge

---

## Story 0.5: Configure Code Quality Tools (Pre-commit hooks, Husky)

As a developer,
I want pre-commit hooks that run lint and typecheck before allowing commits,
So that bad code never enters the repository.

**Acceptance Criteria:**

**Given** The project needs automated code quality enforcement
**When** I install and configure Husky + lint-staged
**Then** Husky is initialized in the project (.husky/ directory created)
**And** Pre-commit hook is configured to run lint-staged
**And** lint-staged configuration in package.json runs ESLint and TypeScript check on staged files
**And** Attempting to commit code with lint errors is blocked
**And** Attempting to commit code with type errors is blocked
**And** Valid code commits successfully
**And** Hooks work on all team members' machines (cross-platform compatible)

---

## Story 0.6: Create Architecture Decision Records (ADR documentation)

As a developer,
I want to document critical architectural decisions in ADR format,
So that future developers (and AI agents) understand the rationale behind key choices.

**Acceptance Criteria:**

**Given** The project has made several architectural decisions (starter template, database, auth, etc.)
**When** I create the docs/decisions/ directory structure
**Then** ADR template is created in docs/decisions/adr-template.md
**And** ADR-001: Starter Template Selection is documented (rationale: create-next-app over boilerplates)
**And** ADR-002: Database and ORM Strategy is documented (rationale: Supabase PostgreSQL + Prisma)
**And** ADR-003: Authentication Strategy is documented (rationale: Supabase Auth)
**And** Each ADR follows the format: Title, Status, Context, Decision, Consequences, Alternatives Considered
**And** ADRs are numbered sequentially (adr-001, adr-002, etc.)
**And** README.md in docs/decisions/ explains the ADR process

---
