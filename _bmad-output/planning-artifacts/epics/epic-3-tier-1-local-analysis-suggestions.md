# Epic 3: Tier-1 Local Analysis & Suggestions

**Goal:** Le système enrichit automatiquement les notes avec des suggestions locales (keywords, type, connexions basiques)

## Story 3.1: Extract Keywords (Hashtags, @mentions, Entities)

As a user,
I want the system to automatically extract hashtags, @mentions, and entities from my notes,
So that I can quickly see key topics without manually tagging.

**Acceptance Criteria:**

**Given** I have created a note with content containing hashtags (#auth), @mentions (@ClientX), and entities (company names, proper nouns)
**When** The note is saved (triggered on auto-save)
**Then** System extracts all hashtags using regex pattern (#[a-zA-Z0-9_]+)
**And** System extracts all @mentions using regex pattern (@[a-zA-Z0-9_]+)
**And** System extracts entities (proper nouns, company names) using basic NLP patterns or simple heuristics (capitalized words not at sentence start)
**And** Extracted keywords are stored in the metadata table (tags field as array)
**And** Extraction completes within 100ms (FR-2.4 latency requirement)
**And** Extracted keywords are displayed in the note list as badges/chips
**And** Keywords are case-insensitive for matching purposes

---

## Story 3.2: Classify Note Type Automatically

As a user,
I want the system to suggest a note type (Accomplishment/Idea/Problem/Meeting/Task),
So that I have a starting point for refinement without manually categorizing.

**Acceptance Criteria:**

**Given** I have created a note with content indicating a specific type
**When** The note is saved and Tier-1 analysis runs
**Then** System classifies note type based on keyword patterns:
**And** "Accomplishment" if content contains: "shipped", "completed", "launched", "finished", "achieved"
**And** "Idea" if content contains: "idea", "concept", "what if", "could we", "brainstorming"
**And** "Problem" if content contains: "issue", "bug", "problem", "error", "failed", "broken"
**And** "Meeting" if content contains: "meeting with", "discussed", "agenda", "attendees"
**And** "Task" if content contains: "TODO", "need to", "action item", "next steps", "follow up"
**And** Default type is "Uncategorized" if no patterns match
**And** Suggested type is stored in metadata table (noteType field)
**And** Classification completes within 100ms (FR-2.4)
**And** Suggested type is displayed in refinement UI for user validation

---

## Story 3.3: Detect Basic Connections Between Notes

As a user,
I want the system to suggest connections to other notes that mention the same entities,
So that I can discover related information during refinement.

**Acceptance Criteria:**

**Given** I have multiple notes with overlapping entities or hashtags
**When** Tier-1 analysis runs on a new note
**Then** System searches existing notes for matching entities (case-insensitive)
**And** System searches existing notes for matching hashtags and @mentions
**And** System identifies notes with at least 1 matching entity/tag as "connected"
**And** Connections are stored in metadata table (connections field as jsonb: [{noteId, matchedEntities: []}])
**And** Connection detection completes within 100ms (FR-2.4)
**And** Basic connections are displayed in refinement UI: "This note mentions ClientX - see 3 related notes"
**And** Clicking a connection navigates to the related note

---

## Story 3.4: Store Tier-1 Suggestions in Database

As a developer,
I want to persist Tier-1 suggestions (keywords, type, connections) in the database,
So that they are available for display in the refinement UI.

**Acceptance Criteria:**

**Given** Tier-1 analysis has extracted keywords, classified type, and detected connections
**When** Analysis completes
**Then** Metadata record is created or updated in the metadata table with noteId (FK)
**And** Metadata includes: extractedAt (timestamp), noteType (suggested type), tags (array of extracted keywords), connections (jsonb array of related note IDs)
**And** Metadata is stored atomically with note creation/update (transaction)
**And** Metadata can be queried efficiently for refinement UI display
**And** Metadata is versioned (can track changes if note is re-analyzed)
**And** Storage operation completes within 100ms total (part of FR-2.4 latency budget)

---

## Story 3.5: Display Tier-1 Suggestions in Note List

As a user,
I want to see Tier-1 suggestions (type, tags) in the note list,
So that I can quickly understand my notes at a glance.

**Acceptance Criteria:**

**Given** Notes have been analyzed with Tier-1 suggestions
**When** I view the note list
**Then** Each note displays suggested type as a colored badge (Accomplishment = green, Problem = red, Idea = blue, Meeting = yellow, Task = orange)
**And** Each note displays extracted tags as small chips/badges (max 3 tags shown, "..." if more)
**And** Clicking a tag filters the note list to show only notes with that tag
**And** Hovering over a note shows full metadata tooltip (all tags, connections count)
**And** Note list loads with suggestions in <2 seconds (NFR-P3)
**And** Suggestions are read-only in list view (editable only in refinement mode)

---
