# ADR-004: Authentication Strategy (Supabase Auth)

## Status

Accepted

## Context

- MVP: Single user (simple auth)
- Phase 2: Multi-user SaaS (extensible auth)
- Session management: 30-day token expiry, 2-hour inactivity timeout
- Security: Zero data loss = secure authentication critical

## Decision

Use **Supabase Auth with email/password (MVP)**, OAuth extensible (Phase 2)

- Session management via JWT tokens (httpOnly cookies)
- Token auto-refresh: 30-day expiry, configurable
- Password hashing: bcrypt (Supabase native)
- Middleware enforcement: src/middleware.ts

## Rationale

- **Native integration**: Works with Next.js (`@supabase/auth-helpers-nextjs`)
- **JWT-based sessions**: Stateless, scalable architecture
- **httpOnly cookies**: XSS protection built-in
- **RLS ready**: Row Level Security for Phase 2 multi-tenancy
- **Email verification**: Built-in security
- **OAuth extensible**: Social providers (Google, GitHub) for Phase 2

## Consequences

### Positive

- ✅ Zero configuration MVP (Supabase project dashboard)
- ✅ Secure by default (bcrypt, JWT, httpOnly cookies)
- ✅ Middleware enforcement automatic (`middleware.ts`)
- ✅ RLS ready (Phase 2 multi-tenancy)
- ✅ Social OAuth providers easy to enable
- ✅ MFA/SAML available Phase 2

### Negative

- ❌ Vendor lock-in to Supabase (mitigation: NextAuth.js migration possible)
- ❌ Advanced features (MFA, SAML) require paid plan
- ❌ Supabase project dependency (managed service)

## Alternatives Considered

### Alternative A: NextAuth.js

- ✅ **Advantages**: Framework-agnostic, many providers
- ❌ **Disadvantages**: Overkill for single-user MVP, complex setup
- **Deferred Phase 2**: Better when multi-user active

### Alternative B: Custom Session + Redis

- ✅ **Advantages**: Complete control
- ❌ **Disadvantages**: Security risk (custom implementation), redundant with Supabase
- **Rejected**: Redis reserved for Bull Queue (async jobs)

### Alternative C: Auth0

- ✅ **Advantages**: Enterprise-grade features
- ❌ **Disadvantages**: Costs from start ($25-100/month)
- **Rejected**: Budget constraint <$5/month

## Implementation Notes

### Installation

```bash
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
```

### Middleware Setup

```typescript
// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  await supabase.auth.getSession()
  return response
}
```

## Migration Path

**To NextAuth.js**: 3-5 days to migrate all auth logic to NextAuth with Supabase provider

## See Also

- [ADR-002: Database Strategy](./adr-002-database-supabase-postgresql.md) - Database integration
- [ADR-006: API Design](./adr-006-api-design-nextjs-routes.md) - API endpoint protection
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
