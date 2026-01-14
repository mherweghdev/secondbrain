# Non-Functional Requirements

**Overview:** NFRs define quality attributes and measurable performance targets. For secondbrain: Performance (search <5sec, capture <1sec), Reliability (zero data loss, daily backups), Security (encryption, auth), Integration (email delivery 99%), and Scalability (Phase 2 multi-user ready). All metrics are testable and tied to user success.

---

## Performance

**NFR-P1: Search Query Response Time**
- Requirement: All search queries must return results within 5 seconds
- Applies to: Full-text search, keyword search, connection-aware queries
- Success Metric: 95% of queries complete within 5 seconds; p99 < 8 seconds
- Rationale: You need search to feel responsive during knowledge discovery workflows

**NFR-P2: Note Capture Latency**
- Requirement: Note submission and initial storage must complete within 1 second
- Applies to: POST /api/notes endpoint, Markdown parsing, database write
- Success Metric: 95th percentile latency < 1 second
- Rationale: Quick capture without friction is core to your workflow

**NFR-P3: Refinement UI Responsiveness**
- Requirement: Loading refinement page and suggestion display must complete within 2 seconds
- Applies to: Fetching week's notes + Tier-1 suggestions + Tier-2 enrichment (if available)
- Success Metric: First paint < 500ms; full page interactive < 2 seconds
- Rationale: Friday afternoon refinement workflow can't feel sluggish

**NFR-P4: Digest Generation Performance**
- Requirement: Email digest generation must complete within 30 minutes
- Applies to: Fetching notes, Eisenhower matrix calculation, email rendering, queue processing
- Success Metric: 99% of weekly digests complete before 6:30am Monday (with 7am send default)
- Rationale: Asynchronous, so doesn't block users, but must reliably complete before send window

**NFR-P5: API Response Time (General)**
- Requirement: All backend API endpoints must respond within 500ms under normal load
- Applies to: All /api/* routes (except search, which has own requirement)
- Success Metric: 99th percentile < 500ms
- Rationale: Ensures snappy UI interactions across the application

---

## Reliability & Availability

**NFR-R1: Data Integrity - Zero Tolerance Policy**
- Requirement: Zero acceptable data loss under any circumstances (per technical success criteria)
- Applies to: Notes, suggestions, archive states, user preferences
- Implementation: PostgreSQL ACID transactions for all state changes
- Success Metric: No data loss incidents in production
- Contingency: Hourly transaction logs, point-in-time recovery capability

**NFR-R2: Daily Automated Backups**
- Requirement: PostgreSQL database backed up daily to encrypted storage
- Applies to: Full database snapshots at 2am UTC (off-peak)
- Success Metric: Daily backup completion rate = 100%; backup verification passes
- Constraint: No dedicated backup server initially (backups stored on same VPS with encryption)
- Contingency: Phase 2 can expand to geographically distributed backup

**NFR-R3: Data Recovery RTO & RPO**
- Requirement: Recovery Time Objective (RTO) = 24 hours max; Recovery Point Objective (RPO) = 24 hours max
- Applies to: Complete server failure, database corruption scenarios
- Success Metric: Full restore from daily backup completed within 24 hours
- Rationale: A single day of data loss is unacceptable; 24-hour window gives time for recovery

**NFR-R4: Database Transaction Integrity**
- Requirement: All multi-step operations use database transactions to prevent partial state
- Applies to: Note creation, suggestion processing, archive operations, digest generation
- Success Metric: Zero incidents of orphaned or inconsistent data states
- Implementation: PostgreSQL transactions with rollback on error

**NFR-R5: Graceful Degradation (Claude API Failures)**
- Requirement: If Claude API is unavailable, system continues operating with Tier-1 suggestions only
- Applies to: Tier-2 enrichment, connection suggestions, digest enrichment
- Success Metric: System detects API timeout after 5 seconds, continues without blocking user
- Rationale: You have <$5/month budget; if Claude API unreachable, don't block core workflows

---

## Security

**NFR-S1: Encryption in Transit**
- Requirement: All data transmitted between client and server must use HTTPS
- Applies to: All API calls, static asset delivery, WebSocket connections (if added)
- Success Metric: No HTTP endpoints; HSTS header enforced; certificate valid and renewed automatically
- Implementation: Let's Encrypt certificate on OVH server

**NFR-S2: Encryption at Rest**
- Requirement: Sensitive user data encrypted at rest in PostgreSQL
- Applies to: Note content, personal preferences, backup files
- Success Metric: Database encryption enabled; backup files encrypted before storage
- Options: PostgreSQL native encryption OR application-level encryption (to decide in implementation)
- Rationale: Your notes contain personal knowledge; protect against unauthorized access if server compromised

**NFR-S3: Authentication & Session Management**
- Requirement: MVP uses simple session-based authentication (single user context); extensible for Phase 2 SaaS
- Applies to: User login/logout, session tokens, password storage
- Success Metric: Sessions expire after 30 days of inactivity; passwords hashed with bcrypt or similar
- Constraint: MVP = single user; Phase 2 must support multi-user with role-based access
- Rationale: Keep MVP simple while architecting for future SaaS expansion

**NFR-S4: Secure Backup Storage**
- Requirement: Daily backups encrypted at rest, stored securely
- Applies to: Backup files on VPS storage (initially same server; Phase 2 = off-site)
- Success Metric: Backups encrypted with AES-256; encryption keys stored separately
- Rationale: Even if server is breached, backups remain secure

**NFR-S5: Log Security**
- Requirement: No sensitive data (passwords, note content, personal info) logged
- Applies to: Application logs, API logs, audit trails
- Success Metric: Log review shows zero sensitive data; automated log scrubbing if violations detected
- Rationale: Logs are often the weakest security link

---

## Integration

**NFR-I1: Email Digest Delivery Reliability**
- Requirement: Email digest delivery must succeed 99% of the time
- Applies to: Weekly Monday digest email delivery via SMTP
- Success Metric: 99% of sent digests arrive in recipient inbox within 1 hour
- Implementation: Retry mechanism (up to 3 retries with exponential backoff over 2 hours)
- Contingency: If all retries fail, notify user in-app that digest failed to send

**NFR-I2: Email Digest Timing Configuration**
- Requirement: Email digest send time must be configurable, default = 7am (user timezone)
- Applies to: Scheduled job for Monday morning digest
- Success Metric: Digest sends within 1 minute of configured time
- Implementation: Bull Queue scheduled job with cron expression
- Rationale: Different users (Phase 2) may have different timezone/preference needs

**NFR-I3: Email Format Validation**
- Requirement: Digest email content validated before sending
- Applies to: Markdown-to-HTML rendering, template validation, recipient email validation
- Success Metric: Zero emails sent with malformed HTML or empty content
- Validation: Check content non-empty, HTML valid, recipient email valid before queue job runs

---

## Scalability (Phase 2 Readiness)

**NFR-Sc1: Concurrent User Support**
- Requirement: System architected to support 10+ concurrent users without performance degradation >10%
- Applies to: Database connection pooling, API rate limiting, queue capacity
- Success Metric: No performance degradation at 10 concurrent users vs. 1 user
- MVP Constraint: Single user, but database pooling implemented to enable Phase 2
- Rationale: Design for Phase 2 SaaS expansion without rearchitecting

**NFR-Sc2: Async Queue Capacity**
- Requirement: Bull Queue must handle 100+ jobs per hour without backing up
- Applies to: Tier-2 suggestion processing, digest generation, email sending
- Success Metric: Queue processes 100 jobs/hour with <2 second average latency
- Implementation: Redis queue with adequate memory; monitor queue depth
- Rationale: When you onboard users, suggestions and digests must not create bottleneck

**NFR-Sc3: Database Connection Pooling**
- Requirement: Connection pooling enabled to support concurrent requests efficiently
- Applies to: PostgreSQL connections from Node.js
- Success Metric: Connection pool maintains 10-20 idle connections; max 50 concurrent connections
- Implementation: node-postgres with built-in connection pooling
- Rationale: Prepares infrastructure for multi-user without connection exhaustion

**NFR-Sc4: Deployment Ready for Horizontal Scaling**
- Requirement: Architecture supports multi-server deployment (Phase 2) with minimal refactoring
- Applies to: Stateless API servers, shared database, Redis session store
- Success Metric: Can deploy 2+ server instances behind load balancer without code changes
- Implementation: Redis used for sessions (not in-memory); database as SSOT
- Rationale: Don't lock yourself into single-server design in MVP

---

## NFR Summary

**Total: 22 Non-Functional Requirements**

**Categories Included:**
- ✅ **Performance** (5 NFRs) - Search, capture, refinement, digest, API responses
- ✅ **Reliability** (5 NFRs) - Data integrity, backups, recovery, transactions, graceful degradation
- ✅ **Security** (5 NFRs) - HTTPS, encryption, auth, backup security, logs
- ✅ **Integration** (3 NFRs) - Email delivery, timing, validation
- ✅ **Scalability** (4 NFRs) - Phase 2 readiness for multi-user

**Why These Matter:** Performance (explicit <5s search requirement). Reliability (zero data loss non-negotiable). Security (personal knowledge base protection). Integration (email digest is key success metric). Scalability (Phase 2 SaaS readiness).

**What's Intentionally Missing:**
- ❌ **Accessibility NFRs** - Single user, personal tool (can add if sharing in Phase 2)
- ❌ **Compliance NFRs** - No regulatory requirements mentioned
