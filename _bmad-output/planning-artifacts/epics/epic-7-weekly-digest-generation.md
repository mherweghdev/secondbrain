# Epic 7: Weekly Digest Generation

**Goal:** Le système génère automatiquement un digest professionnel chaque vendredi avec accomplissements, challenges, action items

## Story 7.1: Create Digest Generation Algorithm

As a developer,
I want to implement the digest generation algorithm that collects and organizes refined notes,
So that digests are structured professionally by note type.

**Acceptance Criteria:**

**Given** It is Friday evening and refined notes exist for the week
**When** The digest generation job runs
**Then** Algorithm collects all notes with status = "refined" from the past 7 days
**And** Notes are grouped by note type: Accomplishments, Challenges (Problems/Issues), Action Items (Tasks/Next Steps), Insights (optional)
**And** Each section lists notes with formatted markdown (bullet points, headings)
**And** Accomplishments section highlights key wins (e.g., "Shipped authentication system")
**And** Challenges section summarizes problems encountered (e.g., "Database performance issue")
**And** Action Items section lists next steps (e.g., "Optimize search indexing")
**And** Insights section (optional) identifies patterns (e.g., "5 features shipped this week")
**And** Algorithm completes in <30 minutes (NFR-P4)

---

## Story 7.2: Format Digest with Professional Markdown Structure

As a user,
I want the digest to be formatted professionally with clean markdown,
So that I can share it with leadership without any edits.

**Acceptance Criteria:**

**Given** The digest generation algorithm has collected and grouped notes
**When** The digest is formatted
**Then** Digest includes a professional header: "Weekly Digest - [Week of YYYY-MM-DD]"
**And** Digest includes a brief intro/summary (e.g., "This week, I focused on...")
**And** Each section (Accomplishments/Challenges/Actions/Insights) has clear markdown headings (## Accomplishments)
**And** Notes within each section are formatted as bullet points with proper markdown
**And** Digest avoids jargon, internal codes, or technical details not suitable for leadership
**And** Digest is concise (1-2 pages max) but comprehensive
**And** Markdown is valid and renders correctly when converted to HTML or PDF

---

## Story 7.3: Schedule Digest Generation (Bull Queue Cron Job)

As a developer,
I want to schedule digest generation to run automatically Friday evening,
So that the digest is ready Monday morning without manual intervention.

**Acceptance Criteria:**

**Given** Bull Queue and Redis are configured for async job processing
**When** The application is deployed
**Then** A cron job is scheduled to run every Friday at 6:00pm local time
**And** Cron expression is configurable via environment variable (default: "0 18 * * 5" for 6pm Friday)
**And** Digest generation job is queued by the cron scheduler
**And** Job processes all refined notes from the past week
**And** Job generates the digest markdown and stores it in the database
**And** Job completes before 6:30am Monday (99% of the time - NFR-P4)
**And** Job logs success/failure to application logs (Pino structured JSON)
**And** If job fails, retry mechanism triggers (3x retry with exponential backoff)

---

## Story 7.4: Store Digest with Timestamp in Database

As a developer,
I want to store generated digests in the database with timestamps,
So that users can access historical digests.

**Acceptance Criteria:**

**Given** A digest has been generated successfully
**When** The digest generation job completes
**Then** Digest is stored in a new "digests" table with fields: id, userId, content (markdown text), generatedAt (timestamp), weekStart (date), weekEnd (date)
**And** Digest filename/identifier follows format: "YYYY-MM-DD-digest" (e.g., "2026-01-13-digest")
**And** Digest is associated with the user who owns the notes (userId FK)
**And** Digest storage transaction is atomic (rollback on failure)
**And** Digest is immediately queryable after storage
**And** Audit trail logs digest generation action with timestamp

---

## Story 7.5: Create In-App Digest Viewer

As a user,
I want to view my weekly digest in the application,
So that I can review it before sharing with leadership.

**Acceptance Criteria:**

**Given** A digest has been generated and stored
**When** I navigate to the "Digests" page or press Ctrl+D (or Cmd+D)
**Then** The most recent digest is displayed by default
**And** Digest is rendered as formatted markdown (headings, bullets, bold/italic)
**And** Digest viewer has a clean, readable layout (professional typography)
**And** I can navigate to previous digests using a dropdown or "Previous/Next" buttons
**And** Digest history shows all past digests sorted by date (newest first)
**And** I can export the digest as a markdown file (.md) by clicking "Download as Markdown"
**And** Digest viewer loads in <2 seconds (NFR-P3)

---

## Story 7.6: Implement Digest History and Searchability

As a user,
I want to search and filter past digests by date range,
So that I can quickly find specific weekly reports.

**Acceptance Criteria:**

**Given** I have multiple historical digests
**When** I view the digest history page
**Then** All digests are listed with date range (e.g., "Week of Jan 6-12, 2026")
**And** I can filter digests by date range: Last Month / Last Quarter / Last Year / All Time
**And** I can search digest content using keyword search (e.g., "ClientX project")
**And** Search results highlight matching text within digests
**And** I can click a digest in the list to view its full content
**And** Digest history is paginated if more than 20 digests exist
**And** Search and filtering complete in <5 seconds (NFR-P1)

---
