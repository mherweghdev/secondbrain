# Project Scoping & Phased Development

## MVP Strategy & Philosophy

**Approach:** Problem-Solving MVP focused on Capture → Raffinage workflow. Success = daily usage for 4 weeks with professional digest quality.

**Rationale:** Capture and Raffinage are differentiators (other tools do capture + search). Digest, search, and Eisenhower matrix deferred to Phase 2 to reduce initial complexity and allow data-driven iteration.

**Resources:** Solo developer, 16 weeks total (Weeks 1-2: learning, Weeks 3-12: core MVP, Weeks 13-16: polish/deploy).

---

## Phase 1 MVP Feature Set (Weeks 1-12)

**Core User Journeys Supported:**
1. ✅ Morning Work Capture (Tuesday journey) - Fast note creation
2. ✅ Friday Afternoon Refinement (Friday journey) - Intelligent suggestions + validation
3. ⚠️ Monday Morning Digest (Monday journey) - Basic version only (text report, no Eisenhower matrix yet)
4. ✅ Wednesday Search (Wednesday journey) - Simple keyword search

**Must-Have Capabilities:**

**Capture Interface:**
- [ ] Web-based markdown editor with syntax highlighting
- [ ] Auto-save on every keystroke (zero friction)
- [ ] Note appears in capture queue immediately
- [ ] Support for varied note types (meetings, accomplishments, problems)
- [ ] Desktop + tablet responsive design
- [ ] No friction, just capture and move on

**Tier-1 Analysis (Local Heuristics):**
- [ ] Keyword extraction (regex patterns for #hashtags, @mentions, etc.)
- [ ] Simple note type classification (accomplishment, idea, problem, meeting, task)
- [ ] Tag inference from content (entity extraction)
- [ ] Basic connection detection (entity matching to previous notes)
- [ ] **Latency:** <100ms per note (runs locally)

**Tier-2 Suggestions (Claude API):**
- [ ] Async batch queuing (Bull queue setup)
- [ ] Claude API integration for rich suggestions
- [ ] Token counting for cost tracking (<$5/month)
- [ ] Graceful error handling and retries
- [ ] Suggestions ready by morning (async, acceptable latency)

**Refinement Interface:**
- [ ] One-by-one note review (one note per screen)
- [ ] Inline suggestion display (type, tags, connections visible)
- [ ] Ability to edit note during refinement (last chance to fix typos)
- [ ] Archive functionality (soft delete, keep audit trail)
- [ ] Accept/reject/modify suggestions for each note
- [ ] Save progress (can exit and resume refinement)
- [ ] Visual confirmation when refinement complete

**Basic Digest (Markdown format):**
- [ ] Collect refined notes from the week
- [ ] Group by accomplishments vs challenges
- [ ] Generate action items list
- [ ] Output as markdown file (viewable in app)
- [ ] Save to digest history
- **Note:** No Eisenhower matrix or email yet (Phase 2)

**Search Interface:**
- [ ] Simple keyword/tag search
- [ ] PostgreSQL full-text search backend
- [ ] Connection-aware results (show related notes)
- [ ] Multiple search styles (keyword, tag-based)
- [ ] **Latency:** <5 seconds guaranteed
- **Note:** No conversational chat yet (Phase 2)

**Data Integrity & Reliability:**
- [ ] PostgreSQL ACID transactions
- [ ] Automated daily backups
- [ ] Audit logging (all actions tracked)
- [ ] Soft deletes only (archive, never destroy)
- [ ] Transaction rollback capability
- [ ] Zero data loss as success metric

**Development & Testing Infrastructure:**
- [ ] Git workflow with feature branches
- [ ] Test-driven development (write tests first)
- [ ] Jest + React Testing Library setup
- [ ] GitHub Actions CI (tests on every PR)
- [ ] >80% code coverage target
- [ ] Docker containerization ready

**Deployment:**
- [ ] Docker image creation
- [ ] OVH VPS setup guide documented
- [ ] PostgreSQL + Redis setup
- [ ] Environment variable management
- [ ] Basic monitoring and error tracking

---

## Explicit MVP Boundaries (NOT in Phase 1)

**Defer to Phase 2:**
- ❌ Digest email sending (will build in Phase 2)
- ❌ Eisenhower matrix visualization
- ❌ Advanced semantic search
- ❌ Conversational chat interface
- ❌ Local LLM integration (too complex for MVP)
- ❌ Performance optimization beyond basic indexing

**Defer to Phase 2+:**
- ❌ iPad/stylus handwriting input
- ❌ Web clipper / browser extension
- ❌ Mobile app (native or PWA)
- ❌ Email-to-note integration
- ❌ Voice capture / transcription
- ❌ Multi-user / team collaboration
- ❌ Real-time collaboration features

**Rationale:** Capture + Refinement prove core value. Digest and search are Phase 2 enhancements. Deferred features reduce complexity, allow early validation, and simplify Phase 1 foundation.

---

## Phase 2: Growth & Exploitation (Weeks 13-24)

**Add to MVP:**

**Digest Generation & Distribution:**
- [ ] Automatic trigger Friday evening
- [ ] Professional digest with accomplishments + challenges
- [ ] Action items list (Eisenhower matrix formatting)
- [ ] HTML email template generation
- [ ] Email sending to configured addresses (you + boss)
- [ ] Digest history / archive in app

**Advanced Search:**
- [ ] Conversational search interface ("Chat with secondbrain")
- [ ] Claude API for natural language understanding
- [ ] Context-aware responses using refined metadata
- [ ] System personality / conversational tone
- [ ] Multiple search styles (keyword + NLP + connection-based)

**LLM Upgrade Path:**
- [ ] Transition Tier-2 from Claude API to local LLM
- [ ] Ollama/Hugging Face setup (when GPU available)
- [ ] Fine-tuning on your historical note data
- [ ] Cost reduction (zero API costs)

**Performance & Scale:**
- [ ] Elasticsearch for semantic search (if needed)
- [ ] Caching layer (Redis optimization)
- [ ] Query performance monitoring
- [ ] Full-text search optimization

**Observability:**
- [ ] Logging infrastructure
- [ ] Error tracking and alerting
- [ ] Performance metrics
- [ ] User behavior analytics (personal usage tracking)

---

## Phase 3: Expansion (Months 6+)

**Capture Expansion:**
- [ ] iPad stylus / handwriting input + OCR
- [ ] Web clipper for bookmarks/discoveries
- [ ] Mobile note-taking (PWA or native)
- [ ] Email-to-note integration
- [ ] Voice capture / transcription

**SaaS Potential (If Validated):**
- [ ] Multi-user capability
- [ ] Per-user digest generation
- [ ] Sharing specific digests with leadership
- [ ] Team collaboration (optional)
- [ ] Pricing model exploration
- [ ] Managed hosting (separate from personal tool)

**Advanced Features:**
- [ ] Knowledge graph visualization
- [ ] Cross-note insights and patterns
- [ ] Learning reminders (spaced repetition)
- [ ] Integration with calendar/CRM
- [ ] Custom digest templates

---

## MVP Success Gate (Week 4-5 Checkpoint)

**After 4 weeks of real usage, evaluate:**

✅ **If ALL of these are true → Proceed to Phase 2:**
- Capturing 10+ notes/week consistently (habit formed)
- Completing 4/5 weekly refinements on Friday
- Digest is professional-quality (ready to share with leadership)
- Searches return relevant results in <5 sec
- Zero data loss incidents
- You're excited to continue (subjective but critical)

❌ **If ANY of these are false → Iterate on MVP:**
- Capture is too friction-heavy? Fix UX
- Refinement suggestions are poor? Improve Tier-1 heuristics
- Search isn't working? Debug queries
- Data loss happened? Fix immediately
- You're not using it daily? Understand why (feature or motivation?)

**Decision Point:** Only proceed to Phase 2 if MVP proves valuable in real usage. No feature bloat before validation.

---

## Risk Mitigation Strategy

**Technical Risks:**

**Risk 1: Claude API Reliability**
- Mitigation: Start with simple API calls, add retry logic, have local heuristics fallback
- Monitoring: Track API failures, alert on high failure rate
- Fallback: Tier-1 suggestions alone are still valuable

**Risk 2: Search Performance**
- Mitigation: PostgreSQL FTS sufficient for MVP, monitor query times
- Escalation: Only move to Elasticsearch if queries exceed 5 sec regularly
- Testing: Load test with realistic note volume

**Risk 3: Data Loss**
- Mitigation: PostgreSQL ACID transactions, automated backups from day 1
- Validation: Weekly backup verification, restore testing
- Monitoring: Alert on backup failures

**Resource Risks:**

**Risk 1: Learning Curve Delays**
- Mitigation: Budget 2 weeks for TypeScript/Next.js learning
- Strategy: Build simple features first, complex later
- Support: Online communities, documentation (invest in learning)

**Risk 2: Solo Development Burnout**
- Mitigation: Set realistic timeline (16 weeks), take breaks
- Approach: Iterate and release early (don't perfectionism)
- Goal: Working tool < perfect tool

**Market Risks:**

**Risk 1: Actually Using It**
- Mitigation: The MVP gate (4-week daily usage) is your validation
- If it fails: Understand why (friction? missing feature? motivation?)
- Learning: Failure is data (what to change for Phase 2)

**Contingency Plans:**

- **If stuck on technical issue:** Simplify approach, defer to Phase 2
- **If Claude API too expensive:** Implement Tier-1 only until Phase 2 LLM integration
- **If running out of time:** Cut Polish (deploy functional, not perfect)
- **If not using daily:** Stop and reassess (maybe problem isn't your problem?)

---

## Timeline & Resource Expectations

**Total Timeline:** 16 weeks from start to deployed MVP

**Week Breakdown:**
- Weeks 1-2: Setup, learning TypeScript/Next.js (expect slow progress, that's normal)
- Weeks 3-4: Core capture + database (first feature is hardest)
- Weeks 5-6: Tier-1 analysis + refinement UI
- Weeks 7-8: Tier-2 Claude integration (async queue setup)
- Weeks 9-10: Basic digest + search
- Weeks 11-12: Testing, bug fixes, optimization
- Weeks 13-16: Polish, Docker setup, OVH deployment, hardening

**Weekly Commitment:** 20-30 hours/week development + learning

**Learning vs Building:** Expect 40% learning time in weeks 1-4, dropping to 10% by week 8

**Success Definition (4-week MVP gate):** You're using it daily, digest looks professional, no data loss

---

## Scope Rationale

**Capture + Raffinage first:** Are the differentiators; validate core problem; provide Phase 2 data. **Digest/Eisenhower deferred:** Depend on Phase 1 data quality; can be added in 2 weeks; reduces complexity. **Advanced search/chat deferred:** PostgreSQL FTS sufficient for MVP; chat adds complexity without core value. **Solo development:** Personal tool enables simplicity; incremental learning; Phase 1 achievable in 12 weeks.

---
