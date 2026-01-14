# ADR-012: Logging Infrastructure (Pino structured JSON)

## Status

Accepted

## Context

- Production observability required (error tracking, debugging)
- Security concern: No sensitive data (passwords, tokens) in logs
- Performance: Logging should not impact request latency
- Structured data: JSON logs for log aggregation

## Decision

Use **Pino logger with automatic sensitive data redaction**

- **Format**: Structured JSON (machine-readable)
- **Redaction**: Automatic sensitive field masking
- **Transports**: Console (development), file/syslog (production)
- **Performance**: Async logging (minimal impact)

## Rationale

- **Fast**: Minimal JSON serialization overhead
- **Structured**: JSON output works with log aggregation services
- **Security**: Automatic redaction of sensitive fields
- **Flexible**: Works in Node.js + browsers (if needed Phase 2)
- **Community**: Growing adoption in Node.js ecosystem

## Consequences

### Positive

- ✅ Fast (async logging)
- ✅ Structured (JSON format)
- ✅ Secure (automatic redaction)
- ✅ Simple API (minimal syntax)
- ✅ Production-ready

### Negative

- ❌ Less familiar than console.log
- ❌ JSON output harder to read in development (need pretty printer)
- ❌ Configuration required for redaction

## Alternatives Considered

### Alternative A: Winston

- ✅ **Advantages**: Powerful, many features
- ❌ **Disadvantages**: More boilerplate, heavier (4.7KB vs 1.8KB)
- **Rejected**: Pino simpler, lighter

### Alternative B: console.log (bare minimum)

- ✅ **Advantages**: No dependencies, built-in
- ❌ **Disadvantages**: No structure, no security controls
- **Rejected**: Not suitable for production

### Alternative C: Bunyan

- ✅ **Advantages**: Good structured logging
- ❌ **Disadvantages**: Less maintained than Pino
- **Rejected**: Pino more active community

## Implementation Notes

### Installation

```bash
npm install pino pino-pretty
npm install -D pino-pretty
```

### Logger Setup

```typescript
// lib/logger.ts
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: ['password', 'token', 'secret', 'api_key', 'auth'],
    remove: true
  },
  transport: process.env.NODE_ENV === 'production'
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true }
      }
})

export default logger
```

### Usage Example

```typescript
// app/api/notes/route.ts
import logger from '@/lib/logger'

export async function GET(request: Request) {
  logger.info({ url: request.url }, 'Fetching notes')
  
  try {
    const notes = await fetchNotes()
    logger.info({ count: notes.length }, 'Notes retrieved')
    return Response.json(notes)
  } catch (error) {
    logger.error({ error }, 'Failed to fetch notes')
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Production JSON Output

```json
{
  "level": 20,
  "time": 1673567890123,
  "msg": "Fetching notes",
  "url": "/api/notes",
  "pid": 12345,
  "hostname": "server"
}
```

### Development Pretty Output

```
[10:30:45.123] INFO (12345): Fetching notes
    url: /api/notes
```

## Migration Path

**To Winston**: 1-2 days (API differences, transport configuration)

**To external service (DataDog, LogRocket)**: 1 day (transport configuration)

## See Also

- [ADR-001: Starter Template](./adr-001-starter-template.md) - Node.js runtime
- [ADR-010: CI/CD Pipeline](./adr-010-cicd-github-actions.md) - Log output in CI
- [Pino Documentation](https://getpino.io/)
- [Pino Pretty](https://github.com/pinojs/pino-pretty)
