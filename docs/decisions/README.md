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
| [001](./adr-001-starter-template.md) | Starter Template Selection | Accepted | 2026-01-13 |
| [002](./adr-002-database-supabase-postgresql.md) | Database Strategy | Accepted | 2026-01-13 |
| [003](./adr-003-orm-prisma.md) | ORM Selection | Accepted | 2026-01-13 |
| [004](./adr-004-authentication-supabase-auth.md) | Authentication Strategy | Accepted | 2026-01-13 |
| [005](./adr-005-async-processing-redis-bull.md) | Async Processing | Accepted | 2026-01-13 |
| [006](./adr-006-api-design-nextjs-routes.md) | API Design | Accepted | 2026-01-13 |
| [007](./adr-007-state-management-rsc-zustand.md) | State Management | Accepted | 2026-01-13 |
| [008](./adr-008-markdown-editor-codemirror.md) | Markdown Editor | Accepted | 2026-01-13 |
| [009](./adr-009-deployment-vercel-ovh.md) | Deployment Strategy | Accepted | 2026-01-13 |
| [010](./adr-010-cicd-github-actions.md) | CI/CD Pipeline | Accepted | 2026-01-13 |
| [011](./adr-011-testing-jest-rtl.md) | Testing Framework | Accepted | 2026-01-13 |
| [012](./adr-012-logging-pino.md) | Logging Infrastructure | Accepted | 2026-01-13 |

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
- [Documenting Architecture Decisions by Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
