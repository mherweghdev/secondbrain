# ADR-010: CI/CD Pipeline (GitHub Actions)

## Status

Accepted

## Context

- Quality gates required: lint, typecheck, test, coverage
- Deployment automation needed (Git → production)
- Free tier sufficient for individual project
- GitHub native integration preferred

## Decision

Use **GitHub Actions for CI/CD pipeline**

- **On push to main**: Run tests, lint, type checking
- **On pull request**: Run all checks before merging
- **On release tag**: Deploy to production (Vercel)
- **Performance target**: <5 minutes per workflow run

## Rationale

- **Native integration**: Works with GitHub without auth setup
- **Generous free tier**: Sufficient for solo developer
- **Matrix testing**: Test multiple Node.js versions
- **Conditional workflows**: Different steps for different branches
- **Secrets management**: Built-in environment variables

## Consequences

### Positive

- ✅ $0 monthly cost (free tier)
- ✅ Native GitHub integration
- ✅ Easy to maintain (YAML files in repo)
- ✅ Good documentation and examples
- ✅ Matrix testing support

### Negative

- ❌ Slower than self-hosted runners (acceptable for MVP)
- ❌ GitHub Actions YAML syntax learning curve
- ❌ Limited concurrency on free tier

## Alternatives Considered

### Alternative A: CircleCI

- ✅ **Advantages**: Powerful workflows, good UI
- ❌ **Disadvantages**: Free tier limited, paid required
- **Rejected**: Cost exceeds budget

### Alternative B: Travis CI

- ✅ **Advantages**: Simple setup, good community
- ❌ **Disadvantages**: Limited free tier, slower builds
- **Rejected**: GitHub Actions native better

### Alternative C: Self-hosted Runner

- ✅ **Advantages**: Complete control, fast builds
- ❌ **Disadvantages**: DevOps overhead, requires dedicated machine
- **Deferred Phase 2**: Self-hosted if builds become bottleneck

## Implementation Notes

### Workflow Example

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Run tests
        run: npm test

      - name: Check coverage
        run: npm run coverage
```

## Migration Path

**To CircleCI**: 1-2 days (workflow translation from YAML to CircleCI format)

**To self-hosted**: 1-2 days (infrastructure setup, runner configuration)

## See Also

- [ADR-001: Starter Template](./adr-001-starter-template.md) - npm scripts
- [ADR-011: Testing Framework](./adr-011-testing-jest-rtl.md) - Test execution
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
