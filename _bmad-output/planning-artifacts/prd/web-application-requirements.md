# Web Application Requirements

Technology stack selected for learning value, maintainability, and scalability from MVP to potential SaaS Phase 2.

## Technology Stack

**Frontend & Full-Stack:**
- **Language:** TypeScript (superset of JavaScript)
- **Framework:** Next.js (React-based, full-stack with API routes)
- **Testing:** Jest + React Testing Library
- **Code Quality:** ESLint, Prettier, TypeScript strict mode

**Backend:**
- **API:** Next.js API Routes (no separate backend needed)
- **Async Processing:** Bull Queue + Redis (for Claude API calls, digest generation)
- **Language:** TypeScript/JavaScript throughout

**Database:**
- **Primary:** PostgreSQL (structured notes + metadata + full-text search)
- **Full-Text Search:** PostgreSQL FTS (MVP phase)
- **Future Search:** Elasticsearch (Phase 2 if semantic search needed)

**Deployment:**
- **Containerization:** Docker
- **Hosting:** OVH VPS
- **Database:** PostgreSQL (managed on OVH or self-hosted)
- **Cache/Queue:** Redis (managed on OVH or self-hosted)
- **CI/CD:** GitHub Actions

---

## Architecture Overview

**Single Full-Stack Application:**

```
Next.js Application (TypeScript)
├── Frontend (pages + components)
│   ├── /capture - Note creation interface
│   ├── /refine - Friday refinement workflow
│   ├── /digest - Weekly digest viewer
│   ├── /search - Search & retrieval interface
│   └── /chat - Conversational search with personality
│
├── Backend (API Routes)
│   ├── /api/notes - CRUD operations
│   ├── /api/refine - Suggestion generation + validation
│   ├── /api/digest - Digest generation
│   ├── /api/search - Search queries
│   ├── /api/email - Email digest sending
│   └── /api/chat - Conversational search handling
│
├── Workers (Background Jobs)
│   ├── Tier-1 Analysis (keywords, regex, classification)
│   ├── Tier-2 Claude API Integration (suggestions via Bull queue)
│   └── Digest Generation (scheduled Friday evening)
│
└── Database
    └── PostgreSQL
        ├── notes table (text, created_at, status)
        ├── note_metadata table (type, tags, connections)
        ├── digests table (content, sent_at, email_recipient)
        └── search_index (full-text search)
```

**Rationale:** Single language eliminates context switching. One container simplifies deployment. Easy to refactor for SaaS scaling in Phase 2.

---

## Technical Requirements by Feature

**1. Capture Interface**
- Markdown editor with syntax highlighting
- Auto-save to database (no friction)
- Note queuing for batch processing
- Responsive web interface (desktop + tablet)

**2. Tier-1 Analysis (Local Heuristics)**
- Keyword extraction (regex patterns)
- Simple classification (accomplishment vs idea vs problem)
- Tag inference from content
- Basic connection detection (entity matching)
- **Latency:** <100ms per note

**3. Tier-2 Claude API Integration**
- Async batch processing via Bull queue
- Authenticated calls to Claude API
- Token counting for cost tracking
- Graceful error handling & retries
- **Latency:** Async (suggestions ready by morning)

**4. Refinement Interface**
- One-by-one note review workflow
- Inline suggestion display
- Accept/reject/modify suggestion UI
- Note archive functionality (soft delete)
- Metadata editor for tags, type, connections
- **Performance:** Instant UI (data pre-loaded)

**5. Digest Generation**
- Automatic trigger every Friday evening
- Collect accomplishments (notes typed "Accomplishment")
- Extract challenges (notes typed "Problem")
- Generate action items (notes typed "Task" or "Next Steps")
- Eisenhower matrix formatting
- **Output:** Markdown in-app + HTML email

**6. Search Interface**
- PostgreSQL full-text search (simple keyword)
- Connection-aware results (show related notes)
- Multiple search styles (keyword, natural language, tag-based)
- **Latency:** <5 seconds for results

**7. Chat Interface**
- Conversational search with system personality
- Natural language queries ("What problems with ClientX?")
- Context-aware responses using refined note metadata
- **Backend:** Claude API for conversational abilities

**8. Email Integration**
- Authenticated SMTP for digest emails
- Professional email templating (HTML + plain text)
- Configurable recipient list
- Scheduled sending (Monday morning)

---

## Data Integrity & Reliability

**Critical Requirements (Zero Data Loss):**

- **Encrypted storage:** All notes encrypted at rest
- **Automated backups:** Daily backups to secure storage
- **Transaction logs:** Every user action logged (for recovery)
- **Archive instead of delete:** Soft deletes only, full audit trail
- **Backup verification:** Weekly backup integrity checks
- **Disaster recovery:** 4-hour RTO (Recovery Time Objective)

**Implementation:**
- PostgreSQL ACID transactions
- Automated backup scripts
- Encrypted storage (AES-256 for sensitive data)
- Audit logging (who, what, when)

---

## Performance Requirements

**Search Latency (Critical):**
- Target: <5 seconds for search results
- Measurement: P95 latency monitoring
- Implementation: PostgreSQL indexes + connection caching

**API Response Times:**
- Capture save: <500ms
- Note list: <1 second
- Digest generation: <30 seconds (async, acceptable)

**Frontend Responsiveness:**
- Page loads: <2 seconds
- Interactions: <100ms feedback
- No blocking operations

---

## Security Considerations

**Authentication & Authorization:**
- Simple auth for MVP (personal tool only)
- Future: OAuth/JWT for SaaS phase

**API Security:**
- Rate limiting (prevent abuse)
- Input validation (prevent injection attacks)
- CORS configuration
- HTTPS enforced

**Data Security:**
- HTTPS for all communication
- PostgreSQL encrypted connections
- Environment variables for secrets (API keys, etc.)
- No logging of sensitive data

---

## Development & Testing Culture

**Test-Driven Development (TDD):**
- Write tests BEFORE implementing features
- Jest for unit tests
- React Testing Library for component tests
- Integration tests for API endpoints
- Target: >80% code coverage

**Code Quality:**
- TypeScript strict mode (catch errors early)
- ESLint for style & best practices
- Prettier for consistent formatting
- Pre-commit hooks (prevent bad code)

**Git Workflow:**
- Feature branches for all work
- Pull request reviews (self-review at minimum)
- GitHub Actions CI (tests run on every PR)
- Branch protection (can't merge without passing tests)

---

## Implementation Roadmap

*(Weeks are estimates; actual pace depends on learning curve and complexity)*

**Week 1-2: Setup & Learning**
- TypeScript fundamentals
- Next.js project setup
- PostgreSQL local dev environment
- Git workflow establishment

**Week 3-4: Core Features (TDD)**
- Capture interface + tests
- Database schema + migrations
- Note CRUD API + tests

**Week 5-6: Tier-1 Analysis**
- Keyword extraction logic + tests
- Classification algorithm + tests
- Connection detection + tests
- Bull queue setup for async processing

**Week 7-8: Refinement UI**
- Refinement interface + tests
- Suggestion display + validation workflow
- Metadata editing + tests

**Week 9-10: Claude API Integration**
- Tier-2 API setup
- Batch processing pipeline
- Error handling & retries

**Week 11-12: Digest & Search**
- Digest generation logic
- Search implementation (PostgreSQL FTS)
- Email templating

**Week 13-16: Polish & Deploy**
- Chat interface (conversational search)
- Performance optimization
- Backup & disaster recovery setup
- Docker deployment to OVH
- Production hardening

---

## Stack Rationale

**TypeScript:** Type safety + industry standard skill. **Next.js:** React patterns + full-stack API routes + file-based routing. **PostgreSQL:** Industry standard, ACID compliance, FTS support, scales MVP→SaaS. **Bull Queue:** Native Node.js async processing with familiar patterns. **Jest + RTL:** TDD culture, behavior-focused testing, high coverage. **GitHub Actions:** Automated CI/CD, prevents broken code to production.

---

## Scalability Path

**MVP Personal Tool (Current):**
- Single OVH VPS
- PostgreSQL + Redis on same server
- Simple Docker deployment
- Works for 1 user, weeks of data

**Phase 2 SaaS (Future):**
- Load balancer for multiple instances
- Managed PostgreSQL (RDS/OVH Database)
- Managed Redis (ElastiCache/OVH Cache)
- Elasticsearch for semantic search
- CDN for static assets
- Monitoring & alerting

**Migration Path:** Clean architecture means easy refactoring to microservices when needed

---
