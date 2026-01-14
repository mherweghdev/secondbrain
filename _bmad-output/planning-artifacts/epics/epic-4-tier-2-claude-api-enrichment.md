# Epic 4: Tier-2 Claude API Enrichment

**Goal:** Le système enrichit les notes avec des suggestions IA avancées (connexions sémantiques, métadonnées riches)

## Story 4.1: Setup Redis and Bull Queue for Async Processing

As a developer,
I want to configure Redis and Bull Queue for background job processing,
So that Tier-2 analysis can run asynchronously without blocking the user.

**Acceptance Criteria:**

**Given** The application needs async job processing infrastructure
**When** I install and configure Redis and Bull Queue
**Then** Redis container is added to docker-compose.yml (redis:alpine image)
**And** Redis runs on port 6379 and persists data in a local volume
**And** Bull Queue client is installed and configured in the application
**And** Bull Queue connects to Redis successfully on application startup
**And** Test job can be queued and processed successfully
**And** Queue dashboard (Bull Board) is accessible at /admin/queues for monitoring
**And** Queue can handle 100+ jobs per hour without backing up (NFR-Sc2)

---

## Story 4.2: Integrate Claude API for Tier-2 Suggestions

As a developer,
I want to integrate Claude API to send notes and receive enriched suggestions,
So that users get semantic connections and refined metadata.

**Acceptance Criteria:**

**Given** A Claude API key is configured in environment variables
**When** A Tier-2 enrichment job runs
**Then** Job sends note content + Tier-1 suggestions to Claude API
**And** API request includes prompt: "Analyze this note and provide: refined note type, semantic connections to concepts/entities, rich metadata, and patterns"
**And** API response is parsed and validated (expected JSON structure)
**And** Tier-2 suggestions include: refined note type (may differ from Tier-1), semantic connections (related concepts, not just entity matches), additional metadata (keywords, themes, priority level)
**And** Tier-2 suggestions are stored in metadata table (tier2Suggestions jsonb field)
**And** API call completes in <10 seconds (timeout if longer)
**And** API errors are logged with full request/response details for debugging

---

## Story 4.3: Queue Notes for Tier-2 Processing

As a developer,
I want to automatically queue notes for Tier-2 processing after Tier-1 analysis,
So that enrichment happens in the background without user intervention.

**Acceptance Criteria:**

**Given** A note has been created and Tier-1 analysis has completed
**When** Tier-1 suggestions are stored in the database
**Then** A Tier-2 enrichment job is queued in Bull Queue
**And** Job payload includes: noteId, userId, note content, Tier-1 suggestions
**And** Job is scheduled to run immediately (no delay for MVP)
**And** Job queue is persistent (survives application restart via Redis)
**And** Multiple notes can be queued concurrently (batch processing)
**And** Queue processes jobs in FIFO order (first in, first out)
**And** Queue capacity supports 100+ jobs without performance degradation (NFR-Sc2)

---

## Story 4.4: Implement Token Counting and Cost Tracking

As a developer,
I want to count tokens sent to Claude API and track monthly costs,
So that I can stay within the $5/month budget.

**Acceptance Criteria:**

**Given** Claude API calls are being made for Tier-2 enrichment
**When** Each API call completes
**Then** Tokens sent (prompt) and received (response) are counted
**And** Token count is stored in a "api_usage" table with fields: id, userId, timestamp, tokensIn, tokensOut, cost (calculated), endpoint
**And** Cost is calculated based on Claude API pricing (e.g., $0.015/1K tokens for input, $0.075/1K tokens for output)
**And** Monthly cost is aggregated and displayed in user dashboard (future story)
**And** Warning is logged if monthly cost exceeds $4 (80% of budget)
**And** API calls are throttled/paused if monthly cost exceeds $5 (budget limit)
**And** Cost tracking updates in real-time after each API call

---

## Story 4.5: Implement Error Handling and Retry Logic

As a developer,
I want to retry failed Claude API calls up to 3 times with graceful degradation,
So that temporary API failures don't block the user or lose data.

**Acceptance Criteria:**

**Given** A Claude API call fails (timeout, rate limit, server error)
**When** The Tier-2 enrichment job encounters an error
**Then** Job retries the API call after 5 seconds (1st retry)
**And** If 1st retry fails, job retries after 15 seconds (2nd retry - exponential backoff)
**And** If 2nd retry fails, job retries after 45 seconds (3rd retry - exponential backoff)
**And** If all 3 retries fail, job marks note as "Tier-2 failed - using Tier-1 suggestions only"
**And** Note remains usable with Tier-1 suggestions (graceful degradation - NFR-R5)
**And** User is notified in refinement UI: "Advanced suggestions unavailable - using local analysis"
**And** Failed jobs are logged with full error details for debugging
**And** Failed jobs can be manually retried by admin if needed

---

## Story 4.6: Display Tier-2 Suggestions in Refinement UI

As a user,
I want to see Tier-2 suggestions (semantic connections, refined metadata) during refinement,
So that I can benefit from AI-enhanced insights.

**Acceptance Criteria:**

**Given** A note has been enriched with Tier-2 suggestions
**When** I view the note in refinement mode
**Then** Tier-2 suggestions are displayed alongside Tier-1 suggestions
**And** Refined note type from Claude API is shown (may differ from Tier-1)
**And** Semantic connections are displayed: "This note relates to [concept] - see 5 connected notes"
**And** Rich metadata (themes, priority, additional keywords) is displayed
**And** I can distinguish between Tier-1 (local) and Tier-2 (AI) suggestions with labels or icons
**And** I can accept, reject, or modify Tier-2 suggestions just like Tier-1
**And** If Tier-2 failed, only Tier-1 suggestions are shown with a subtle note: "Advanced analysis unavailable"

---
