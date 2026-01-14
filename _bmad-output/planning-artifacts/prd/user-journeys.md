# User Journeys

## Journey 1: Matthieu - Morning Work Capture

**Opening Scene:**
Tuesday, 10:00 AM. Matthieu sits in a client meeting (ClientX). Notes scattered across different capture methods for years—he's tired of losing context.

**The Journey:**

1. **Mid-meeting note capture (10:15)**
   - Opens secondbrain in browser tab
   - New note interface appears: clean markdown editor with syntax highlighting
   - Types: "ClientX meeting: discussed auth refactor timeline. Pushing for Q2. Concerns: legacy API compatibility."
   - Syntax highlighting makes structure visible (bold, headers)
   - Saves instantly - note appears in capture queue
   - **Emotion:** Relieved - note is captured, safe, fast. No friction.

2. **Afternoon feature completion (14:30)**
   - Feature Y finally shipped after 3h of work
   - Opens secondbrain (still in browser tab)
   - New note: "✅ Feature Y shipped. Took 3h (expected 4h). Refactored cache layer. Ready for review."
   - Note about specific accomplishment, timing, and impact
   - Saves - added to queue
   - **Emotion:** Satisfaction - accomplishment recorded, won't be forgotten

3. **Late afternoon problem discovery (16:45)**
   - Auth system bug found: "Bug: Auth tokens expiring early in high-load scenarios. Affects test env only. Needs investigation."
   - Quick note capture in secondbrain
   - **Emotion:** Captured - problem won't disappear, ready for next week's refinement

4. **End of day reflection (17:30)**
   - Closes secondbrain - 3 notes captured during day
   - No editing needed, no organization - just captured as they happened
   - **Emotion:** Natural flow, low friction. Ready for Friday refinement.

**Requirements Revealed:**
- Fast, lightweight capture interface (web-based)
- Syntax highlighting for readability
- Instant save with no confirmation friction
- Notes queued for later refinement
- Support for varied note types (meetings, accomplishments, problems)

---

## Journey 2: Matthieu - Friday Afternoon Refinement

**Opening Scene:**
Friday, 15:00. Matthieu blocks 30 minutes on calendar. Opens secondbrain to transform raw week into structured knowledge.

**The Journey:**

1. **Enter Refinement Mode (15:02)**
   - Clicks "Refine" or "Friday Review" tab
   - System shows: 8 pending notes from the week
   - First note appears: "ClientX meeting: discussed auth refactor timeline..."
   - Suggestions appear alongside the note:
     - **Type:** Meeting Notes (suggested)
     - **Project:** ClientX (suggested)
     - **Tags:** [auth, timeline, Q2] (suggested)
     - **Connections:** "Links to Epic-5 (Auth Refactor) from Jan 5"

2. **Review & Refine First Note (15:05)**
   - Can still edit the note if needed
   - Reviews suggestions: "Yes, Meeting Notes is correct"
   - Adjusts tags: removes "Q2" (already in connection), keeps [auth, timeline, ClientX]
   - Notes the connection to Epic-5: "Yes, this is critical context"
   - Clicks "Validate & Save Note" - note moves to refined queue
   - **Emotion:** Control + clarity. Suggestions help, I decide.

3. **Process Accomplishment Note (15:10)**
   - Next note: "✅ Feature Y shipped..."
   - Suggestions:
     - **Type:** Accomplishment (correct!)
     - **Project:** Feature Y (suggested)
     - **Tags:** [feature, shipped, performance] (suggested, but user updates to [feature-y, shipped, 3h-effort])
     - **Connections:** None found (okay, it's standalone)
   - Clicks "Validate & Save Note"
   - **Emotion:** Quick validation, feeling productive

4. **Process Bug Note (15:15)**
   - Bug note appears with suggestions
   - **Type:** Issue/Problem (suggested correctly)
   - **Project:** Auth Refactor
   - **Tags:** [bug, auth, investigation]
   - **Severity:** Can mark as "blocking" or "medium"
   - Note includes connection hint: "Related to ClientX conversation from Tuesday"
   - Refines and saves
   - **Emotion:** Visibility on problem + context = confidence in next steps

5. **Continue Through Remaining Notes (15:20-15:28)**
   - Repeats process for 5 more notes
   - Some have rich connections, some are standalone
   - One note user decides to archive (meeting note no longer relevant)
   - Archives instead of deleting - can still search if needed
   - **Emotion:** Making sense of the week as you go

6. **Refinement Complete (15:30)**
   - All 8 notes refined, metadata validated
   - System signals: "✅ Refinement complete. Digest generating..."
   - Exit refinement mode - notes now **structured and interconnected**
   - **Emotion:** Done. Week is organized. Ready for insights tomorrow.

**Requirements Revealed:**
- One-by-one note review interface
- Inline suggestion display (type, tags, connections)
- Ability to edit notes during refinement
- Archive functionality (not deletion)
- Ability to accept/reject/modify suggestions
- Visual confirmation of completion
- Metadata enrichment creates interconnected knowledge

---

## Journey 3: Matthieu - Monday Morning Digest & Communication

**Opening Scene:**
Monday, 09:00. Matthieu opens secondbrain to prepare his weekly update for leadership.

**The Journey:**

1. **View Weekly Digest in App (09:05)**
   - Clicks "Digest" tab in secondbrain
   - Sees list of digests: "2026-01-13 (this week)", "2026-01-06", "2025-12-30"
   - This week's digest shows keywords: "Feature Y, Auth, ClientX, 3 shipped, 1 blocker"
   - Clicks to open current digest
   - **Emotion:** Excited to see what the system generated from my raw notes

2. **Review Digest Structure (09:10)**
   - Digest shows:
     - **ACCOMPLISHMENTS** (this week)
       - Feature Y shipped (3h effort)
       - Auth investigation initiated
       - Client meeting prep completed
       - (3 items total)
     - **CHALLENGES** (this week)
       - Auth token bug in test env (needs investigation)
       - ClientX timeline pressure (Q2 deadline)
     - **NEXT WEEK ACTION ITEMS** (Eisenhower matrix)
       - **URGENT+IMPORTANT:** Fix auth token bug, confirm Q2 timeline with ClientX
       - **IMPORTANT:** Continue Feature Z, refactor cache layer
       - **URGENT:** Review PR feedback
       - **NEITHER:** Explore new auth patterns (deferred)

3. **Prepare for Leadership Communication (09:15)**
   - Digest is professional-quality markdown
   - Can copy directly OR click "Email Digest"
   - Email version generates nicely formatted email with:
     - Title: "Weekly Summary: Jan 13-17"
     - Brief intro
     - Accomplishments with impact
     - Challenges with context
     - Action items in Eisenhower matrix format
     - Professional tone, easy to escalate

4. **Send to Leadership (09:18)**
   - Clicks "Send Digest Email"
   - Email sent to manager automatically (or configured email list)
   - **Emotion:** This is THE wow moment. Professional summary, ready to share immediately. No manual compilation needed.**

5. **Archive & Reset (09:20)**
   - Digest marked as "sent"
   - System prepares for next week
   - Digest available in history if needed for reference
   - **Emotion:** Week is documented, communicated, and closed. Confidence in promotion potential.

**Requirements Revealed:**
- Digest display in app (markdown format with metadata)
- Automatic generation Friday → available Monday
- Eisenhower matrix formatting (Urgent/Important quadrants)
- Professional email generation
- Ability to send automatically or manually
- Digest history/archive
- Integration with accomplishments + challenges + next actions from refined notes

---

## Journey 4: Matthieu - Wednesday Search (Contextual Retrieval)

**Opening Scene:**
Wednesday, 11:00. Matthieu needs to remember specifics about ClientX issues from earlier in the week.

**The Journey:**

1. **Conversational Search - Style A (11:05)**
   - Clicks "Chat with secondbrain" or "Ask"
   - Types: "What problems did we hit with ClientX this week?"
   - System (with personality): "Let me check your notes about ClientX..."
   - Returns 2-3 relevant notes:
     - Tuesday meeting: timeline pressure, legacy API concerns
     - Wednesday bug discovery (auth affects ClientX test env)
     - Friday follow-up task: confirm Q2 timeline
   - **Emotion:** System understands context, gives exactly what I asked for

2. **Simple Search - Style B (11:10)**
   - Searches: "auth"
   - Results show all notes tagged/mentioning auth:
     - ClientX meeting (auth refactor discussion)
     - Bug note (auth token expiring)
     - Epic-5 connection (auth refactor epic)
   - Latency: <1 second
   - **Emotion:** Fast, clear results. No noise.

3. **Connection-Based Search - Style C (11:15)**
   - Searches: "ClientX"
   - Results show:
     - Direct mentions: meeting, timeline discussion
     - Connected: Auth bug (affects ClientX test)
     - Related: Q2 action item
   - All notes with metadata visible
   - **Emotion:** System understands my project context, shows connected dots I might have missed

4. **Navigate Between Notes (11:18)**
   - Clicks on auth bug note
   - System shows: "This note connects to ClientX (mentioned in meeting), Epic-5 (related), and next week's action items"
   - Quick navigation to related notes
   - **Emotion:** Knowledge interconnected, can follow threads of context

**Requirements Revealed:**
- Conversational search interface (chat-like)
- Simple keyword/tag search with fast latency (<5 sec)
- Search results show context + connections
- Navigation between connected notes
- System personality/conversational tone
- Support for multiple search styles (natural language, keyword, connection-based)

---

## Journey Requirements Summary

**All four journeys reveal these capability areas:**

1. **Capture Experience**
   - Web-based note creation
   - Syntax highlighting for comfort
   - Fast save (no friction)
   - Support for varied note types

2. **Refinement Experience**
   - One-by-one note review
   - Inline suggestions (type, tags, connections)
   - Ability to edit notes during refinement
   - Archive (not deletion)
   - Suggestion acceptance/rejection/modification
   - Progress tracking (30 min sessions)

3. **Digest Generation & Communication**
   - Automatic digest from refined notes
   - Eisenhower matrix formatting
   - In-app viewing (markdown)
   - Email generation and sending
   - Digest history/archive

4. **Search & Retrieval**
   - Conversational search interface
   - Simple keyword/tag search
   - Connection-aware results
   - Fast latency (<5 sec)
   - System personality

5. **Data Integrity**
   - Archive instead of deletion
   - Complete audit trail (for recovery)
   - Note edit history (optional)
   - All user actions tracked

---
