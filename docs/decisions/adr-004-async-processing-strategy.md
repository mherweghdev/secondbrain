# ADR-004: Async Processing Strategy

## Status
Accepted

## Date
2026-01-11

## Context

The secondbrain project has two async processing requirements:

1. **Tier-2 Enrichment**: Claude API calls must be non-blocking (avoid <1 sec note capture latency NFR)
2. **Digest Generation**: Scheduled weekly digest creation (Friday 2am UTC, must complete before Monday 6:30am)

Key constraints:
- **Cost Budget**: <$5/month for Claude API (token tracking mandatory)
- **Reliability**: 3 retry attempts with exponential backoff for API failures
- **Graceful Degradation**: Tier-2 failures should not block note capture (fallback to Tier-1 only)
- **Deployment**: Must work on both Vercel (serverless) and OVH VPS (Docker)

Requirements:
- Job persistence (survive server restarts)
- Retry logic with exponential backoff
- Job status visibility (for monitoring/debugging)
- Scheduled jobs (cron-like for digest generation)
- Low operational overhead (solo developer)

## Decision

We will use **Redis 7.x + Bull Queue** for all async job processing.

**Redis Hosting Options:**

**Option A: Upstash Redis (Vercel Deployment - Recommended)**
- Serverless Redis compatible with Vercel Edge
- Free tier: 10,000 commands/day
- Latency: ~20-50ms
- Cost: Free for MVP

**Option B: Docker Redis (OVH VPS Deployment)**
```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
```
- Cost: Free (uses VPS RAM, ~20MB usage)
- Latency: <5ms (local)

**Bull Queue Configuration:**
```typescript
// src/lib/redis/queues/tier2-queue.ts
import Queue from 'bull';

export const tier2Queue = new Queue('tier2-enrichment', {
  redis: process.env.REDIS_URL,
  defaultJobOptions: {
    attempts: 3,                          // 3 retry attempts
    backoff: {
      type: 'exponential',
      delay: 2000                         // 2s, 4s, 8s
    },
    removeOnComplete: true,                // Keep only last 100 completed jobs
    removeOnFail: false                    // Keep failed jobs for debugging
  }
});

// Job processor
tier2Queue.process(async (job) => {
  const { noteId } = job.data;

  try {
    const enrichment = await enrichWithClaude(noteId);
    await prisma.noteMetadata.update({
      where: { noteId },
      data: {
        tier2Type: enrichment.type,
        tier2Tags: enrichment.tags,
        tier2Summary: enrichment.summary,
        tier2Connections: enrichment.connections,
        tier2ProcessedAt: new Date()
      }
    });
    return { success: true, noteId };
  } catch (error) {
    logger.error({ jobId: job.id, noteId, error }, 'Tier-2 enrichment failed');
    throw error; // Bull will retry
  }
});

// Queue job from API route
export async function queueTier2Enrichment(noteId: string, userId: string) {
  await tier2Queue.add('note.enrich', { noteId, userId }, {
    priority: 1,
    jobId: `tier2-${noteId}` // Prevent duplicate jobs
  });
}
```

**Digest Queue (Scheduled Jobs):**
```typescript
// src/lib/redis/queues/digest-queue.ts
import Queue from 'bull';

export const digestQueue = new Queue('digest-generation', {
  redis: process.env.REDIS_URL
});

// Schedule weekly digest (Friday 2am UTC)
digestQueue.add('digest.generate', { userId: 'user1', period: 'weekly' }, {
  repeat: {
    cron: '0 2 * * FRI',  // Every Friday at 2am UTC
    tz: 'UTC'
  },
  attempts: 3,
  timeout: 30 * 60 * 1000  // 30 min timeout (NFR: <30 min digest generation)
});

// Job processor
digestQueue.process(async (job) => {
  const { userId, period } = job.data;

  const digest = await generateDigest(userId, period);
  await prisma.digest.create({
    data: {
      userId,
      period,
      content: digest.content,
      generatedAt: new Date()
    }
  });

  return { success: true, digestId: digest.id };
});
```

## Consequences

### Positive
- **Non-Blocking**: Note capture returns immediately, Tier-2 processing happens in background
- **Reliable**: Job persistence survives server restarts (Redis AOF/RDB persistence)
- **Retry Logic**: Automatic exponential backoff (2s, 4s, 8s) for transient failures
- **Scheduled Jobs**: Built-in cron support for weekly digest generation
- **Monitoring**: Bull Board dashboard for job status visibility
- **Cost-Effective**: Free tier (Upstash or self-hosted) sufficient for MVP
- **Deployment Flexibility**: Works on both Vercel (Upstash) and OVH VPS (Docker)
- **Graceful Degradation**: Tier-2 failures don't block note creation (job queued even if processing fails later)

### Negative
- **Redis Dependency**: Additional service to manage (mitigated: Upstash managed or simple Docker container)
- **Memory Usage**: Redis requires ~20MB RAM minimum (acceptable for VPS, free on Upstash)
- **Job Latency**: Upstash Redis adds ~20-50ms latency vs local Redis (acceptable for async jobs)
- **Upstash Free Tier Limit**: 10,000 commands/day (sufficient for MVP: ~200 notes/day * 2 commands = 400/day)

### Trade-offs Accepted
- **Not Using Redis for Sessions**: Supabase Auth handles sessions via JWT tokens, so Redis is ONLY for Bull Queue
- **Job Retention**: Completed jobs removed after success (space optimization), failed jobs kept for debugging

## Alternatives Considered

### Alternative 1: Database-Backed Queue (BullMQ with Prisma)
- **Pros**:
  - No additional service (uses existing PostgreSQL)
  - Single data store (simpler architecture)
- **Cons**:
  - PostgreSQL not optimized for high-frequency job polling
  - Increased database load (queries every second for pending jobs)
  - Connection exhaustion risk (job workers + app sharing connection pool)
  - Slower than Redis (disk I/O vs in-memory)
- **Rejected Because**: PostgreSQL should be optimized for data queries, not job queue polling

### Alternative 2: AWS SQS / Google Cloud Tasks
- **Pros**:
  - Managed queue service, infinite scalability
  - Pay-per-use pricing
- **Cons**:
  - Requires AWS/GCP account (adds complexity)
  - Not free tier (charges per request)
  - Latency ~50-200ms (cross-region)
  - Overkill for solo developer MVP
- **Rejected Because**: Redis + Bull simpler for MVP, no vendor lock-in

### Alternative 3: Vercel Cron Jobs (Scheduled Functions)
- **Pros**:
  - Native Vercel integration, zero config
  - Free tier included
- **Cons**:
  - Only scheduled jobs (no dynamic queue for Tier-2)
  - No retry logic (must implement manually)
  - No job persistence (serverless cold start issues)
  - Cannot handle Tier-2 enrichment queue (only scheduled digest)
- **Rejected Because**: Need both scheduled jobs (digest) AND dynamic queue (Tier-2)

### Alternative 4: Next.js API Routes with setTimeout
- **Pros**:
  - Zero dependencies, built-in
- **Cons**:
  - No persistence (jobs lost on server restart)
  - No retry logic (must implement manually)
  - No scheduling (must run external cron)
  - Memory leaks risk with long-running timers
- **Rejected Because**: Not production-ready (no persistence, no retries)

### Alternative 5: BullMQ (Bull v4 rewrite)
- **Pros**:
  - Modern rewrite of Bull with TypeScript-first
  - Better performance (~2x faster)
  - Worker threads support
- **Cons**:
  - Less mature than Bull (fewer tutorials, community support)
  - Breaking API changes from Bull v3
  - More complex setup
- **Rejected Because**: Bull v3 sufficient for MVP, can migrate to BullMQ in Phase 2 if needed

## Related Decisions
- ADR-002: Database & Auth Strategy (Supabase - NOT using Redis for sessions)
- ADR-005: State Management (Zustand - client state only, no need for Redis sessions)
- Epic 3 (Tier-2 Enrichment): Async Claude API calls via tier2-queue
- Epic 5 (Digest Generation): Scheduled jobs via digest-queue

## Implementation Notes

**Epic 0 Story 0.2: Setup Redis + Bull Queue**

1. Choose Redis hosting:
   - **Vercel**: Create Upstash Redis database, copy `REDIS_URL`
   - **OVH VPS**: Add Redis to `docker-compose.yml`

2. Install Bull:
```bash
npm install bull
npm install -D @types/bull
```

3. Create queue configurations:
```bash
mkdir -p src/lib/redis/queues
mkdir -p src/lib/redis/jobs
```

4. Environment variables:
```bash
# .env.local
REDIS_URL="redis://localhost:6379"           # Docker
# OR
REDIS_URL="rediss://[UPSTASH_URL]:6379"      # Upstash
```

**Success Criteria:**
- ✅ Redis connection successful (test with `redis-cli ping` or Upstash dashboard)
- ✅ `tier2Queue.add()` enqueues job without error
- ✅ Job processor executes and updates `NoteMetadata`
- ✅ Failed jobs retry with exponential backoff (test by throwing error in processor)
- ✅ Scheduled digest job runs on cron schedule

**Monitoring Setup (Bull Board):**
```typescript
// Optional: Add Bull Board for job monitoring (development/staging only)
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullAdapter(tier2Queue),
    new BullAdapter(digestQueue)
  ],
  serverAdapter
});

// Access dashboard at: http://localhost:3000/admin/queues
```

**Testing Pattern:**
```typescript
// src/lib/redis/jobs/enrich-note.test.ts
import { tier2Queue } from '../queues/tier2-queue';
import { prismaMock } from '@/__tests__/__mocks__/prisma';

describe('Tier-2 Enrichment Job', () => {
  it('processes job and updates metadata', async () => {
    const mockNote = { id: 'note1', content: 'Test note' };
    prismaMock.note.findUnique.mockResolvedValue(mockNote);
    prismaMock.noteMetadata.update.mockResolvedValue({});

    await tier2Queue.add('note.enrich', { noteId: 'note1' });

    // Wait for job to process
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(prismaMock.noteMetadata.update).toHaveBeenCalledWith({
      where: { noteId: 'note1' },
      data: expect.objectContaining({
        tier2Type: expect.any(String),
        tier2ProcessedAt: expect.any(Date)
      })
    });
  });

  it('retries on failure with exponential backoff', async () => {
    prismaMock.note.findUnique.mockRejectedValueOnce(new Error('DB error'));

    const job = await tier2Queue.add('note.enrich', { noteId: 'note1' });

    // Job should retry 3 times with exponential backoff
    await job.finished();

    expect(job.attemptsMade).toBe(3);
  });
});
```

**Production Deployment:**

**Vercel:**
1. Add `REDIS_URL` environment variable in Vercel dashboard (Upstash URL)
2. Deploy: `vercel --prod`
3. Queue workers run as serverless functions on demand

**OVH VPS (Docker):**
1. Ensure Redis in `docker-compose.yml` with AOF persistence:
```yaml
redis:
  command: redis-server --appendonly yes
  volumes:
    - redis-data:/data
```
2. Start services: `docker-compose up -d`
3. Workers run in same Node.js process as Next.js app

**Cost Monitoring:**
- Upstash free tier: 10,000 commands/day
- Monitor usage in Upstash dashboard
- Alert when >80% of free tier used
- Upgrade to Upstash Pro ($10/mo, 100K commands/day) if needed

**Migration Path (Upstash → Docker):**
If Upstash free tier exceeded:
1. Update `REDIS_URL` to local Docker Redis
2. Add Redis to `docker-compose.yml`
3. Deploy: `docker-compose up -d`
4. **Effort**: <1 day (just configuration change)
