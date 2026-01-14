# Epic 9: Data Integrity & Backup System

**Goal:** Les utilisateurs ont la garantie que leurs données sont sauvegardées, sécurisées et récupérables

## Story 9.1: Implement Daily Automated Backups

As a developer,
I want to schedule daily automated backups of the PostgreSQL database,
So that data can be recovered in case of failure or corruption.

**Acceptance Criteria:**

**Given** The application is deployed with PostgreSQL
**When** Daily backup job runs at 2am UTC (off-peak)
**Then** Full PostgreSQL database dump is created using pg_dump
**And** Backup includes all tables: notes, metadata, audit_trail, digests, users, api_usage
**And** Backup is compressed (gzip) to save storage space
**And** Backup filename includes timestamp: "backup-YYYY-MM-DD-HHmmss.sql.gz"
**And** Backup is stored in a designated backup directory (initially same server, Phase 2 off-site)
**And** Backup job completes in <10 minutes (typical database size)
**And** Backup job logs success/failure to application logs
**And** Backup job achieves 100% completion rate (NFR-R2)

---

## Story 9.2: Encrypt Backups with AES-256

As a developer,
I want to encrypt backup files with AES-256 before storage,
So that sensitive note data is protected even if backup files are compromised.

**Acceptance Criteria:**

**Given** A database backup has been created
**When** The backup job completes compression
**Then** Backup file is encrypted using AES-256 encryption
**And** Encryption key is stored separately from backup files (environment variable or secrets manager)
**And** Encrypted backup filename includes .enc extension: "backup-YYYY-MM-DD-HHmmss.sql.gz.enc"
**And** Encryption process completes in <2 minutes
**And** Encrypted backup can be decrypted using the same encryption key (tested monthly)
**And** Unencrypted backup file is deleted after encryption succeeds
**And** Encryption meets NFR-S4 (secure backup storage)

---

## Story 9.3: Implement Backup Verification Job

As a developer,
I want to verify backup integrity automatically after each backup,
So that corrupted backups are detected and can be re-run.

**Acceptance Criteria:**

**Given** A backup has been created and encrypted
**When** Backup verification job runs (immediately after backup)
**Then** Verification decrypts the backup file using the encryption key
**And** Verification extracts the backup archive (gunzip)
**And** Verification performs checksum validation (compare file size, check for corruption)
**And** Verification attempts to restore backup to a test database (optional: weekly full restore test)
**And** If verification fails, backup job is marked as failed and re-run
**And** If verification succeeds, backup is marked as valid in backup metadata table
**And** Verification completes in <5 minutes
**And** Verification logs success/failure to application logs

---

## Story 9.4: Create Immutable Audit Trail

As a developer,
I want to log all user actions (create/edit/refine/search/archive) in an immutable audit trail,
So that data changes can be traced and recovered if needed.

**Acceptance Criteria:**

**Given** A user performs an action in the application
**When** The action modifies data (create note, edit note, refine note, archive note)
**Then** Audit trail entry is created in the audit_trail table
**And** Audit entry includes: id, noteId (FK), userId (FK), action (enum: create/edit/refine/archive/restore/delete), timestamp, previousValue (jsonb snapshot), newValue (jsonb snapshot)
**And** Audit trail entries are append-only (no updates or deletes allowed)
**And** Audit trail entries are created within the same transaction as the action (atomic)
**And** Audit trail supports point-in-time recovery (can revert note to previous state)
**And** Audit trail is queryable for user activity reports (future use)
**And** Audit trail logs search queries (for analytics, not tied to noteId)

---

## Story 9.5: Implement Transaction Safety (ACID Compliance)

As a developer,
I want all multi-step operations to use database transactions,
So that data integrity is maintained and rollback occurs on failure.

**Acceptance Criteria:**

**Given** A multi-step operation occurs (e.g., create note + Tier-1 analysis + metadata save)
**When** Any step in the operation fails
**Then** Entire operation is rolled back (no partial state changes)
**And** Database transaction is used for: create note, update note, refine note, archive note, generate digest
**And** Prisma transaction API is used for multi-model operations ($transaction)
**And** Transaction isolation level is set to READ COMMITTED (default)
**And** Transaction timeout is configured to 5 seconds (fail fast)
**And** Transaction rollback is logged with full error details
**And** Zero orphaned or inconsistent data states occur (NFR-R4)
**And** ACID compliance is validated via automated tests

---

## Story 9.6: Implement Data Recovery Mechanisms

As a developer,
I want to provide mechanisms to recover accidentally deleted (archived) notes and revert to previous versions,
So that users can restore data with RTO of 4 hours.

**Acceptance Criteria:**

**Given** A user needs to recover data
**When** Recovery is requested (via admin interface or support)
**Then** Archived notes can be restored via "Restore" button (see Story 2.3)
**And** Previous versions of notes can be restored from audit trail (point-in-time recovery)
**And** Recovery process queries audit_trail for previousValue snapshot
**And** Recovery restores note content, metadata, and status from snapshot
**And** Recovery action is logged in audit trail as "restore" action
**And** Full database restore from backup can be performed in <24 hours (NFR-R3 RTO)
**And** Recovery documentation is created for admins (runbook in docs/)

---
