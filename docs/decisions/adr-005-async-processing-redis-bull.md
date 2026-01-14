# ADR-005: Async Processing (Redis + Bull Queue)

## Status

Accepted

## Context

- Epic 4: Tier-2 Claude API enrichment (async processing)
- Epic 5: Friday Refinement Workflow (background jobs)
- Epic 7: Weekly Digest Generation (scheduled jobs)
- Solo developer: Simplified job queue management needed

## Decision

Use **Docker Redis (local) + Bull Queue (Node.js library) + Upstash Redis (Vercel production)**

- Local development: Docker Redis container
- Production on Vercel: Upstash Redis serverless
- Job queue: Bull (simple, reliable Node.js queue)

## Rationale

- **Simple setup**: Bull works directly with Redis (no additional services)
- **Async processing**: Offload long-running tasks (Claude API calls, digest generation)
- **Scheduled jobs**: Cron jobs for digest generation (7 AM Monday)
- **Reliability**: Bull provides job persistence and retry logic
- **Cost-effective**: Free tier sufficient for MVP

## Consequences

### Positive

- ✅ Easy local development (Docker Redis)
- ✅ Reliable job processing (Bull retry logic)
- ✅ Scheduled jobs built-in (cron expressions)
- ✅ Free tier on Upstash (sufficient for MVP)
- ✅ No additional infrastructure (serverless compatible)

### Negative

- ❌ Redis adds operational complexity (Docker dependency)
- ❌ Upstash vendor lock-in (minimal exit effort)
- ❌ Connection pooling considerations for serverless

## Alternatives Considered

### Alternative A: AWS SQS + Lambda

- ✅ **Advantages**: AWS ecosystem, highly scalable
- ❌ **Disadvantages**: More expensive, complex setup for MVP
- **Rejected**: Overengineered for MVP

### Alternative B: Celery (Python)

- ✅ **Advantages**: Powerful task queue
- ❌ **Disadvantages**: Requires Python runtime, adds complexity
- **Rejected**: Node.js ecosystem preferred

### Alternative C: Inline cron jobs

- ✅ **Advantages**: No external dependencies
- ❌ **Disadvantages**: Not reliable (process death loses jobs), no retries
- **Rejected**: Production-quality requirements

## Implementation Notes

### Installation

```bash
npm install bull redis
npm install -D @types/bull
```

### Local Redis (Docker)

```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### Bull Queue Example

```typescript
import Queue from 'bull'

// Create queue
const enrichmentQueue = new Queue('enrichment', {
  redis: { host: 'localhost', port: 6379 }
})

// Process jobs
enrichmentQueue.process(async (job) => {
  // Claude API call
  const result = await callClaudeAPI(job.data)
  return result
})

// Add job
await enrichmentQueue.add({ noteId: '123' })
```

## Migration Path

**To AWS SQS**: 2-3 days to migrate queue logic to SQS while preserving job data

## See Also

- [ADR-009: Deployment Strategy](./adr-009-deployment-vercel-ovh.md) - Upstash integration
- [ADR-002: Database Strategy](./adr-002-database-supabase-postgresql.md) - Job persistence
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [Upstash Redis](https://upstash.com/)
