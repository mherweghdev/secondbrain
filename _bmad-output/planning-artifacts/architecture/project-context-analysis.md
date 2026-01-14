# Project Context Analysis

## Requirements Overview

**Functional Requirements (41 total):**

secondbrain is a personal knowledge management tool following a three-phase workflow:

1. **Note Capture & Storage (5 FRs)**
   - Web-based markdown editor with syntax highlighting
   - Auto-save on keystroke (zero friction)
   - Note list/history with filtering (raw/refined/archived)
   - Note editing capability (during capture and refinement)
   - Archive functionality (soft delete only, no permanent deletion)

2. **Tier-1 Analysis - Local Heuristics (4 FRs)**
   - Automatic keyword extraction (hashtags, @mentions, entities)
   - Note type classification (Accomplishment, Idea, Problem, Meeting, Task)
   - Basic connection detection (entity matching across notes)
   - Latency requirement: <100ms per note (local processing)

3. **Tier-2 Enrichment - Claude API Integration (4 FRs)**
   - Async batch suggestion queue (Bull + Redis)
   - Claude API suggestions (refined type, rich metadata, semantic connections)
   - Cost tracking (<$5/month budget)
   - Error handling & graceful degradation (3 retries, fallback to Tier-1)

4. **Refinement Workflow - Friday Review (6 FRs)**
   - Refinement mode (one note at a time, sequential review)
   - Suggestion review & validation (accept/reject/modify)
   - Note editing during refinement (last chance to fix typos)
   - Metadata confirmation (type, tags, connections, severity)
   - Progress tracking (e.g., "2 of 8 notes refined")
   - Session timing (<30 min target for typical week)

5. **Digest Generation & Synthesis (4 FRs)**
   - Automatic weekly digest generation (Friday evening)
   - Digest structure: Accomplishments + Challenges + Action Items + Insights
   - Digest storage & history (markdown in-app, exportable)
   - Professional quality (shareable with leadership without edits)

6. **Search & Retrieval (5 FRs)**
   - Keyword search (content + metadata)
   - Tag-based search (#auth, @ClientX, etc.)
   - Connection-aware results (direct matches + related notes)
   - Search styles: keyword, tag (Phase 1); conversational/semantic (Phase 2)
   - Search UI: simple textbox, sortable results, click to open note

7. **Data Integrity & Reliability (5 FRs)**
   - Automatic daily backups (secure, encrypted, verified)
   - Audit trail (every action logged, immutable)
   - Transaction safety (atomic operations, rollback on error)
   - Data recovery (4-hour RTO)
   - Encryption at rest (AES-256)

8. **User Authentication & System Access (3 FRs)**
   - Simple authentication (MVP single user)
   - Session management (2-hour inactivity timeout)
   - API security (rate limiting, input validation, CORS)

9. **Integration Points (3 FRs)**
   - Claude API integration (Tier-2 enrichment)
   - Database integration (PostgreSQL, relational integrity, FTS indexing)
   - Email integration (Phase 2: digest sending via SMTP)

10. **Reporting & Analytics (2 FRs)**
    - Digest history & archiving (searchable, filterable by date)
    - Personal usage dashboard (Phase 2: notes captured, API costs, etc.)

**Non-Functional Requirements (22 total):**

**Performance (5 NFRs):**
- ⚠️ **CRITICAL**: Search query response time <5 seconds (95th percentile)
- Note capture latency <1 second (95th percentile)
- Refinement UI responsiveness <2 seconds (first paint <500ms)
- Digest generation <30 minutes (99% complete before Monday 6:30am)
- API response time <500ms (99th percentile, general endpoints)

**Reliability & Availability (5 NFRs):**
- ⚠️ **CRITICAL ZERO TOLERANCE**: No data loss under any circumstances
- Daily automated backups (2am UTC, 100% completion rate)
- Data recovery: RTO 24 hours, RPO 24 hours
- Database transaction integrity (zero orphaned/inconsistent states)
- Graceful degradation (Claude API failures → continue with Tier-1 only)

**Security (5 NFRs):**
- Encryption in transit (HTTPS, HSTS, Let's Encrypt)
- Encryption at rest (sensitive data, backups AES-256)
- Authentication & session management (30-day expiry, bcrypt passwords)
- Secure backup storage (encrypted, keys stored separately)
- Log security (no sensitive data logged)

**Integration (3 NFRs):**
- Email digest delivery reliability 99% (retry mechanism, 3 attempts)
- Email digest timing configurable (default 7am user timezone)
- Email format validation (non-empty content, valid HTML, recipient validation)

**Scalability - Phase 2 Readiness (4 NFRs):**
- Concurrent user support (10+ users, <10% performance degradation)
- Async queue capacity (100+ jobs/hour, <2 sec average latency)
- Database connection pooling (10-20 idle, max 50 concurrent)
- Horizontal scaling ready (stateless servers, Redis sessions, shared DB)

**UX Requirements (from UX Specification):**

**Keyboard-First Experience:**
- All workflows 100% navigable via keyboard
- Shortcuts for all critical actions (Ctrl+N, Ctrl+R, Ctrl+/, ↑/↓, Enter, Esc)
- Cheatsheet accessible (? or Ctrl+?)
- Mouse optional (power user experience)

**Markdown-Native:**
- Pure markdown editor with syntax highlighting
- Preview side-by-side (optional toggle)
- Formatting shortcuts (Ctrl+B bold, Ctrl+I italic, Ctrl+K link)
- Import/export markdown files

**Multi-Device Responsive:**
- Desktop: Capture + Raffinage + Digest editing (keyboard-driven)
- Mobile/Tablette: Digest consultation + Search (touch-optimized)
- Responsive layout adapté aux contextes d'usage

**Connection Visualization:**
- Phase 1: Clickable connection list ("This note mentions ClientX - see 3 related notes")
- Phase 2: Interactive knowledge graph (nodes = notes, edges = connections)

**Emotional Design:**
- Sérénité productive (calm focus, no distractions)
- Trust through transparency (auto-save indicator, suggestions visible)
- Efficiency as satisfaction (speed = feature, <5 sec search)
- Autonomy (markdown native, full control on suggestions)

## Scale & Complexity

**Project Complexity:** MEDIUM

- **Primary domain:** Full-stack web application (Next.js + PostgreSQL + Redis + Claude API)
- **Complexity level:** Medium (MVP = single user, but architected for Phase 2 multi-user SaaS)
- **Estimated architectural components:** 8-10 major components

**Major Components:**
1. Frontend Next.js (capture, raffinage, digest, search UI)
2. API Routes backend (CRUD notes, suggestions, digest generation)
3. PostgreSQL database (notes, metadata, full-text search)
4. Redis + Bull Queue (async processing Tier-2)
5. Tier-1 suggestion engine (local heuristics)
6. Tier-2 Claude API integration (batch enrichment)
7. Email service (digest delivery)
8. Authentication layer (simple MVP, extensible Phase 2)

## Technical Constraints & Dependencies

**Known Constraints:**

**Infrastructure:**
- Hosting: OVH VPS (no managed cloud services initially)
- Online-only (no offline mode required)
- Budget: <$5/month for Claude API (token tracking mandatory)

**Technology Stack (PRD-specified):**
- Frontend/Full-Stack: Next.js (TypeScript)
- Database: PostgreSQL (FTS for search)
- Cache/Queue: Redis (Bull Queue for async jobs)
- AI Integration: Claude API (Tier-2 suggestions)
- Deployment: Docker on OVH VPS
- CI/CD: GitHub Actions

**Development Context:**
- Solo developer (Matthieu)
- 16-week timeline (Weeks 1-2: learning, Weeks 3-12: MVP core, Weeks 13-16: polish/deploy)
- TDD culture (Jest + React Testing Library, >80% coverage target)

**Performance Budgets (CRITICAL):**
- Search latency: <5 seconds (95th percentile) ⚠️
- Capture latency: <1 second (95th percentile)
- API costs: <$5/month (token tracking required)

**Scalability Target:**
- MVP: Single user
- Phase 2: Multi-user SaaS (10+ concurrent users without refactoring)
- Architecture must support horizontal scaling (stateless design, Redis sessions)

## Cross-Cutting Concerns Identified

**Data Integrity (Zero Tolerance Policy):**
- Every state change must use PostgreSQL ACID transactions
- Audit trail for all user actions (immutable log)
- Daily automated backups (encrypted, verified)
- Point-in-time recovery capability
- No permanent deletion (archive only)
- Disaster recovery: RTO 24 hours

**Performance Optimization:**
- PostgreSQL full-text search (FTS) with indexing
- Connection pooling (prevent connection exhaustion)
- Async processing for expensive operations (Tier-2 API calls, digest generation)
- Debounced auto-save (500ms) to reduce DB writes
- Token counting for cost containment

**Security Hardening:**
- HTTPS enforced (Let's Encrypt certificate)
- Encryption at rest (database + backups, AES-256)
- Input validation on all API endpoints (prevent injection)
- Rate limiting (100 requests/minute per user)
- Session management (30-day expiry, secure tokens)
- No sensitive data in logs (automated scrubbing)

**API Cost Containment:**
- Tier-1 pre-enrichment reduces Claude API tokens
- Batch processing (queue all notes, process overnight)
- Token tracking with monthly budget alerts
- Fallback to Tier-1 if API unavailable (graceful degradation)
- Future: Local LLM migration (Phase 2, when GPU available)

**Future Scalability (Phase 2 Readiness):**
- Stateless API design (no in-memory sessions)
- Redis for session storage (shared across instances)
- Database connection pooling (ready for multiple app servers)
- Horizontal scaling architecture (load balancer ready)
- Multi-tenancy design patterns (isolate user data)

**UX Consistency:**
- Keyboard shortcuts globally defined (event handling layer)
- Markdown rendering standardized (CommonMark spec)
- Responsive breakpoints consistent (desktop/tablet/mobile)
- Auto-save behavior unified (debounce 500ms, indicator visible)
- Error handling UX (graceful failures, user notifications)

**Testing & Quality:**
- TDD from day 1 (write tests before features)
- >80% code coverage target
- Integration tests for API endpoints
- Component tests (React Testing Library)
- Performance testing (load test search with realistic note volume)
