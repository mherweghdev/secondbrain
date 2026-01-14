# Functional Requirements

**Overview:** FRs define capabilities the MVP must provide. Organized by capability area (not technology or layer). Each FR is testable and implementation-agnostic, traceable to user journeys and success criteria.

---

## 1. Note Capture & Storage

**FR-1.1: Web-Based Note Creation**
- User can create a new note through a web interface
- Interface contains a markdown editor with syntax highlighting
- User can type or paste markdown content
- Note is saved immediately on each keystroke (auto-save)
- No confirmation dialog or save button required (frictionless)
- User can see the note appear in their note list immediately after saving

**FR-1.2: Note Metadata at Capture**
- System automatically captures: creation timestamp, modification timestamp
- System automatically detects: note source (web input)
- User can optionally tag note at capture time (optional, not required)

**FR-1.3: Note List & History**
- User can view all captured notes in reverse chronological order (newest first)
- Each note shows: date, first 50 characters of content, current status (raw/refined/archived)
- User can click to open any note for viewing or editing
- User can filter notes by status (raw, refined, archived)

**FR-1.4: Note Editing**
- User can edit any note's markdown content after creation
- Edits are saved immediately (auto-save)
- Edit timestamp is updated
- User can edit during refinement process (last chance to fix)

**FR-1.5: Note Archive**
- User can archive a note (mark as deleted without destroying)
- Archived notes remain searchable and viewable
- Archived notes don't appear in active lists by default
- User can restore archived notes (move back to active)
- No permanent deletion (soft delete only)

---

## 2. Tier-1 Analysis (Local Heuristics)

**FR-2.1: Automatic Keyword Extraction**
- System automatically extracts keywords from note content
- Extracts hashtags (#hashtag format)
- Extracts @mentions (@person format)
- Extracts entities (proper nouns, company names)
- Stores extracted keywords for suggestion input

**FR-2.2: Automatic Note Type Classification**
- System automatically classifies note as: Accomplishment, Idea, Problem, Meeting, Task
- Classification based on keywords and patterns
- Examples:
  - "✅ Feature X shipped" → Accomplishment
  - "Bug in auth system" → Problem
  - "Meeting with ClientX" → Meeting
  - "Consider implementing Y" → Idea
- Classification is a suggestion (user can override in refinement)

**FR-2.3: Basic Connection Detection**
- System identifies if note mentions entities from previous notes
- Suggests connections: "This mentions ClientX (also in 3 other notes)"
- Suggests connections: "This mentions 'auth' (also in bug note from yesterday)"
- Connections based on entity matching (not semantic)

**FR-2.4: Latency Requirement**
- All Tier-1 analysis completes within 100ms per note
- Analysis runs locally (no API calls)
- Results available immediately after note save

---

## 3. Tier-2 Enrichment (Claude API Integration)

**FR-3.1: Async Batch Suggestion Queue**
- Notes are queued for Tier-2 analysis after Tier-1 completion
- Queue processes in background (async, non-blocking)
- Suggestions are ready by next morning (acceptable async latency)
- User is notified when suggestions are ready (optional notification)

**FR-3.2: Claude API Suggestions**
- System sends qualified note (with Tier-1 results) to Claude API
- Claude suggests:
  - Refined note type (more nuanced than Tier-1)
  - Rich metadata (context, severity, impact)
  - Connections to previous notes (semantic, not just lexical)
  - Related patterns or insights
- Suggestions are stored with the note

**FR-3.3: Cost Tracking**
- System counts tokens sent to Claude API
- System tracks monthly API costs
- User can view: tokens used today, tokens used this week, estimated monthly cost
- Cost stays under $5/month (tracked metric)

**FR-3.4: Error Handling & Retries**
- If Claude API call fails, system retries up to 3 times
- After 3 failures, note gets Tier-1 suggestions only (graceful degradation)
- User is notified of API failures (optional alert)
- Tier-1 suggestions alone are still valuable (no blocking)

---

## 4. Refinement Workflow (Friday Review)

**FR-4.1: Refinement Mode**
- User can enter "Refinement Mode" or "Friday Review"
- System displays all pending notes (captured but not yet refined)
- Interface shows one note at a time, in order of creation
- User cannot skip notes (must review all or exit mode)

**FR-4.2: Suggestion Review & Validation**
- For each note, system displays:
  - Original note content
  - Suggested note type (with confidence)
  - Suggested tags/keywords
  - Suggested connections to other notes
- User can accept, reject, or modify each suggestion
- User can add additional notes/context to suggestions

**FR-4.3: Note Editing During Refinement**
- User can edit the original note text during refinement
- This is the last chance to fix typos or clarify
- Changes are immediately reflected

**FR-4.4: Metadata Confirmation**
- User confirms or modifies:
  - Note type (Accomplishment/Problem/Idea/Meeting/Task)
  - Tags (refined list)
  - Connections (accept suggested or add custom)
  - Severity/priority (if applicable)
- User clicks "Validate & Save Note" when satisfied
- Note moves to refined queue

**FR-4.5: Refinement Progress Tracking**
- System shows progress: "2 of 8 notes refined"
- User can see how many notes remain
- User can exit and resume refinement later (progress is saved)
- User can mark refinement complete when all notes are processed

**FR-4.6: Session Timing**
- System tracks refinement session time
- Target: complete refinement in <30 minutes for typical week (10 notes)
- User can see: time spent so far, estimated time remaining

---

## 5. Digest Generation & Synthesis

**FR-5.1: Automatic Weekly Digest Generation**
- System automatically generates digest Friday evening
- Collects all refined notes from the week
- Organizes by note type and metadata
- Generates markdown-formatted digest

**FR-5.2: Digest Structure (Phase 1 MVP)**
- **Accomplishments Section:**
  - Lists all notes typed "Accomplishment"
  - Shows accomplishment title + brief context
  - Shows associated metadata (client, project, effort)
- **Challenges Section:**
  - Lists all notes typed "Problem" or "Issue"
  - Shows challenge title + impact
  - Shows suggested resolution or follow-up
- **Action Items Section:**
  - Lists all notes typed "Task" or "Next Steps"
  - Organized by urgency/importance (simple prioritization)
  - Shows due date or context if available
- **Insights Section (Optional):**
  - Notes interesting patterns (if detected)
  - Example: "Completed 5 features this week (above typical 3)"

**FR-5.3: Digest Storage & History**
- Digest is saved with timestamp (e.g., "2026-01-13-digest")
- User can view all previous digests
- Digest is viewable as markdown in-app
- Digest can be exported as markdown file (for sharing)

**FR-5.4: Professional Quality**
- Digest is formatted professionally (clean markdown, readable)
- Digest can be shared with leadership without edits
- Digest includes brief intro/summary
- No jargon or internal notes visible

---

## 6. Search & Retrieval

**FR-6.1: Keyword Search**
- User can search by keyword or tag
- Search covers: note content + metadata (tags, connections)
- Results display: matching notes with context highlights
- Latency: <5 seconds for typical search

**FR-6.2: Tag-Based Search**
- User can search by specific tag (e.g., "#auth", "@ClientX")
- Results show all notes with that tag
- Results include notes that mention the tag in content

**FR-6.3: Connection-Aware Results**
- Search results show not just direct matches, but related notes
- Example: Search "ClientX" returns:
  - Direct mentions of ClientX
  - Connected notes (bugs affecting ClientX, meetings about ClientX)
  - Related action items (tasks for ClientX)
- Related notes are marked as "connected" (transparent to user)

**FR-6.4: Search Styles (MVP Phase 1)**
- Simple keyword search (supported)
- Tag search (supported)
- **Not in MVP:** Conversational search, semantic search (Phase 2)

**FR-6.5: Search UI**
- Search interface is simple (textbox + results)
- User types query → results appear
- Results are sortable (date, relevance, type)
- User can click result to open note

---

## 7. Data Integrity & Reliability

**FR-7.1: Automatic Backups**
- System creates daily automated backup of all notes
- Backup includes all note content, metadata, and audit trail
- Backup is stored securely (separate from primary storage)
- Backup can be verified (user can check backup integrity)

**FR-7.2: Audit Trail**
- Every note creation is logged with timestamp and user action
- Every note edit is logged with timestamp, user, and change details
- Every note refinement is logged
- Every search query is logged (for user behavior analytics)
- Audit trail is immutable (cannot be deleted)

**FR-7.3: Transaction Safety**
- All note operations (create, edit, refine) are atomic transactions
- If operation fails, data is rolled back (no partial saves)
- If system crashes, user data is protected (ACID compliance)

**FR-7.4: Data Recovery**
- If data is accidentally deleted (archive → restore), user can recover
- If note is corrupted, user can revert to previous version (from audit trail)
- Disaster recovery target: 4-hour RTO (Recovery Time Objective)

**FR-7.5: Encryption**
- Sensitive note data is encrypted at rest (AES-256)
- Backups are encrypted
- Communication is encrypted (HTTPS)

---

## 8. User Authentication & System Access

**FR-8.1: User Authentication (MVP Simple)**
- Simple authentication for personal tool (password or session)
- User logs in once (session persists)
- User can log out (clears session)
- No multi-user support in MVP (just you)

**FR-8.2: Session Management**
- Session expires after inactivity (2 hours)
- User is prompted to re-authenticate if session expires
- User data is cleared from browser on logout

**FR-8.3: API Security**
- All API endpoints require authentication
- Rate limiting to prevent abuse (max 100 requests/minute per user)
- Input validation on all endpoints (prevent injection attacks)
- CORS configured for security

---

## 9. Integration Points

**FR-9.1: Claude API Integration (Tier-2)**
- System authenticates with Claude API using API key
- System sends note + Tier-1 suggestions to Claude
- System receives enriched suggestions from Claude
- System stores suggestions with note
- All API calls include error handling

**FR-9.2: Email Integration (Phase 2, not MVP)**
- **Not in Phase 1 MVP**
- Phase 2 will add: Email sending for digest, SMTP configuration

**FR-9.3: Database Integration**
- System persists all notes to PostgreSQL database
- System maintains relational integrity (notes → metadata, connections)
- System performs full-text indexing for search performance

---

## 10. Reporting & Analytics (Personal Use)

**FR-10.1: Personal Usage Dashboard (Optional Phase 2)**
- User can view personal usage statistics
- Shows: notes captured this week, refinements completed, digests generated
- Shows: API costs this month, search queries performed
- **Not in Phase 1 MVP** (can be added later)

**FR-10.2: Digest History & Archiving**
- All digests are archived for historical reference
- User can view previous weeks' digests
- Digests can be searched and filtered by date range

---

## Functional Requirement Coverage Map

**Each Requirement Maps Back To:**
- Success Criteria (defines what makes MVP successful)
- User Journeys (shows how requirement is used)
- Scope (shows which phase the requirement is in)

**Example Traceability:**
- FR-1.1 (Web Note Creation) → Journey 1 (Capture) → Success Metric 1 (10 notes/week)
- FR-4.4 (Metadata Confirmation) → Journey 2 (Refinement) → Success Metric 2 (30 min refinement)
- FR-6.1 (Keyword Search) → Journey 4 (Search) → Success Metric 4 (<5 sec search)

---

## Completeness Checklist

✅ **Note Capture & Storage** (5 requirements)
✅ **Tier-1 Analysis** (4 requirements)
✅ **Tier-2 Enrichment** (4 requirements)
✅ **Refinement Workflow** (6 requirements)
✅ **Digest Generation** (4 requirements)
✅ **Search & Retrieval** (5 requirements)
✅ **Data Integrity** (5 requirements)
✅ **User Authentication** (3 requirements)
✅ **Integration Points** (3 requirements)
✅ **Analytics & Reporting** (2 requirements)

**Total: 41 Functional Requirements (MVP Phase 1)**

**Phase 2 will add:** Email digest, Eisenhower matrix, Conversational search, LLM upgrade (~15 additional FRs)

---

## Critical Notes

**What's NOT Here (Intentional):**
- No UI/UX specifications (that's Design)
- No performance targets beyond critical ones (that's Non-Functional Requirements)
- No technology/implementation details (FR says WHAT, not HOW)
- No Phase 2 features in MVP section (clear boundary)

**What IS Here:**
- Every testable capability the MVP must provide
- Clear traceability to user journeys
- Clear mapping to success criteria
- Implementation-agnostic (could be built multiple ways)

---

## FR Scope Summary

✅ **Total: 41 Functional Requirements** covering MVP Phase 1 (Capture → Raffinage → Basic Digest → Search)

**Phase 2 will add ~15 additional FRs:**
- Email digest sending with configurable scheduling
- Eisenhower matrix visualization
- Conversational search interface ("Chat with secondbrain")
- LLM upgrade (Tier-2 Claude → local LLM when GPU available)
- Performance monitoring and observability

---
