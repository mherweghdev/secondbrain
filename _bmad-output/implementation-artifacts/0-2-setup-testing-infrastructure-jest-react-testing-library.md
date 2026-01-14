# Story 0.2: Setup Testing Infrastructure (Jest + React Testing Library)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to configure Jest and React Testing Library with TypeScript support,
So that I can write and run unit and component tests following TDD practices.

## Acceptance Criteria

**Given** The Next.js project is initialized (Story 0.1 complete)
**When** I install and configure Jest and React Testing Library
**Then** jest.config.js is created with Next.js preset and TypeScript support
**And** Test utilities are created in src/__tests__/utils/ for custom matchers and helpers
**And** A sample test runs successfully with `npm test`
**And** Test coverage reporting is configured with Istanbul/nyc
**And** Coverage thresholds are set to >80% (lines, branches, functions, statements)
**And** package.json scripts include: test, test:watch, test:coverage

## Tasks / Subtasks

- [x] Install Jest and React Testing Library dependencies (AC: All)
  - [x] Install jest, @jest/types, jest-environment-jsdom
  - [x] Install @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
  - [x] Install ts-jest for TypeScript support
  - [x] Install @types/jest for TypeScript type definitions
- [x] Create Jest configuration (AC: jest.config.js is created with Next.js preset)
  - [x] Create jest.config.ts with Next.js preset
  - [x] Configure testEnvironment: 'jsdom'
  - [x] Setup moduleNameMapper for import aliases (@/*)
  - [x] Configure setupFilesAfterEnv for custom matchers
  - [x] Add transform for TypeScript files with ts-jest
- [x] Setup test utilities (AC: Test utilities are created in src/__tests__/utils/)
  - [x] Create src/__tests__/utils/test-utils.tsx with custom render function
  - [x] Create src/__tests__/utils/custom-matchers.ts for Jest custom matchers
  - [x] Create src/__tests__/setup.ts to register @testing-library/jest-dom matchers
- [x] Configure test coverage (AC: Coverage thresholds set to >80%)
  - [x] Add collectCoverage configuration to jest.config.ts
  - [x] Set coverage thresholds: lines 80%, branches 80%, functions 80%, statements 80%
  - [x] Configure coverageDirectory: 'coverage'
  - [x] Configure coveragePathIgnorePatterns to exclude node_modules, .next, coverage
- [x] Add test scripts to package.json (AC: package.json scripts include test, test:watch, test:coverage)
  - [x] Add "test": "jest"
  - [x] Add "test:watch": "jest --watch"
  - [x] Add "test:coverage": "jest --coverage"
- [x] Create sample test (AC: A sample test runs successfully with npm test)
  - [x] Create src/app/page.test.tsx (à côté de page.tsx - colocation)
  - [x] Write test: "renders homepage without crashing"
  - [x] Write test: "displays main heading"
  - [x] Run npm test and verify all tests pass

### Review Follow-ups (AI)

- [x] [AI-Review][HIGH] Utiliser le custom render de test-utils au lieu de @testing-library/react direct [src/app/page.test.tsx:1]
  - Fixed: Modified page.test.tsx to import render from '@/__tests__/utils/test-utils'
- [x] [AI-Review][HIGH] Implémenter au moins un custom matcher fonctionnel dans custom-matchers.ts et l'importer dans setup.ts [src/__tests__/utils/custom-matchers.ts:7]
  - Fixed: Implemented toHaveExactClasses() custom matcher for CSS class validation
  - Fixed: Added import './utils/custom-matchers' in setup.ts
- [x] [AI-Review][MEDIUM] Ajouter un test de smoke pour valider que customRender fonctionne avec un wrapper vide [src/__tests__/utils/test-utils.tsx]
  - Fixed: Created test-utils.test.tsx with 2 smoke tests validating customRender functionality
- [x] [AI-Review][MEDIUM] Documenter ou supprimer le warning Node.js ExperimentalWarning: Type Stripping [package.json scripts]
  - Fixed: Added NODE_OPTIONS='--disable-warning=ExperimentalWarning' to all test scripts
- [x] [AI-Review][MEDIUM] Clarifier dans Dev Notes pourquoi layout.test.tsx teste seulement metadata et pas le rendu [src/app/layout.test.tsx]
  - Fixed: Added "Layout Testing Limitation Note" section in Dev Notes explaining Server Component constraints
- [x] [AI-Review][LOW] Supprimer coveragePathIgnorePatterns redondants (/.next/, /coverage/ sont par défaut) [jest.config.ts:31-35]
  - Fixed: Removed coveragePathIgnorePatterns entirely from jest.config.ts
- [x] [AI-Review][LOW] Optionnel: Ajouter NODE_OPTIONS pour supprimer le warning expérimental
  - Fixed: Already addressed in MEDIUM item above

## Dev Notes

### Previous Story Intelligence (Story 0.1 Learnings)

**Technical Stack Established:**
- Next.js 16.1.1 with Turbopack (stable)
- TypeScript 5.x with enhanced strict mode
- React 19.x (with Server Components)
- Import aliases: @/* → src/*
- Project structure: src/app/, src/components/, src/lib/, src/types/

**Key Files Created:**
- tsconfig.json (strict mode enabled, import aliases configured)
- package.json (Next.js, TypeScript, Tailwind CSS, ESLint)
- src/app/page.tsx (main homepage component)
- src/app/layout.tsx (root layout with metadata)

**Testing Considerations from Previous Story:**
- Next.js 16.x uses React Server Components by default
- Must configure Jest to handle both Server and Client Components
- Turbopack doesn't affect test running (Jest runs independently)
- TypeScript strict mode requires proper type definitions for tests

### Architecture Requirements for Testing

**Testing Standards (from Architecture):**
- Target: >80% code coverage (lines, branches, functions, statements)
- Testing Framework: Jest with React Testing Library
- Philosophy: Test behavior, not implementation details
- TDD approach encouraged for all new features

**Testing File Structure Pattern (Colocation):**
```
src/
├── app/
│   ├── page.tsx
│   ├── page.test.tsx          # Test à côté du code (colocation)
│   ├── layout.tsx
│   └── layout.test.tsx
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx    # Test à côté du composant
│       └── index.ts
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── __tests__/
    ├── setup.ts               # Global test setup
    └── utils/
        ├── test-utils.tsx     # Custom render with providers
        └── custom-matchers.ts # Jest custom matchers
```

**Philosophie: Colocation des tests à côté du code**
- Tests collocalisés (*.test.tsx) pour proximité et maintenance
- Seuls les utilitaires partagés restent dans __tests__/utils/

**Next.js 16.x Testing Configuration Requirements:**

```typescript
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/__tests__/**',
  ],
  coverageThresholds: {
    global: {
      lines: 80,
      branches: 80,
      functions: 80,
      statements: 80,
    },
  },
}

export default createJestConfig(config)
```

### TypeScript Configuration for Tests

**Update tsconfig.json to include test files:**
```json
{
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom"]
  }
}
```

### Latest Technical Information (2026)

**Jest 30.x Updates:**
- Native ESM support (no longer experimental)
- Improved TypeScript support with ts-jest 29.x
- Faster test execution with parallel workers
- Better snapshot diffing and error messages

**React Testing Library 16.x Features:**
- Full React 19 support (Server Components compatibility)
- Enhanced user-event library for realistic user interactions
- Improved async testing utilities (waitFor, findBy queries)
- Better error messages for query failures

**Next.js 16.x Testing Considerations:**
- Server Components require special handling in tests (use next/jest preset)
- Client Components must be marked with 'use client' directive
- next/jest automatically configures SWC for faster transformations
- Turbopack not used in test environment (Jest uses SWC directly)

### Sample Test Example

**src/app/page.test.tsx (collocalisé avec page.tsx):**
```typescript
// Utiliser le custom render du projet pour bénéficier des providers futurs
import { render, screen } from '@/__tests__/utils/test-utils'
import Page from '@/app/page'

describe('Home Page', () => {
  it('renders homepage without crashing', () => {
    render(<Page />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays main heading', () => {
    render(<Page />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/get started/i)
  })
})
```

### Testing Best Practices (Guardrails for Dev Agent)

1. **Test Behavior, Not Implementation:**
   - Use semantic queries (getByRole, getByLabelText) over getByTestId
   - Test user-facing behavior, not internal state
   - Avoid testing implementation details like CSS classes

2. **Coverage Targets:**
   - Aim for >80% coverage as baseline
   - 100% coverage not required for boilerplate/generated code
   - Focus on critical business logic and user flows

3. **Test Organization (Colocation):**
   - Place test files next to source code (component.test.tsx à côté de component.tsx)
   - One test file per component/module
   - Group related tests using describe blocks
   - Only shared test utilities remain in __tests__/utils/

4. **Async Testing:**
   - Use findBy queries for async elements
   - Use waitFor for async state changes
   - Avoid arbitrary timeouts (use testing-library's built-in retry logic)

5. **Server Components Testing:**
   - Next.js 16.x Server Components may require special handling
   - Use next/jest preset to handle server-only imports
   - Mock server-side APIs and data fetching

### Performance & Quality Requirements

**NFR-P5 (Testing Performance):**
- Test suite should complete in <30 seconds for typical changes
- Use --maxWorkers to control parallel execution
- Configure test timeouts appropriately (default 5s usually sufficient)

**Code Quality:**
- All tests must pass before PR merge (enforced by CI in Story 0.4)
- Zero tolerance for skipped tests in CI (skip only locally for debugging)
- Test coverage reports uploaded to CI artifacts

### Project Structure Notes

**Alignment with Modern Best Practices (Colocation):**
- Tests collocalisés à côté du code source (*.test.tsx next to *.tsx)
- Avantage: Proximité, maintenance facilitée, imports simples
- Test utilities partagés dans src/__tests__/utils/ pour réutilisabilité
- Setup file global dans src/__tests__/setup.ts
- Coverage reports dans coverage/ directory (added to .gitignore)

**No Conflicts:** Colocation est la convention moderne Next.js/React. Jest ignore automatiquement les *.test.* en production build.

### References

- [Source: epics.md - Epic 0: Project Infrastructure & Foundation]
- [Source: epics.md - Story 0.2: Setup Testing Infrastructure]
- [Previous Story: 0-1-initialize-nextjs-project-with-typescript.md]
- [Jest Documentation: https://jestjs.io/docs/getting-started]
- [React Testing Library Documentation: https://testing-library.com/docs/react-testing-library/intro]
- [Next.js Testing Documentation: https://nextjs.org/docs/app/building-your-application/testing/jest]

### Dependencies to Install

```bash
npm install --save-dev \
  jest \
  @jest/types \
  jest-environment-jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  ts-jest \
  @types/jest
```

**Note:** Next.js 16.x may include some testing dependencies by default. Verify with `npm ls` before installing.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- Fixed import path for next/jest (next/jest → next/jest.js) for Jest 30.x compatibility
- Corrected Jest config option: coverageThresholds → coverageThreshold (singular)
- Added testMatch pattern to exclude non-test utility files from test execution
- Excluded src/app/layout.tsx from coverage due to Next.js Server Component testing complexity

### Layout Testing Limitation Note

**Why layout.test.tsx only tests metadata (not component rendering):**

Next.js 16.x uses React Server Components by default. The root layout component renders an `<html>` tag, which is a server-only construct. When testing in jsdom environment, attempting to render the full layout component causes errors because:

1. **HTML tag constraint**: jsdom's document already has an `<html>` root element, and React cannot render another `<html>` element as a child
2. **Server Component complexity**: Server Components use async rendering patterns that require special test setup not covered in basic Jest configuration
3. **Boilerplate nature**: The layout component is Next.js framework boilerplate with minimal custom logic worth unit testing

**Solution adopted**: Test only the exported `metadata` object (title, description) which contains application-specific values. This provides value coverage for what matters (correct metadata values) without fighting framework constraints.

**Alternative approaches** (not implemented as over-engineering for basic layout):
- Mock Next.js server rendering with custom test environment
- Extract layout logic into separate testable components
- Use E2E tests (Playwright/Cypress) to validate full page rendering

**Coverage impact**: layout.tsx is excluded from coverage via `!src/app/layout.tsx` in jest.config.ts. This is standard practice for framework-generated boilerplate files.

### Completion Notes List

✅ **All tasks completed successfully**

1. **Dependencies Installation**
   - Installed Jest 30.2.0, React Testing Library 16.3.1, and all required dependencies
   - All packages compatible with Next.js 16.x and React 19.x

2. **Jest Configuration**
   - Created jest.config.ts with Next.js preset using next/jest.js
   - Configured jsdom test environment for React component testing
   - Set up module name mapper for @/* import aliases
   - Configured coverage thresholds: 80% for lines, branches, functions, statements
   - Added testMatch pattern to properly identify test files

3. **Test Utilities**
   - Created src/__tests__/setup.ts to register jest-dom matchers globally
   - Created src/__tests__/utils/test-utils.tsx with custom render function
   - Created src/__tests__/utils/custom-matchers.ts for future custom matchers
   - All utilities ready for extension with providers, contexts, etc.

4. **Test Coverage Configuration**
   - Coverage directory: coverage/
   - Coverage thresholds enforced at 80% (all metrics)
   - Excluded boilerplate files (layout.tsx, stories, type definitions)
   - Coverage reports generated successfully

5. **Test Scripts**
   - Added "test": "jest" to package.json
   - Added "test:watch": "jest --watch" for TDD workflow
   - Added "test:coverage": "jest --coverage" for coverage reports
   - Updated tsconfig.json with jest and @testing-library/jest-dom types

6. **Sample Tests**
   - Created src/app/page.test.tsx (colocated with page.tsx)
   - Test: "renders homepage without crashing" ✅
   - Test: "displays main heading" ✅
   - Created src/app/layout.test.tsx for metadata validation ✅
   - All tests passing with 100% coverage on tested files

**Test Results (after review fixes):**
- Test Suites: 3 passed, 3 total
- Tests: 6 passed, 6 total
- Coverage: 100% (lines, branches, functions, statements) - exceeds 80% threshold
- ExperimentalWarning: Suppressed via NODE_OPTIONS in test scripts

### File List

**Created files:**
- jest.config.ts
- src/__tests__/setup.ts
- src/__tests__/utils/test-utils.tsx
- src/__tests__/utils/custom-matchers.ts (with toHaveExactClasses() custom matcher)
- src/__tests__/utils/test-utils.test.tsx (smoke tests for custom render)
- src/app/page.test.tsx
- src/app/layout.test.tsx

**Modified files:**
- package.json (added test scripts with NODE_OPTIONS and devDependencies)
- tsconfig.json (added jest and @testing-library/jest-dom types)

**Note:** .gitignore already contained /coverage directory from Next.js template.

---

## Change Log

- 2026-01-12: Testing infrastructure configured with Jest 30.x and React Testing Library 16.x
- All acceptance criteria met and validated
- Test suite operational and ready for TDD workflow
