# Docker Setup Guide

This document explains how to set up and use Docker for local development and testing.

## Prerequisites

- **Docker Desktop** v20+ must be installed on your machine
  - [Download Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
  - [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
  - [Install Docker Engine for Linux](https://docs.docker.com/engine/install/)

Verify Docker installation:
```bash
docker --version
# Should output: Docker version 20.x.x or higher
```

## Services

The `docker-compose.yml` file defines two services for local development:

### PostgreSQL 15 (Test Database)
- **Image**: `postgres:15-alpine`
- **Port**: 5432
- **Database**: `secondbrain_test`
- **User**: `testuser`
- **Password**: `testpass`
- **Memory Limit**: 512MB

### Redis 7 (Bull Queue)
- **Image**: `redis:7-alpine`
- **Port**: 6379
- **Memory Limit**: 256MB

## Quick Start

### Start Services
```bash
npm run docker:up
```

This command:
1. Starts PostgreSQL and Redis containers in detached mode
2. Waits 5 seconds for services to initialize
3. Runs connection test to verify database is ready

### Stop Services
```bash
npm run docker:down
```

### Restart Services
```bash
npm run docker:restart
```

### Clean Everything (Including Data)
```bash
npm run docker:clean
```
⚠️ **Warning**: This removes all volumes and data. Use only when you want a fresh start.

## Verify Connection

Test database connectivity:
```bash
npm run test:db:check
```

Expected output:
```
Testing database connection...
DATABASE_URL: postgresql://testuser:****@localhost:5432/secondbrain_test
✅ Database connection successful!
PostgreSQL version: PostgreSQL 15.x on ...
```

## Running Integration Tests

Run integration tests against the test database:
```bash
npm run test:integration
```

Note: Integration tests will be skipped if Docker services are not running.

## Common Docker Commands

### Check Service Status
```bash
docker compose ps
```

Healthy services should show:
```
NAME                   STATUS         PORTS
secondbrain-postgres   Up (healthy)   0.0.0.0:5432->5432/tcp
secondbrain-redis      Up (healthy)   0.0.0.0:6379->6379/tcp
```

### View Service Logs
```bash
# All services
docker compose logs

# PostgreSQL only
docker compose logs postgres

# Redis only
docker compose logs redis

# Follow logs (live updates)
docker compose logs -f
```

### Execute SQL in PostgreSQL
```bash
docker compose exec postgres psql -U testuser -d secondbrain_test
```

### Connect to Redis CLI
```bash
docker compose exec redis redis-cli
```

## Troubleshooting

### Issue: Port 5432 Already in Use

**Cause**: Local PostgreSQL instance is running

**Solution**:
```bash
# Check what's using port 5432
lsof -i :5432

# Stop local PostgreSQL (macOS)
brew services stop postgresql

# Stop local PostgreSQL (Linux)
sudo systemctl stop postgresql
```

**Alternative**: Change docker-compose.yml port to `5433:5432`, but update .env.test accordingly.

### Issue: Docker Not Found

**Cause**: Docker is not installed or not in PATH

**Solution**:
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop
2. Restart your terminal after installation

### Issue: Permission Denied (Linux)

**Cause**: User not in docker group

**Solution**:
```bash
sudo usermod -aG docker $USER
# Log out and log back in for changes to take effect
```

### Issue: Services Not Healthy

**Cause**: Services failed healthcheck

**Solution**:
```bash
# Check service logs for errors
docker compose logs

# Restart services
npm run docker:restart

# If persists, clean and restart
npm run docker:clean
npm run docker:up
```

### Issue: Database Connection Failed

**Cause**: Services not ready or wrong credentials

**Solution**:
1. Verify services are healthy: `docker compose ps`
2. Check .env.test file exists and has correct DATABASE_URL
3. Wait longer for services to initialize
4. Check logs: `docker compose logs postgres`

## Data Persistence

Docker volumes are used for data persistence:

- `postgres-data`: PostgreSQL database files
- `redis-data`: Redis persistence files

Data persists between container restarts unless you run `docker:clean`.

## Performance Notes

- PostgreSQL limited to 512MB RAM
- Redis limited to 256MB RAM
- Total Docker overhead: ~1GB RAM
- Database container startup: <30s
- Connection establishment: <2s
- Simple queries: <100ms

## CI/CD Integration

GitHub Actions automatically provisions PostgreSQL and Redis services for integration tests. See `.github/workflows/ci.yml` for configuration.

## Security Notes

⚠️ **NEVER commit the following files**:
- `.env.test` (contains test database credentials)
- `.env.local` (contains development secrets)

✅ **These files are already in .gitignore**

Test credentials (testuser/testpass) are acceptable for local Docker only. Production uses Supabase with proper authentication.

## Next Steps

- **Story 1.2**: Prisma ORM setup with schema and migrations
- **Story 4.1**: Redis + Bull Queue for async processing
- **Story 0.4**: CI/CD pipeline with GitHub Actions

## References

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
