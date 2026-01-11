# Architecture SecondBrain

**Dernière mise à jour**: 2025-01-10

---

## 🎯 Vue d'ensemble

SecondBrain est une SaaS de knowledge management qui transforme les notes chaotiques en connaissance structurée via IA.

**Principe clé**: Capture ultra-rapide → Agrégation automatique (IA) → Digests intelligents

---

## 🏗️ Stack Technique

### Backend
- **Langage**: Python 3.11+
- **Framework**: FastAPI (async REST API)
- **Base de données**: PostgreSQL 14+
- **ORM**: SQLAlchemy 2.0 (async)
- **Validation**: Pydantic v2
- **Tests**: pytest + pytest-cov + pytest-asyncio
- **Linting**: Ruff + Black + mypy
- **Logging**: structlog

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Langage**: TypeScript (strict mode)
- **UI**: React 18 + TailwindCSS + shadcn/ui
- **State**: React hooks (useState, useEffect, custom hooks)
- **Tests**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

### Infrastructure (futur)
- **Hosting**: Railway ou Render (backend + DB)
- **Frontend**: Vercel
- **IA**: Claude API (Anthropic) pour digests
- **CI/CD**: GitHub Actions

---

## 📁 Structure du Projet

```
secondbrain/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── notes.py       # Endpoints notes
│   │   │       └── users.py       # Endpoints users
│   │   ├── core/
│   │   │   ├── config.py         # Settings (Pydantic)
│   │   │   ├── database.py       # DB connection
│   │   │   ├── deps.py           # FastAPI dependencies
│   │   │   └── logging.py        # structlog config
│   │   ├── models/
│   │   │   ├── note.py           # SQLAlchemy Note model
│   │   │   └── user.py           # SQLAlchemy User model
│   │   ├── schemas/
│   │   │   ├── note.py           # Pydantic Note schemas
│   │   │   └── user.py           # Pydantic User schemas
│   │   ├── services/
│   │   │   ├── note_service.py   # Business logic notes
│   │   │   └── digest_service.py # IA digest generation
│   │   └── main.py               # FastAPI app entry point
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── api/
│   │   └── services/
│   ├── alembic/                  # DB migrations
│   ├── .env.example
│   ├── pyproject.toml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/          # Route group auth
│   │   │   ├── notes/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── NoteCard.tsx
│   │   │   └── NoteList.tsx
│   │   └── lib/
│   │       ├── api.ts           # API client
│   │       └── utils.ts
│   ├── __tests__/
│   ├── .env.local.example
│   ├── package.json
│   └── next.config.js
├── .claude/
│   ├── rules/                   # Development rules
│   └── context/                 # Second cerveau (ici)
├── docker-compose.yml
└── README.md
```

---

## 🗄️ Schéma de Base de Données (Initial MVP)

### Table: `users`
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `notes`
```sql
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, archived, deleted
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);
```

### Table: `digests` (futur, V2)
```sql
CREATE TABLE digests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    summary TEXT NOT NULL,           -- Résumé IA
    themes JSONB,                    -- Thèmes détectés
    actions JSONB,                   -- Actions identifiées
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔄 Data Flow

### 1. Capture Rapide (User Story US-001)

```
User (Frontend)
  → POST /api/v1/notes { content: "..." }
  → FastAPI Router (notes.py)
  → NoteService.create_note()
  → SQLAlchemy insert into notes table
  → PostgreSQL
  → Return Note object
  → Pydantic schema validation
  → JSON response to Frontend
  → Display success to User
```

### 2. Digest Hebdomadaire (User Story US-002, futur)

```
Cron Job (vendredi 17h)
  → DigestService.generate_weekly_digest(user_id)
  → Fetch notes from last 7 days (SQL query)
  → Call Claude API with notes content
  → Parse IA response (summary, themes, actions)
  → Save to digests table
  → Send email to user
  → Mark as sent
```

---

## 🚀 Déploiement (V1 - MVP)

### Développement Local

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Production (futur)

- **Backend**: Railway (auto-deploy depuis main)
- **Frontend**: Vercel (auto-deploy depuis main)
- **DB**: Railway PostgreSQL

---

## 🔐 Sécurité (futur V2+)

- Authentification: JWT tokens (FastAPI)
- Hashing passwords: bcrypt
- HTTPS uniquement en production
- CORS configuré (seulement frontend origin)

---

## 📊 Monitoring (futur V2+)

- Logging: structlog → JSON logs → Railway logs
- Errors: Sentry (backend + frontend)
- Metrics: Railway built-in

---

## 📝 Notes

- Architecture simple pour MVP (pas de microservices)
- Monorepo pour faciliter le développement solo
- Possibilité de split backend/frontend repos plus tard si besoin
