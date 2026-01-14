# ADR-006: API Design (Next.js API Routes REST)

## Status

Accepted

## Context

- Full-stack Next.js project (API + UI in same codebase)
- CRUD operations for notes, tags, suggestions
- Authentication required on protected routes
- Simple RESTful semantics sufficient

## Decision

Use **RESTful API via Next.js App Router `/app/api/*` routes**

- REST endpoints: `/api/notes`, `/api/notes/{id}`, `/api/search`
- HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove)
- Error handling: Standard HTTP status codes
- Authentication: Middleware + route protection

## Rationale

- **Native to Next.js**: No additional framework needed
- **Type-safe**: Full TypeScript support
- **Simple routing**: Familiar REST patterns
- **Integrates with auth**: Supabase Auth + middleware
- **CORS built-in**: Next.js handles CORS automatically

## Consequences

### Positive

- ✅ Zero additional dependencies
- ✅ Type-safe request/response bodies
- ✅ Easy to test (standard HTTP)
- ✅ Standard REST semantics
- ✅ Middleware integration seamless

### Negative

- ❌ Opinionated by Next.js conventions
- ❌ Not suitable for complex GraphQL requirements
- ❌ URL-based routing less flexible than some frameworks

## Alternatives Considered

### Alternative A: GraphQL (Apollo)

- ✅ **Advantages**: Powerful query language, flexible data fetching
- ❌ **Disadvantages**: Overkill for MVP, complex setup
- **Deferred Phase 2**: GraphQL good when query complexity high

### Alternative B: tRPC

- ✅ **Advantages**: End-to-end type safety
- ❌ **Disadvantages**: Adds complexity, API harder to use externally
- **Rejected for MVP**: REST simpler for single-user app

### Alternative C: Separate backend (Express/Fastify)

- ✅ **Advantages**: Separation of concerns
- ❌ **Disadvantages**: Doubles deployment complexity, solo dev overhead
- **Rejected**: Full-stack Next.js simpler

## Implementation Notes

### API Route Example

```typescript
// app/api/notes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient()
  const { data, error } = await supabase.from('notes').select()
  
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = createRouteHandlerClient()
  const { data, error } = await supabase.from('notes').insert([body])
  
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
```

### Error Handling Pattern

```typescript
// lib/api-response.ts
export function apiError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), { status })
}

export function apiSuccess(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status })
}
```

## Migration Path

**To GraphQL**: 3-4 days to build GraphQL API alongside REST (gradual migration)

**To tRPC**: 2-3 days to migrate routes to tRPC procedures

## See Also

- [ADR-001: Starter Template](./adr-001-starter-template.md) - Next.js framework
- [ADR-004: Authentication](./adr-004-authentication-supabase-auth.md) - Route protection
- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
