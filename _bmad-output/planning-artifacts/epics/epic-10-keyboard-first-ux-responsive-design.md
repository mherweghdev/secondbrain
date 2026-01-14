# Epic 10: Keyboard-First UX & Responsive Design

**Goal:** Les utilisateurs peuvent naviguer l'app entièrement au clavier (power user) et consulter sur mobile/tablette

## Story 10.1: Implement Global Keyboard Shortcuts

As a power user,
I want to use keyboard shortcuts to navigate the application,
So that I can work efficiently without touching the mouse.

**Acceptance Criteria:**

**Given** I am authenticated and on any page of the application
**When** I press a global keyboard shortcut
**Then** Ctrl+N (or Cmd+N on Mac) opens the new note editor
**And** Ctrl+R (or Cmd+R on Mac) opens refinement mode
**And** Ctrl+/ (or Cmd+/ on Mac) opens search interface
**And** Ctrl+D (or Cmd+D on Mac) navigates to digest history
**And** Esc key closes modals, cancels actions, or returns to previous view
**And** Shortcuts work globally across all pages
**And** Shortcuts are prevented from conflicting with browser defaults

---

## Story 10.2: Create Keyboard Cheatsheet Component

As a user,
I want to view a cheatsheet of all keyboard shortcuts,
So that I can quickly learn and reference hotkeys.

**Acceptance Criteria:**

**Given** I am using the application
**When** I press ? or Ctrl+? (or Cmd+?)
**Then** A modal/overlay displays the keyboard shortcuts cheatsheet
**And** Cheatsheet is organized by category: Global, Navigation, Editing, Refinement, Search
**And** Each shortcut shows the key combination and description (e.g., "Ctrl+N - Create new note")
**And** Cheatsheet is responsive and readable on desktop/tablet/mobile
**And** Pressing Esc or clicking outside closes the cheatsheet
**And** Cheatsheet can also be accessed via Help menu or footer link
**And** Shortcuts display platform-specific keys (Ctrl on Windows/Linux, Cmd on Mac)

---

## Story 10.3: Add Markdown Formatting Shortcuts

As a user,
I want to use keyboard shortcuts to format markdown text,
So that I can write faster without manually typing markdown syntax.

**Acceptance Criteria:**

**Given** I am editing a note in the markdown editor
**When** I press formatting shortcuts
**Then** Ctrl+B (or Cmd+B) wraps selected text in **bold** syntax
**And** Ctrl+I (or Cmd+I) wraps selected text in *italic* syntax
**And** Ctrl+K (or Cmd+K) prompts for URL and inserts [selected text](url) link syntax
**And** Ctrl+Shift+C (or Cmd+Shift+C) wraps selected text in `inline code` syntax
**And** Shortcuts work on selected text or insert syntax at cursor if no selection
**And** Undo (Ctrl+Z / Cmd+Z) reverts formatting changes
**And** Formatting shortcuts are documented in the keyboard cheatsheet

---

## Story 10.4: Implement Responsive Layouts (Desktop/Mobile/Tablet)

As a user,
I want the application to adapt to different screen sizes,
So that I can capture notes on desktop and consult digests on mobile/tablet.

**Acceptance Criteria:**

**Given** I access the application on different devices
**When** I view the application on desktop (>1024px width)
**Then** Note editor and list are displayed side-by-side (two-column layout)
**And** Full keyboard shortcuts and navigation are available
**When** I view the application on tablet (768px-1024px)
**Then** Layout switches to single-column with collapsible sidebar
**And** Touch-optimized buttons for primary actions (larger tap targets)
**When** I view the application on mobile (<768px)
**Then** Layout is optimized for single-column vertical scrolling
**And** Digest consultation and search are touch-optimized
**And** Note capture is functional but keyboard shortcuts may be unavailable
**And** All layouts maintain responsive typography (rem/em units)
**And** Breakpoints are implemented using Tailwind CSS utilities

---
