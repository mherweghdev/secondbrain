# Epic 5: Friday Refinement Workflow

**Goal:** Les utilisateurs peuvent raffiner leurs notes une par une avec validation/ajustement des suggestions

## Story 5.1: Create Refinement Mode UI (One Note at a Time)

As a user,
I want to enter refinement mode and review notes one at a time,
So that I can validate or adjust suggestions in a focused workflow.

**Acceptance Criteria:**

**Given** I have notes with status = "raw" (unrefined)
**When** I press Ctrl+R (or Cmd+R) or click "Refine Notes" button
**Then** Refinement mode opens with the first unrefined note displayed
**And** Note content is displayed in a read-only or editable markdown view
**And** Tier-1 suggestions are displayed: suggested type, tags, connections
**And** Navigation controls show "Previous" and "Next" buttons (or ↑/↓ arrow keys)
**And** I cannot skip notes - must process sequentially (FR-4.1)
**And** If no unrefined notes exist, show "All notes refined - great job!"
**And** Refinement mode UI loads in <2 seconds (NFR-P3)

---

## Story 5.2: Display and Validate Suggestions (Accept/Reject/Modify)

As a user,
I want to review Tier-1 suggestions and accept, reject, or modify them,
So that I can quickly validate metadata without starting from scratch.

**Acceptance Criteria:**

**Given** I am in refinement mode viewing a note with Tier-1 suggestions
**When** I review the suggested type, tags, and connections
**Then** I can accept the suggested type by clicking "Accept" or pressing Enter
**And** I can reject the suggested type and select a different one from a dropdown
**And** I can accept all suggested tags by clicking "Accept All Tags"
**And** I can remove individual tags by clicking "X" on each tag chip
**And** I can add new tags by typing in a tag input field (comma-separated or Enter to add)
**And** I can accept suggested connections by clicking "Accept"
**And** I can remove individual connections by clicking "X" on each connection
**And** All modifications are staged (not saved yet) until I click "Validate & Save Note"

---

## Story 5.3: Enable Note Editing During Refinement

As a user,
I want to edit the note content during refinement,
So that I can fix typos or clarify details as my last chance before finalizing.

**Acceptance Criteria:**

**Given** I am in refinement mode viewing a note
**When** I click "Edit Note" or press Ctrl+E (or Cmd+E)
**Then** Note content becomes editable in a markdown editor (same as Story 1.3)
**And** I can modify the note text (fix typos, add details, clarify)
**And** Auto-save is disabled during refinement (explicit save required)
**And** I can save edited content by clicking "Save Edits" or pressing Ctrl+S (or Cmd+S)
**And** Note's updatedAt timestamp is updated on save
**And** Edited content is reflected immediately in the refinement view
**And** I can cancel edits by pressing Esc (revert to original content)

---

## Story 5.4: Confirm Metadata and Save Note

As a user,
I want to finalize metadata (type, tags, connections) and save the refined note,
So that the note moves from "raw" to "refined" status.

**Acceptance Criteria:**

**Given** I have reviewed and optionally modified suggestions for a note
**When** I click "Validate & Save Note" or press Ctrl+Enter (or Cmd+Enter)
**Then** Note status is updated from "raw" to "refined"
**And** Metadata (type, tags, connections) is saved to the database (metadata table)
**And** Audit trail logs the refinement action with timestamp and userId
**And** Transaction is atomic (NFR-R4) - rollback on failure
**And** Save operation completes in <500ms (NFR-P5)
**And** Refinement UI advances to the next unrefined note automatically
**And** If this was the last note, show "All notes refined" completion message

---

## Story 5.5: Display Refinement Progress Tracking

As a user,
I want to see my refinement progress (e.g., "2 of 8 notes refined"),
So that I know how much work remains and stay motivated.

**Acceptance Criteria:**

**Given** I am in refinement mode
**When** I view the refinement UI
**Then** Progress indicator shows "X of Y notes refined" at the top of the screen
**And** Progress bar displays percentage completed (e.g., 25% if 2 of 8)
**And** Progress updates in real-time as I complete each note
**And** I can see the list of all unrefined notes (with titles/first line) in a sidebar or dropdown
**And** Clicking a note in the list navigates to that specific note (override sequential order if needed)
**And** I can exit refinement mode anytime by clicking "Exit" or pressing Esc
**And** Progress is saved - I can resume refinement later from where I left off

---

## Story 5.6: Track Refinement Session Timing

As a user,
I want to see how long my refinement session has taken,
So that I can stay within my 30-minute target for a typical week.

**Acceptance Criteria:**

**Given** I have started refinement mode
**When** I view the refinement UI
**Then** Timer displays elapsed time (e.g., "8 minutes 23 seconds")
**And** Timer starts when refinement mode is opened
**And** Timer pauses if I exit refinement mode and resumes when I return
**And** Timer resets when all notes are refined (session complete)
**And** Estimated remaining time is displayed based on average time per note (e.g., "~12 minutes remaining")
**And** If session exceeds 30 minutes, show a gentle reminder: "You've been refining for 32 minutes - consider taking a break"
**And** Session timing is tracked in the database for analytics (future use)

---
