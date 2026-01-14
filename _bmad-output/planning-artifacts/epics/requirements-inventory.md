# Requirements Inventory

## Functional Requirements

**FR-1: Note Capture & Storage (5 requirements)**

- **FR-1.1**: Web-Based Note Creation - User can create notes through web interface with markdown editor, syntax highlighting, auto-save on keystroke, no confirmation required
- **FR-1.2**: Note Metadata at Capture - System automatically captures creation timestamp, modification timestamp, note source
- **FR-1.3**: Note List & History - View all notes in reverse chronological order, show date/first 50 chars/status, filter by status (raw/refined/archived)
- **FR-1.4**: Note Editing - Edit any note's markdown content after creation, auto-save, update timestamp, can edit during refinement
- **FR-1.5**: Note Archive - Archive notes (soft delete), archived notes remain searchable/viewable, can restore, no permanent deletion

**FR-2: Tier-1 Analysis - Local Heuristics (4 requirements)**

- **FR-2.1**: Automatic Keyword Extraction - Extract hashtags, @mentions, entities (proper nouns, company names)
- **FR-2.2**: Automatic Note Type Classification - Classify as Accomplishment/Idea/Problem/Meeting/Task based on keywords and patterns
- **FR-2.3**: Basic Connection Detection - Identify if note mentions entities from previous notes, suggest connections
- **FR-2.4**: Latency Requirement - Complete all Tier-1 analysis within 100ms per note (local processing)

**FR-3: Tier-2 Enrichment - Claude API Integration (4 requirements)**

- **FR-3.1**: Async Batch Suggestion Queue - Queue notes for Tier-2 analysis after Tier-1, process in background, suggestions ready by next morning
- **FR-3.2**: Claude API Suggestions - Send note with Tier-1 results to Claude API, get refined note type, rich metadata, semantic connections, patterns
- **FR-3.3**: Cost Tracking - Count tokens sent to Claude API, track monthly costs, view tokens used (today/week), keep cost under $5/month
- **FR-3.4**: Error Handling & Retries - Retry up to 3 times on API failure, fallback to Tier-1 suggestions only, notify user of failures

**FR-4: Refinement Workflow - Friday Review (6 requirements)**

- **FR-4.1**: Refinement Mode - Enter refinement mode, display all pending notes, show one note at a time in order, cannot skip notes
- **FR-4.2**: Suggestion Review & Validation - Display original content, suggested type/tags/connections, user can accept/reject/modify, add additional context
- **FR-4.3**: Note Editing During Refinement - Edit original note text during refinement, last chance to fix typos/clarify
- **FR-4.4**: Metadata Confirmation - Confirm or modify note type, tags, connections, severity/priority, click "Validate & Save Note"
- **FR-4.5**: Refinement Progress Tracking - Show progress (e.g., "2 of 8 notes refined"), exit and resume later, mark complete when all processed
- **FR-4.6**: Session Timing - Track refinement session time, target <30 minutes for typical week (10 notes), show time spent and estimated remaining

**FR-5: Digest Generation & Synthesis (4 requirements)**

- **FR-5.1**: Automatic Weekly Digest Generation - Generate digest Friday evening, collect all refined notes from week, organize by type and metadata
- **FR-5.2**: Digest Structure - Accomplishments section (notes typed "Accomplishment"), Challenges section (notes typed "Problem/Issue"), Action Items section (notes typed "Task/Next Steps"), optional Insights section
- **FR-5.3**: Digest Storage & History - Save with timestamp (e.g., "2026-01-13-digest"), view all previous digests, viewable as markdown in-app, exportable as markdown file
- **FR-5.4**: Professional Quality - Formatted professionally (clean markdown), shareable with leadership without edits, includes brief intro/summary, no jargon or internal notes

**FR-6: Search & Retrieval (5 requirements)**

- **FR-6.1**: Keyword Search - Search by keyword or tag, cover note content + metadata (tags, connections), display matching notes with context highlights, latency <5 seconds
- **FR-6.2**: Tag-Based Search - Search by specific tag (#auth, @ClientX), show all notes with that tag, include notes that mention tag in content
- **FR-6.3**: Connection-Aware Results - Show direct matches + related notes, mark related notes as "connected", display context for connections
- **FR-6.4**: Search Styles - Simple keyword search and tag search (Phase 1), conversational/semantic search deferred to Phase 2
- **FR-6.5**: Search UI - Simple interface (textbox + results), results sortable (date/relevance/type), click result to open note

**FR-7: Data Integrity & Reliability (5 requirements)**

- **FR-7.1**: Automatic Backups - Daily automated backup of all notes, include content + metadata + audit trail, stored securely (separate from primary), backup integrity verification
- **FR-7.2**: Audit Trail - Log every note creation, edit, refinement, search query with timestamp and user action, immutable audit trail
- **FR-7.3**: Transaction Safety - All operations (create/edit/refine) are atomic transactions, rollback on failure, ACID compliance
- **FR-7.4**: Data Recovery - Recover accidentally deleted (archived) notes, revert to previous version from audit trail, 4-hour RTO (Recovery Time Objective)
- **FR-7.5**: Encryption - Sensitive note data encrypted at rest (AES-256), backups encrypted, communication encrypted (HTTPS)

**FR-8: User Authentication & System Access (3 requirements)**

- **FR-8.1**: User Authentication - Simple authentication for personal tool (password or session), session persists, can logout
- **FR-8.2**: Session Management - Session expires after inactivity (2 hours), prompt to re-authenticate on expiry, clear user data from browser on logout
- **FR-8.3**: API Security - All endpoints require authentication, rate limiting (max 100 requests/minute per user), input validation, CORS configured

**FR-9: Integration Points (3 requirements)**

- **FR-9.1**: Claude API Integration - Authenticate with Claude API using API key, send note + Tier-1 suggestions, receive enriched suggestions, store with note, error handling included
- **FR-9.2**: Email Integration - Deferred to Phase 2 (email sending for digest, SMTP configuration)
- **FR-9.3**: Database Integration - Persist all notes to PostgreSQL, maintain relational integrity (notes → metadata, connections), perform full-text indexing for search

**FR-10: Reporting & Analytics (2 requirements)**

- **FR-10.1**: Personal Usage Dashboard - Deferred to Phase 2 (view statistics: notes captured, refinements completed, digests generated, API costs, search queries)
- **FR-10.2**: Digest History & Archiving - All digests archived for historical reference, view previous weeks' digests, searchable and filterable by date range

**Total: 41 Functional Requirements**

## Non-Functional Requirements

**NFR-P: Performance (5 requirements)**

- **NFR-P1**: Search Query Response Time - <5 seconds for all search queries (95th percentile), p99 <8 seconds, applies to full-text, keyword, connection-aware queries
- **NFR-P2**: Note Capture Latency - Note submission and storage <1 second (95th percentile), applies to POST /api/notes, markdown parsing, database write
- **NFR-P3**: Refinement UI Responsiveness - Loading refinement page and suggestions <2 seconds, first paint <500ms, full page interactive <2 seconds
- **NFR-P4**: Digest Generation Performance - Complete within 30 minutes, 99% of digests complete before 6:30am Monday (7am send default)
- **NFR-P5**: API Response Time (General) - All backend API endpoints <500ms under normal load (99th percentile), applies to all /api/* routes except search

**NFR-R: Reliability & Availability (5 requirements)**

- **NFR-R1**: Data Integrity - Zero Tolerance Policy - Zero acceptable data loss under any circumstances, applies to notes/suggestions/archive states/preferences, PostgreSQL ACID transactions, no data loss incidents in production
- **NFR-R2**: Daily Automated Backups - PostgreSQL backup daily at 2am UTC (off-peak), full database snapshots, 100% completion rate, backup verification passes, encrypted storage
- **NFR-R3**: Data Recovery RTO & RPO - RTO = 24 hours max, RPO = 24 hours max, full restore from daily backup completed within 24 hours
- **NFR-R4**: Database Transaction Integrity - All multi-step operations use database transactions, applies to note creation, suggestion processing, archive operations, digest generation, zero orphaned/inconsistent data states
- **NFR-R5**: Graceful Degradation - If Claude API unavailable, continue operating with Tier-1 suggestions only, detect API timeout after 5 seconds, don't block user, stay within <$5/month budget

**NFR-S: Security (5 requirements)**

- **NFR-S1**: Encryption in Transit - All data transmitted between client and server uses HTTPS, applies to all API calls, static assets, WebSocket connections (if added), no HTTP endpoints, HSTS header enforced, Let's Encrypt certificate valid and auto-renewed
- **NFR-S2**: Encryption at Rest - Sensitive user data encrypted at rest in PostgreSQL, applies to note content, personal preferences, backup files, database encryption enabled, backup files encrypted before storage
- **NFR-S3**: Authentication & Session Management - MVP uses simple session-based authentication (single user), extensible for Phase 2 SaaS, sessions expire after 30 days of inactivity, passwords hashed with bcrypt
- **NFR-S4**: Secure Backup Storage - Daily backups encrypted at rest, stored securely (initially same server, Phase 2 off-site), encrypted with AES-256, encryption keys stored separately
- **NFR-S5**: Log Security - No sensitive data (passwords, note content, personal info) logged, applies to application logs, API logs, audit trails, automated log scrubbing if violations detected

**NFR-I: Integration (3 requirements)**

- **NFR-I1**: Email Digest Delivery Reliability - 99% delivery success rate, applies to weekly Monday digest email via SMTP, retry mechanism (up to 3 retries with exponential backoff over 2 hours), notify user in-app if all retries fail
- **NFR-I2**: Email Digest Timing Configuration - Send time configurable, default = 7am user timezone, scheduled job for Monday morning digest, digest sends within 1 minute of configured time, Bull Queue scheduled job with cron expression
- **NFR-I3**: Email Format Validation - Digest email content validated before sending, applies to markdown-to-HTML rendering, template validation, recipient email validation, zero emails with malformed HTML or empty content

**NFR-Sc: Scalability - Phase 2 Readiness (4 requirements)**

- **NFR-Sc1**: Concurrent User Support - System architected to support 10+ concurrent users without performance degradation >10%, applies to database connection pooling, API rate limiting, queue capacity, MVP = single user but database pooling implemented
- **NFR-Sc2**: Async Queue Capacity - Bull Queue must handle 100+ jobs per hour without backing up, applies to Tier-2 suggestion processing, digest generation, email sending, process 100 jobs/hour with <2 second average latency, Redis queue with adequate memory
- **NFR-Sc3**: Database Connection Pooling - Connection pooling enabled for concurrent requests, applies to PostgreSQL connections from Node.js, maintain 10-20 idle connections, max 50 concurrent connections, node-postgres with built-in pooling
- **NFR-Sc4**: Deployment Ready for Horizontal Scaling - Architecture supports multi-server deployment (Phase 2) with minimal refactoring, applies to stateless API servers, shared database, Redis session store, can deploy 2+ server instances behind load balancer without code changes

**Total: 22 Non-Functional Requirements**

## Additional Requirements from Architecture

**Architecture-Specified Technologies:**

- **Starter Template**: create-next-app with TypeScript, Tailwind CSS, ESLint, App Router, Turbopack
- **Database & ORM**: Supabase PostgreSQL (Free Tier) + Prisma ORM 5.x
- **Authentication**: Supabase Auth (email/password)
- **Async Processing**: Redis + Bull Queue for background jobs
- **API Design**: Next.js API Routes (REST)
- **Frontend State**: React Server Components + Zustand for client state
- **Markdown Editor**: CodeMirror 6
- **Testing**: Jest + React Testing Library (>80% coverage target)
- **Deployment**: Vercel (Next.js) or OVH VPS (Docker)
- **Logging**: Pino (structured JSON)

**Infrastructure Requirements:**

- Docker configuration for local development (PostgreSQL + Redis via docker-compose.yml)
- GitHub Actions CI workflow (lint, typecheck, tests on every PR)
- Pre-commit hooks (Husky + lint-staged)
- Architecture Decision Records (ADRs) in docs/decisions/
- Test database setup (Docker Compose with postgres:alpine)
- Multi-stage Docker build for production optimization

**Epic 0 Requirements (Project Infrastructure - Week 3-4):**

1. Initialize Next.js with create-next-app
2. Setup Jest + React Testing Library + test utilities
3. Configure PostgreSQL test database (Docker Compose)
4. Setup GitHub Actions CI (lint, typecheck, tests)
5. Add pre-commit hooks (Husky + lint-staged)
6. Create initial ADR documenting starter template decision

## Additional Requirements from UX

**Keyboard-First Experience:**

- All workflows 100% navigable via keyboard
- Global shortcuts: Ctrl+N (new note), Ctrl+R (refinement), Ctrl+/ (search), Ctrl+D (digest)
- Navigation shortcuts: ↑/↓ (navigate suggestions/results), Enter (accept), Esc (reject/cancel)
- Cheatsheet accessible (? or Ctrl+?)
- Mouse optional (power user experience)

**Markdown-Native Experience:**

- Pure markdown editor with syntax highlighting
- Preview side-by-side (optional toggle)
- Formatting shortcuts (Ctrl+B bold, Ctrl+I italic, Ctrl+K link)
- Import/export markdown files (.md)
- Transparent structure (no WYSIWYG)

**Multi-Device Responsive:**

- Desktop: Capture + Raffinage + Digest editing (keyboard-driven)
- Mobile/Tablet: Digest consultation + Search (touch-optimized)
- Responsive layout adapted to usage contexts
- Online-only (no offline mode)

**Connection Visualization:**

- Phase 1: Clickable connection list ("This note mentions ClientX - see 3 related notes")
- Phase 2: Interactive knowledge graph (nodes = notes, edges = connections)

**Emotional Design Principles:**

- Sérénité productive (calm focus, no distractions)
- Trust through transparency (auto-save indicator visible, suggestions explainable)
- Efficiency as satisfaction (speed = feature, <5 sec search)
- Autonomy (markdown native, full control on suggestions, no lock-in)
- Zero-friction capture (no tags obligatoires, no validation)

**Auto-Save Behavior:**

- Debounced auto-save (500ms delay)
- Visual indicator ("Saved" / "Saving...")
- No confirmation modals
- Implicit history (revert possible if needed)

## FR Coverage Map

**FR-1.1**: Epic 1 - Web-Based Note Creation (markdown editor, auto-save)
**FR-1.2**: Epic 1 - Note Metadata at Capture (timestamps, source)
**FR-1.3**: Epic 1 - Note List & History (view all notes, filter by status)
**FR-1.4**: Epic 2 - Note Editing (edit content after creation, during refinement)
**FR-1.5**: Epic 2 - Note Archive (soft delete, restore, no permanent deletion)

**FR-2.1**: Epic 3 - Automatic Keyword Extraction (hashtags, @mentions, entities)
**FR-2.2**: Epic 3 - Automatic Note Type Classification (Accomplishment/Idea/Problem/Meeting/Task)
**FR-2.3**: Epic 3 - Basic Connection Detection (entity matching)
**FR-2.4**: Epic 3 - Latency Requirement (<100ms local processing)

**FR-3.1**: Epic 4 - Async Batch Suggestion Queue (Bull Queue, background processing)
**FR-3.2**: Epic 4 - Claude API Suggestions (refined type, semantic connections)
**FR-3.3**: Epic 4 - Cost Tracking (token counting, <$5/month budget)
**FR-3.4**: Epic 4 - Error Handling & Retries (3x retry, graceful degradation)

**FR-4.1**: Epic 5 - Refinement Mode (one note at a time, sequential review)
**FR-4.2**: Epic 5 - Suggestion Review & Validation (accept/reject/modify)
**FR-4.3**: Epic 5 - Note Editing During Refinement (last chance to fix)
**FR-4.4**: Epic 5 - Metadata Confirmation (type, tags, connections, severity)
**FR-4.5**: Epic 5 - Refinement Progress Tracking (2/8 notes refined)
**FR-4.6**: Epic 5 - Session Timing (<30 min target)

**FR-5.1**: Epic 7 - Automatic Weekly Digest Generation (Friday evening)
**FR-5.2**: Epic 7 - Digest Structure (Accomplishments/Challenges/Actions/Insights)
**FR-5.3**: Epic 7 - Digest Storage & History (viewable, exportable)
**FR-5.4**: Epic 7 - Professional Quality (shareable with leadership)

**FR-6.1**: Epic 6 - Keyword Search (content + metadata, <5 sec)
**FR-6.2**: Epic 6 - Tag-Based Search (#auth, @ClientX)
**FR-6.3**: Epic 6 - Connection-Aware Results (direct + related notes)
**FR-6.4**: Epic 6 - Search Styles (keyword, tag; conversational Phase 2)
**FR-6.5**: Epic 6 - Search UI (textbox, sortable results)

**FR-7.1**: Epic 9 - Automatic Backups (daily, encrypted, verified)
**FR-7.2**: Epic 9 - Audit Trail (immutable log, all actions tracked)
**FR-7.3**: Epic 9 - Transaction Safety (atomic operations, ACID)
**FR-7.4**: Epic 9 - Data Recovery (restore, revert, 4-hour RTO)
**FR-7.5**: Epic 9 - Encryption (at rest AES-256, in transit HTTPS)

**FR-8.1**: Epic 1 - User Authentication (simple auth, session-based)
**FR-8.2**: Epic 1 - Session Management (2-hour timeout, re-auth)
**FR-8.3**: Epic 1 - API Security (rate limiting, input validation, CORS)

**FR-9.1**: Epic 4 - Claude API Integration (auth, send/receive suggestions)
**FR-9.2**: Epic 8 - Email Integration (Phase 2: SMTP, digest sending)
**FR-9.3**: Epic 1 - Database Integration (PostgreSQL, Prisma, FTS indexing)

**FR-10.1**: Phase 2 - Personal Usage Dashboard (deferred)
**FR-10.2**: Epic 7 - Digest History & Archiving (view previous digests)

**UX Requirements**: Epic 10 - Keyboard-First Experience (shortcuts, responsive, markdown-native)

**Architecture Requirements**: Epic 0 - Project Infrastructure (Next.js, testing, CI/CD, Docker)
