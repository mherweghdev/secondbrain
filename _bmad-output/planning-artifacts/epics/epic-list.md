# Epic List

## Epic 0: Project Infrastructure & Foundation
**Goal:** L'infrastructure de développement est prête pour construire avec qualité (TDD, CI/CD, tests)

**User Value:** Bien que sans valeur utilisateur directe, cette fondation technique garantit la qualité du code et permet le TDD (>80% coverage target)

**FRs Covered:** Architecture requirements (Next.js setup, testing infrastructure, CI/CD)

**Key Deliverables:**
- Initialize Next.js avec create-next-app (TypeScript, Tailwind, App Router, Turbopack)
- Setup Jest + React Testing Library + test utilities
- Configure PostgreSQL test database (Docker Compose)
- Setup GitHub Actions CI (lint, typecheck, tests)
- Pre-commit hooks (Husky + lint-staged)
- ADR documentation (Architecture Decision Records)

**NFRs Addressed:** Foundation pour tous les NFRs de qualité et performance

---

## Epic 1: Note Capture & Basic Storage
**Goal:** Les utilisateurs peuvent capturer des notes rapidement en markdown et les voir listées avec authentification sécurisée

**User Value:** Capture ultra-rapide de notes en réunion avec la garantie qu'elles sont sauvegardées instantanément

**FRs Covered:** FR-1.1, FR-1.2, FR-1.3, FR-8.1, FR-8.2, FR-8.3, FR-9.3

**Key Deliverables:**
- Supabase Auth setup (email/password, login/logout, session management)
- Markdown editor avec CodeMirror 6 + syntax highlighting
- Auto-save (debounced 500ms) avec indicateur visible
- Note list avec filtres (date, status: raw/refined/archived)
- PostgreSQL + Prisma setup (notes table, metadata table)
- API security (rate limiting, input validation, CORS)

**User Journey:** Journey 1 (Morning Work Capture) - "Je capture mes notes en pleine réunion, elles sont sauvegardées instantanément"

**NFRs Critical:** NFR-P2 (Capture <1s), NFR-R1 (Zero data loss), NFR-S1 (HTTPS), NFR-S3 (Auth/Session)

---

## Epic 10: Keyboard-First UX & Responsive Design
**Goal:** Les utilisateurs peuvent naviguer l'app entièrement au clavier (power user) et consulter sur mobile/tablette

**User Value:** Expérience "hotkey heaven" pour power users + consultation digest sur mobile

**FRs Covered:** UX Requirements (Keyboard shortcuts, responsive design, markdown-native)

**Key Deliverables:**
- Global keyboard shortcuts (Ctrl+N, Ctrl+R, Ctrl+/, Ctrl+D)
- Navigation shortcuts (↑/↓, Enter, Esc, Tab)
- Cheatsheet accessible (? ou Ctrl+?)
- Responsive layouts (desktop/tablet/mobile breakpoints)
- Touch-optimized mobile views (digest consultation, search)
- Markdown formatting shortcuts (Ctrl+B, Ctrl+I, Ctrl+K)

**User Journey:** Transversal - "Je n'ai jamais besoin de toucher la souris, tout est accessible par shortcuts"

**UX Principles:** Speed as feature, keyboard-first/mouse-optional, calm productivity

---

## Epic 2: Note Editing & Archive Management
**Goal:** Les utilisateurs peuvent modifier leurs notes capturées et archiver (soft delete) les notes non pertinentes

**User Value:** Flexibilité pour corriger/ajuster les notes et nettoyer sans perdre de données

**FRs Covered:** FR-1.4, FR-1.5

**Key Deliverables:**
- Edit note interface (inline editing with auto-save)
- Archive functionality (soft delete, status = archived)
- Restore archived notes (move back to active)
- Note history tracking (modification timestamps)
- Audit trail for edits (FR-7.2 partial implementation)

**User Journey:** Journey 2 (Friday Refinement) - "Je peux éditer mes notes pendant le raffinage et archiver celles qui ne sont plus pertinentes"

**NFRs Critical:** NFR-R1 (Zero data loss), NFR-R4 (Transaction integrity)

---

## Epic 3: Tier-1 Local Analysis & Suggestions
**Goal:** Le système enrichit automatiquement les notes avec des suggestions locales (keywords, type, connexions basiques)

**User Value:** Suggestions instantanées qui accélèrent le raffinage sans coût API

**FRs Covered:** FR-2.1, FR-2.2, FR-2.3, FR-2.4

**Key Deliverables:**
- Keyword extraction engine (hashtags, @mentions, entities via regex)
- Note type classification (Accomplishment/Idea/Problem/Meeting/Task based on patterns)
- Basic connection detection (entity matching across notes)
- Local processing <100ms (no API calls)
- Suggestion storage in database (for Refinement UI)

**User Journey:** Journey 2 (Friday Refinement) - "Les suggestions de type et tags me font gagner du temps"

**NFRs Critical:** FR-2.4 (Latency <100ms), NFR-P5 (API <500ms)

---

## Epic 5: Friday Refinement Workflow
**Goal:** Les utilisateurs peuvent raffiner leurs notes une par une avec validation/ajustement des suggestions

**User Value:** Transformer 8-10 notes brutes en connaissances structurées en 30 minutes

**FRs Covered:** FR-4.1, FR-4.2, FR-4.3, FR-4.4, FR-4.5, FR-4.6

**Key Deliverables:**
- Refinement mode UI (one note at a time, sequential)
- Suggestion display (inline: type, tags, connections from Tier-1)
- Accept/reject/modify suggestion controls
- Metadata editor (type dropdown, tags input, connections list, severity)
- Progress tracking (e.g., "2 of 8 notes refined")
- Session timing display (elapsed time, estimated remaining)

**User Journey:** Journey 2 (Friday Afternoon Refinement) - "Je raffine mes 8 notes en 30 minutes, les métadonnées sont validées"

**NFRs Critical:** NFR-P3 (Refinement UI <2s), FR-4.6 (Target <30 min session)

---

## Epic 7: Weekly Digest Generation
**Goal:** Le système génère automatiquement un digest professionnel chaque vendredi avec accomplissements, challenges, action items

**User Value:** Rapport hebdomadaire prêt lundi matin, partageable avec le chef sans édition

**FRs Covered:** FR-5.1, FR-5.2, FR-5.3, FR-5.4, FR-10.2

**Key Deliverables:**
- Digest generation job (Bull Queue, scheduled Friday evening via cron)
- Digest structure algorithm (group by note type: Accomplishments/Challenges/Actions)
- Insights generation (optional: patterns detected like "5 features shipped this week")
- Markdown formatting (professional tone, clean structure, intro/summary)
- Digest storage (timestamped, e.g., "2026-01-13-digest.md")
- In-app digest viewer (markdown display with history navigation)

**User Journey:** Journey 3 (Monday Morning Digest) - "Mon digest est prêt lundi matin, je peux l'envoyer tel quel"

**NFRs Critical:** NFR-P4 (Digest generation <30 min), FR-5.4 (Professional quality = THE wow moment)

---

## Epic 8: Email Digest Delivery (Phase 2)
**Goal:** Les utilisateurs peuvent envoyer automatiquement le digest par email le lundi matin

**User Value:** Communication automatisée avec le leadership, zéro effort manuel

**FRs Covered:** FR-9.2, NFR-I1, NFR-I2, NFR-I3

**Key Deliverables:**
- Email service integration (SMTP configuration: Sendgrid/Mailgun/AWS SES)
- HTML email template generation (markdown → HTML with professional styling)
- Scheduled sending (Bull Queue cron job, Monday 7am default)
- Retry mechanism (up to 3 retries with exponential backoff over 2 hours)
- Email format validation (non-empty content, valid HTML, recipient email valid)
- Configurable send time (user timezone support)

**User Journey:** Journey 3 (Monday Morning Communication) - "Le digest est envoyé automatiquement à 7h à mon chef"

**NFRs Critical:** NFR-I1 (99% delivery), NFR-I2 (Timing configurable), NFR-I3 (Format validation)

**Note:** Déféré à Phase 2 selon PRD

---

## Epic 4: Tier-2 Claude API Enrichment
**Goal:** Le système enrichit les notes avec des suggestions IA avancées (connexions sémantiques, métadonnées riches)

**User Value:** Suggestions IA qui découvrent des connexions sémantiques invisibles à l'analyse locale

**FRs Covered:** FR-3.1, FR-3.2, FR-3.3, FR-3.4, FR-9.1

**Key Deliverables:**
- Redis + Bull Queue setup (async job processing infrastructure)
- Claude API integration (authenticate, send note + Tier-1 results, receive enrichment)
- Batch processing pipeline (queue all pending notes, process overnight)
- Token counting + cost tracking (monthly budget alerts, stay <$5/month)
- Error handling + retries (3x retry with exponential backoff, graceful degradation to Tier-1)
- Tier-2 suggestion storage (semantic connections, refined metadata)

**User Journey:** Journey 2 (Friday Refinement) - "Les suggestions IA identifient des connexions sémantiques que je n'avais pas vues"

**NFRs Critical:** NFR-R5 (Graceful degradation if API fails), NFR-Sc2 (Queue 100+ jobs/h), FR-3.3 (Cost <$5/month)

---

## Epic 6: Search & Connection-Aware Retrieval
**Goal:** Les utilisateurs peuvent retrouver rapidement leurs notes par keyword/tag avec connexions visibles

**User Value:** Recherche <5 secondes avec résultats pertinents + notes liées (serendipity discovery)

**FRs Covered:** FR-6.1, FR-6.2, FR-6.3, FR-6.4, FR-6.5

**Key Deliverables:**
- Search interface UI (textbox with instant search, results display)
- PostgreSQL Full-Text Search (FTS) setup (tsvector indexes on note content + metadata)
- Keyword search implementation (content + tags + connections)
- Tag-based search (#auth, @ClientX specific filtering)
- Connection-aware results (direct matches + semantically related notes marked as "connected")
- Results sorting (date/relevance/type)
- Click to open note (seamless navigation)

**User Journey:** Journey 4 (Wednesday Search) - "Je recherche 'ClientX' et trouve toutes les notes liées en <5 secondes"

**NFRs Critical:** NFR-P1 (Search <5 sec - CRITICAL SUCCESS METRIC), NFR-Sc1 (10+ users ready)

---

## Epic 9: Data Integrity & Backup System
**Goal:** Les utilisateurs ont la garantie que leurs données sont sauvegardées, sécurisées et récupérables

**User Value:** Confiance totale dans le système - zéro perte de données, toujours récupérable

**FRs Covered:** FR-7.1, FR-7.2, FR-7.3, FR-7.4, FR-7.5

**Key Deliverables:**
- Daily automated backups (cron job 2am UTC, full PostgreSQL dump)
- Backup encryption (AES-256, keys stored separately)
- Backup verification (automated integrity checks weekly)
- Audit trail system (immutable log: all create/edit/refine/search actions with timestamps)
- Transaction safety (PostgreSQL ACID transactions for all state changes)
- Data recovery mechanisms (point-in-time recovery, restore from backup)
- Encryption at rest (database + backup files)

**User Journey:** Transversal - "Je sais que mes notes ne seront jamais perdues, le système est fiable"

**NFRs Critical:** NFR-R1 (Zero data loss - ZERO TOLERANCE), NFR-R2 (Daily backups 100% completion), NFR-R3 (RTO 24h), NFR-S2 (Encryption at rest), NFR-S4 (Secure backup storage)

---
