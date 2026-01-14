# Epic 1: Note Capture & Basic Storage

**Goal:** Les utilisateurs peuvent capturer des notes rapidement en markdown et les voir listées avec authentification sécurisée

## Story 1.1: Setup Supabase Authentication

As a user,
I want to authenticate with email and password using Supabase Auth,
So that my notes are secure and accessible only to me.

**Acceptance Criteria:**

**Given** Supabase project is created and credentials are configured
**When** I visit the application for the first time
**Then** I am redirected to a login/signup page
**And** I can sign up with email and password (bcrypt hashing)
**And** I can log in with valid credentials and receive a session token
**And** Session persists across page refreshes
**And** Session expires after 30 days of inactivity (NFR-S3)
**And** I can log out and session is cleared from browser storage

---

## Story 1.2: Create Notes Database Schema with Prisma

As a developer,
I want to define the notes and metadata database schema using Prisma ORM,
So that I can persist notes with proper relational integrity.

**Acceptance Criteria:**

**Given** Supabase PostgreSQL database is configured
**When** I create the Prisma schema for notes
**Then** Notes table includes: id, userId, content (text), createdAt, updatedAt, status (enum: raw/refined/archived), source (string)
**And** Metadata table includes: id, noteId (FK), extractedAt, noteType (enum), tags (array), connections (jsonb)
**And** Audit trail table includes: id, noteId (FK), action (enum), timestamp, userId
**And** Database migrations are created and can be applied with `npx prisma migrate dev`
**And** Prisma client is generated and type-safe models are available
**And** Foreign key constraints maintain referential integrity
**And** Indexes are created on userId, createdAt, status for query performance

---

## Story 1.3: Implement Markdown Editor with CodeMirror 6

As a user,
I want to write notes in a markdown editor with syntax highlighting,
So that I can capture notes quickly with proper formatting.

**Acceptance Criteria:**

**Given** I am authenticated and on the note creation page
**When** I click "New Note" (Ctrl+N shortcut)
**Then** A markdown editor opens using CodeMirror 6
**And** Markdown syntax is highlighted in real-time (headings, bold, italic, code blocks, lists)
**And** Editor supports standard markdown formatting (# headers, **bold**, *italic*, `code`, [links](url))
**And** Editor is keyboard-navigable (Tab for indentation, Shift+Tab for outdent)
**And** Editor has a clean, distraction-free interface (no unnecessary toolbars)
**And** Editor height adjusts to content (up to viewport height)
**And** Placeholder text guides user: "Start typing in markdown..."

---

## Story 1.4: Add Auto-Save Functionality with Visual Indicator

As a user,
I want my notes to auto-save automatically while typing,
So that I never lose my work if I close the browser or lose connectivity.

**Acceptance Criteria:**

**Given** I am editing a note in the markdown editor
**When** I type or modify content
**Then** Auto-save is triggered after 500ms of inactivity (debounced)
**And** Visual indicator shows "Saving..." during API call
**And** Visual indicator shows "Saved" when save completes successfully
**And** If save fails, indicator shows "Error - Retrying..." and retries up to 3 times
**And** Note content is persisted to PostgreSQL via POST /api/notes
**And** Save operation completes in <1 second (NFR-P2)
**And** Note metadata (createdAt, updatedAt, userId) is automatically captured

---

## Story 1.5: Display Note List with Filters

As a user,
I want to view all my notes in a list with filters by status and date,
So that I can quickly navigate to past notes.

**Acceptance Criteria:**

**Given** I have created multiple notes
**When** I navigate to the notes list page
**Then** All notes are displayed in reverse chronological order (newest first)
**And** Each note shows: creation date, first 50 characters of content, status badge (raw/refined/archived)
**And** Filter dropdown allows filtering by status: All / Raw / Refined / Archived
**And** Filter by date range: Today / This Week / This Month / All Time
**And** Clicking a note opens it in the editor for viewing/editing
**And** List updates in real-time when a new note is created
**And** Empty state shows "No notes yet - press Ctrl+N to create your first note" when list is empty

---

## Story 1.6: Implement API Security (Rate Limiting, CORS, Input Validation)

As a developer,
I want to secure all API endpoints with authentication, rate limiting, and input validation,
So that the application is protected from abuse and malicious attacks.

**Acceptance Criteria:**

**Given** API endpoints are exposed for note operations
**When** A client makes requests to /api/notes or /api/auth endpoints
**Then** All endpoints require valid authentication token (session or JWT)
**And** Unauthenticated requests receive 401 Unauthorized response
**And** Rate limiting is enforced: max 100 requests per minute per user (NFR-S3)
**And** Requests exceeding rate limit receive 429 Too Many Requests response
**And** CORS is configured to allow only trusted origins (frontend domain)
**And** Input validation rejects invalid data (e.g., empty note content, invalid user IDs)
**And** SQL injection is prevented via Prisma parameterized queries
**And** XSS is prevented by sanitizing user input before storing

---
