# Epic 6: Search & Connection-Aware Retrieval

**Goal:** Les utilisateurs peuvent retrouver rapidement leurs notes par keyword/tag avec connexions visibles

## Story 6.1: Implement PostgreSQL Full-Text Search (FTS)

As a developer,
I want to configure PostgreSQL Full-Text Search with tsvector indexes,
So that keyword search is fast (<5 sec) and efficient.

**Acceptance Criteria:**

**Given** Notes are stored in PostgreSQL
**When** I configure FTS indexes
**Then** A tsvector column is added to the notes table for full-text indexing
**And** tsvector is automatically updated via trigger on note content changes
**And** GIN index is created on the tsvector column for fast search
**And** FTS supports English language (ts_vector('english', content))
**And** FTS indexes note content, tags, and metadata (note type, connections)
**And** FTS ranking algorithm prioritizes exact matches over partial matches
**And** FTS query performance is <5 seconds for 95th percentile (NFR-P1)

---

## Story 6.2: Create Search Interface UI

As a user,
I want a simple search interface with a textbox and instant results,
So that I can quickly find notes without complex filters.

**Acceptance Criteria:**

**Given** I want to search for notes
**When** I press Ctrl+/ (or Cmd+/) or click "Search" button
**Then** Search interface opens with a textbox focused and ready for input
**And** I can type a keyword or tag (e.g., "ClientX", "#auth", "bug in API")
**And** Search is triggered on Enter key or after 500ms of inactivity (debounced)
**And** Results are displayed below the search textbox in a list
**And** Each result shows: note title (first line), creation date, snippet with highlighted keyword
**And** Results are sorted by relevance (default) with option to sort by date or type
**And** Clicking a result opens the note in the editor
**And** Search UI loads in <2 seconds (NFR-P3)

---

## Story 6.3: Implement Keyword Search (Content + Metadata)

As a user,
I want to search by keyword and find matches in note content and metadata,
So that I can retrieve relevant notes even if the keyword is in tags or connections.

**Acceptance Criteria:**

**Given** I have entered a keyword in the search textbox
**When** I press Enter to execute the search
**Then** Search queries note content using PostgreSQL FTS
**And** Search also queries metadata tags (exact or partial match)
**And** Search also queries metadata connections (related note IDs and entities)
**And** Results include notes where keyword appears in content, tags, or connections
**And** Results highlight keyword matches with <mark> tags or bold styling
**And** Search completes in <5 seconds for 95th percentile (NFR-P1 - CRITICAL)
**And** Search returns up to 50 results (paginated if more)

---

## Story 6.4: Implement Tag-Based Search (#tag, @mention)

As a user,
I want to search by specific hashtags or @mentions,
So that I can filter notes by topic or person.

**Acceptance Criteria:**

**Given** I have entered a tag or mention in the search textbox (e.g., "#auth", "@ClientX")
**When** I press Enter to execute the search
**Then** Search detects tag syntax (# or @) and filters by that specific tag
**And** Search queries metadata tags field for exact match (case-insensitive)
**And** Results show all notes that include the specified tag
**And** Results also show notes where tag appears in content (not just metadata)
**And** Multiple tags can be combined (e.g., "#auth @ClientX" returns notes with both)
**And** Tag search completes in <5 seconds (NFR-P1)
**And** Tag search results are sorted by date (newest first)

---

## Story 6.5: Display Connection-Aware Search Results

As a user,
I want to see direct matches and related notes in search results,
So that I can discover connected information (serendipity discovery).

**Acceptance Criteria:**

**Given** I have executed a search that returns matching notes
**When** Results are displayed
**Then** Direct matches are shown first (notes where keyword appears in content)
**And** Related notes are shown below with label "Connected Notes"
**And** Related notes are identified via metadata connections (Tier-1 or Tier-2)
**And** Each related note shows context: "Related to [matched note] via [entity/tag]"
**And** Clicking a related note opens it in the editor
**And** Connection-aware results load in <5 seconds (NFR-P1)
**And** Related notes are marked with a distinct icon or badge (e.g., "🔗 Connected")

---

## Story 6.6: Add Search Results Sorting and Filtering

As a user,
I want to sort and filter search results by date, relevance, or type,
So that I can prioritize the most important matches.

**Acceptance Criteria:**

**Given** Search results are displayed
**When** I want to change the sort order
**Then** Dropdown or buttons allow sorting by: Relevance (default), Date (newest first), Date (oldest first), Note Type
**And** Sorting updates results instantly without re-executing the search query
**And** Filter dropdown allows filtering by note type: All / Accomplishment / Idea / Problem / Meeting / Task
**And** Filter updates results instantly
**And** Sort and filter selections persist during the session (stored in browser state)
**And** Sort/filter UI is keyboard-accessible (Tab to navigate, Enter to select)

---
