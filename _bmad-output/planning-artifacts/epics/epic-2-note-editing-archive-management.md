# Epic 2: Note Editing & Archive Management

**Goal:** Les utilisateurs peuvent modifier leurs notes capturées et archiver (soft delete) les notes non pertinentes

## Story 2.1: Enable Inline Note Editing

As a user,
I want to edit any existing note's content,
So that I can fix typos or add additional details after initial capture.

**Acceptance Criteria:**

**Given** I am viewing a note in the note list
**When** I click on a note to open it
**Then** The note opens in the markdown editor with existing content loaded
**And** I can modify the content using the same editor as note creation
**And** Auto-save is triggered after 500ms of inactivity (same as Story 1.4)
**And** Note's updatedAt timestamp is updated on each save
**And** Visual indicator shows "Saved" when changes are persisted
**And** I can close the editor and return to the note list
**And** Edited note reflects changes immediately in the list view

---

## Story 2.2: Implement Archive Functionality (Soft Delete)

As a user,
I want to archive notes that are no longer relevant,
So that my active note list stays clean without permanently deleting data.

**Acceptance Criteria:**

**Given** I am viewing a note in the editor or list
**When** I click "Archive" button or press Ctrl+Shift+A (or Cmd+Shift+A)
**Then** Note status is changed to "archived" (soft delete, not hard delete)
**And** Archived note is removed from the active note list
**And** Archived note remains in the database with status = archived
**And** Archived note is still searchable and viewable if explicitly accessed
**And** Audit trail logs the archive action with timestamp and userId
**And** Transaction is atomic (NFR-R4) - rollback on failure
**And** Archive action completes in <500ms (NFR-P5)

---

## Story 2.3: Add Restore Archived Notes

As a user,
I want to restore archived notes back to active status,
So that I can recover notes I archived by mistake.

**Acceptance Criteria:**

**Given** I have archived notes
**When** I navigate to the "Archived Notes" filter in the note list
**Then** All archived notes are displayed with "Restore" button
**And** I can click "Restore" to move note back to active status
**And** Restored note changes status from "archived" to "raw" (or previous status before archive)
**And** Restored note reappears in the active note list
**And** Audit trail logs the restore action with timestamp and userId
**And** Restore action is atomic (transaction rollback on failure)
**And** Restore completes in <500ms

---

## Story 2.4: Track Note Edit History

As a user,
I want to see when a note was last modified,
So that I can understand the timeline of my note editing.

**Acceptance Criteria:**

**Given** I have edited a note multiple times
**When** I view the note in the editor or list
**Then** Note displays "Last modified: [timestamp]" (relative time, e.g., "2 hours ago")
**And** Note metadata includes both createdAt and updatedAt timestamps
**And** Audit trail stores every edit action with timestamp (FR-7.2 partial implementation)
**And** Audit trail is immutable (cannot be edited or deleted by user)
**And** Audit trail logs: action (create/edit/archive/restore), timestamp, userId, noteId
**And** Future story can implement "view edit history" to see all past versions

---
