# ADR-009: Deployment Strategy (Vercel + OVH VPS fallback)

## Status

Accepted

## Context

- MVP budget constraint: <$5/month API + hosting
- Vercel free tier: Sufficient for individual project
- Phase 2 scalability: May exceed free tier limits
- DevOps simplicity: Solo developer preference

## Decision

Use **Vercel free tier (primary) + OVH VPS Docker (fallback)**

- **Production**: Vercel (Git-based deployment, serverless)
- **Fallback**: OVH VPS with Docker Compose (self-hosted option)
- **Database**: Supabase (external, works with both)
- **Redis**: Upstash (serverless on Vercel), Docker Redis (OVH VPS)

## Rationale

- **Zero cost MVP**: Vercel free tier sufficient for single-user project
- **Automatic deployment**: Git push → live (GitHub integration)
- **Serverless**: No server management required
- **Fallback option**: If Vercel free tier exceeded, OVH VPS ready
- **Easy monitoring**: Vercel analytics + error tracking

## Consequences

### Positive

- ✅ $0 monthly cost (MVP phase)
- ✅ Automatic deployments (Git integration)
- ✅ Serverless (no infrastructure management)
- ✅ Fast CDN globally
- ✅ Environment variables built-in

### Negative

- ❌ Cold start latency on serverless (acceptable for MVP)
- ❌ Vendor lock-in to Vercel (easy exit: Docker migration)
- ❌ Concurrent execution limits on free tier

## Alternatives Considered

### Alternative A: Heroku

- ✅ **Advantages**: Simple deployment, free tier
- ❌ **Disadvantages**: Free tier discontinued, paid starts at $7/month
- **Rejected**: Cost exceeds budget

### Alternative B: Railway

- ✅ **Advantages**: Generous free tier, modern platform
- ❌ **Disadvantages**: Less mature than Vercel, smaller community
- **Deferred Phase 2**: Good alternative if Vercel insufficient

### Alternative C: AWS (EC2 + RDS)

- ✅ **Advantages**: Full control, scalable
- ❌ **Disadvantages**: Complex setup, cost creep risk
- **Rejected**: Overkill for MVP, DevOps overhead

## Implementation Notes

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Environment variables
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### OVH VPS Docker Fallback

```bash
# On OVH VPS
git clone https://github.com/mherweghdev/secondbrain.git
cd secondbrain

# Build Docker image
docker build -t secondbrain .

# Run with Docker Compose
docker-compose up -d
```

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

## Migration Path

**From Vercel to OVH VPS**: 1-2 days (Docker image ready, swap DNS)

**From OVH VPS to AWS**: 2-3 days (infrastructure setup, database migration)

## See Also

- [ADR-002: Database Strategy](./adr-002-database-supabase-postgresql.md) - External database
- [ADR-005: Async Processing](./adr-005-async-processing-redis-bull.md) - Upstash Redis
- [Vercel Documentation](https://vercel.com/docs)
- [OVH VPS](https://www.ovh.com/world/vps/)
