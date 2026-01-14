# ADR-011: Testing Framework (Jest + React Testing Library)

## Status

Accepted

## Context

- TDD culture required: Test-first development
- Coverage target: >80% on business logic
- Component testing: React components in isolation
- API testing: Next.js route handlers

## Decision

Use **Jest (test runner) + React Testing Library (component testing) + Supertest (API testing)**

- **Unit tests**: Jest for utilities and services
- **Component tests**: React Testing Library for React components
- **API tests**: Supertest for Next.js API routes
- **Integration tests**: Database tests with real database
- **E2E tests**: Playwright (Phase 2)

## Rationale

- **Zero config**: Works out-of-the-box with Next.js
- **User-centric**: React Testing Library tests user behavior, not implementation
- **Excellent DX**: Fast feedback loop (watch mode)
- **Community**: Largest Node.js testing community
- **Coverage reporting**: Built-in coverage instrumentation

## Consequences

### Positive

- ✅ Fast test execution (watch mode)
- ✅ Great DX (instant feedback)
- ✅ Excellent coverage reports
- ✅ Community support (many examples)
- ✅ Works with TypeScript

### Negative

- ❌ Learning curve (testing philosophy)
- ❌ Setup can be complex (mocking, fixtures)
- ❌ Snapshot testing pitfalls (easily outdated)

## Alternatives Considered

### Alternative A: Vitest

- ✅ **Advantages**: Modern, faster than Jest
- ❌ **Disadvantages**: Less mature, smaller community
- **Good Phase 2 alternative**: If performance becomes issue

### Alternative B: Cypress (E2E only)

- ✅ **Advantages**: Great developer experience for E2E
- ❌ **Disadvantages**: Not suitable for unit tests
- **Deferred Phase 2**: Use for E2E testing

### Alternative C: Testing Library solo (no Jest)

- ✅ **Advantages**: Minimal setup
- ❌ **Disadvantages**: No runner, no reporting
- **Rejected**: Jest + RTL combo is standard

## Implementation Notes

### Installation

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev supertest @types/supertest
```

### Jest Configuration

```typescript
// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: { statements: 80, branches: 80, functions: 80, lines: 80 }
  }
}

export default config
```

### Component Test Example

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  it('renders and handles click', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### API Route Test Example

```typescript
// src/app/api/notes/__tests__/route.test.ts
import request from 'supertest'
import { describe, it, expect } from '@jest/globals'

describe('GET /api/notes', () => {
  it('returns notes for authenticated user', async () => {
    const response = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
})
```

## Migration Path

**To Vitest**: 1 day (config file translation, same API)

**To Playwright (E2E)**: 2-3 days (E2E test setup alongside Jest)

## See Also

- [ADR-001: Starter Template](./adr-001-starter-template.md) - Next.js integration
- [ADR-010: CI/CD Pipeline](./adr-010-cicd-github-actions.md) - Test automation
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
