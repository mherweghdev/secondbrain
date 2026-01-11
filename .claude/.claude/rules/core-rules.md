# SecondBrain — Règles de Développement pour Agents IA

**Dernière mise à jour**: 2025-01-10
**Philosophie**: KISS + DRY + Tests as Source of Truth

---

## 🎯 Principes Fondamentaux

### 1. **Ne JAMAIS modifier un test validé**
- Les tests sont la source de vérité (test-driven development)
- Si un test passe ✅, ne le modifie pas pour faire passer ton code
- Si un test échoue après tes changements, c'est TON CODE qui est mauvais
- **Exception**: Refactoring du test AVEC justification (renommer, clarifier la logique)

### 2. **KISS: Keep It Stupid Simple**
- Code lisible > code clever
- Si tu dois commenter pour expliquer, le code n'est pas assez simple
- Pas de patterns complexes sans raison concrète
- Résous le problème, pas tous les problèmes possibles

### 3. **DRY: Don't Repeat Yourself**
- Si tu copier-colles du code, extrais-le dans une fonction
- Utilise les types partagés (Pydantic models, TypeScript interfaces)
- Réutilise les utilitaires existants (vérifier avant de créer)

### 4. **Fonctions courtes: MAX 25 lignes**
- 1 fonction = 1 responsabilité
- Si > 25 lignes, décompose en plusieurs fonctions
- Mesure: nombre de lignes SANS commentaires ni accolades de fermeture

### 5. **Documentation minimaliste**
- **NE PAS créer** de nouvelles documentations (README, DOCS/, etc)
- **UTILISER** les docs existantes:
  - `.claude/context/architecture.md` - Architecture globale ✅
  - `.claude/context/user-stories.md` - Features et specs ✅
  - `.claude/context/decisions.md` - Décisions importantes ✅
  - Code comments - Pour le "pourquoi", pas le "quoi" ✅
  - Tests - Documentent les cas d'usage ✅
- Mettre à jour une doc existante = OK si pertinent
- Créer nouvelle doc = NON (demander à l'humain d'abord)

---

## 🏗️ Architecture du Projet

**Monorepo structure**:
```
secondbrain/
├── backend/                # Python FastAPI
│   ├── app/
│   │   ├── api/           # Routes/endpoints
│   │   ├── core/          # Config, security
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── main.py
│   └── tests/
├── frontend/               # Next.js
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # React components
│   │   └── lib/           # Utils, API calls
│   └── __tests__/
├── .claude/
│   ├── rules/             # Development rules (ici)
│   └── context/           # Second cerveau (knowledge base)
└── docker-compose.yml
```

---

## 🔑 Technologies Stack

**Backend (Python)**:
- Python 3.11+
- FastAPI (framework web async)
- PostgreSQL + SQLAlchemy (ORM)
- pgvector (recherche sémantique, futur)
- Pydantic (validation)
- pytest (tests)
- structlog (logging structuré)
- Black + Ruff (formatage + linting)

**Frontend (TypeScript)**:
- Next.js 14+ (App Router)
- React + TypeScript
- TailwindCSS + shadcn/ui
- Jest + React Testing Library
- ESLint + Prettier

**Dev Tools**:
- Docker + Docker Compose
- Git + GitHub
- pre-commit hooks
- GitHub Actions (CI/CD)

---

## ✅ Avant de coder

1. **Lire `.claude/context/architecture.md`** - Comprendre le contexte global
2. **Lire `.claude/context/user-stories.md`** - Comprendre la feature
3. **Chercher dans le codebase** - Existe-t-il déjà une solution?
4. **Vérifier les tests** - Quels tests devraient passer?
5. **Lire les rules spécifiques** - backend-python.md OU frontend-nextjs.md

---

## ❌ Absolument INTERDIT

- ❌ Hardcoded values (utiliser variables d'environnement)
- ❌ `any` type en TypeScript
- ❌ Modifier les tests validés
- ❌ Créer de la documentation non sollicitée
- ❌ Copier-coller du code (extraire une fonction)
- ❌ Commenter le "quoi" (le code parle pour lui)
- ❌ Fonctions > 25 lignes sans raison valide
- ❌ Code sans tests
- ❌ Secrets en commits
- ❌ `print()` ou `console.log()` (utiliser logging structuré)

---

## ✅ À FAIRE

- ✅ Écrire des tests AVANT le code (TDD)
- ✅ Garder les tests validés intacts
- ✅ Utiliser les types (Pydantic, TypeScript interfaces)
- ✅ Décomposer en petites fonctions
- ✅ Code lisible et simple
- ✅ Respecter le style existant
- ✅ Logging structuré (structlog/console)
- ✅ Mettre à jour `.claude/context/` si décisions importantes

---

## 🧠 Second Cerveau (.claude/context/)

**Toujours consulter AVANT de coder**:

- **architecture.md** - Structure système, stack, choix techniques
- **user-stories.md** - Features, MVP, roadmap
- **decisions.md** - Architecture Decision Records (ADR)
- **glossary.md** - Termes métier, acronymes

**Mettre à jour** si:
- Changement d'architecture majeur
- Nouvelle feature ajoutée au scope
- Décision importante prise (choix de lib, pattern, etc)
- Nouveau concept métier introduit

**Format ADR** (decisions.md):
```markdown
## [Numéro] Titre de la décision

**Date**: 2025-01-10
**Statut**: Acceptée / Refusée / Superseded

**Contexte**: Quel problème on essaie de résoudre?

**Options considérées**:
1. Option A - Description
2. Option B - Description

**Décision**: Option choisie

**Raison**: Pourquoi cette option?

**Conséquences**: 
- Positif: ...
- Négatif: ...
```

---

## 📞 Questions?

Si tu as un doute sur ce que tu dois faire:
1. Vérifie les autres règles (backend-python.md, testing.md, etc)
2. Cherche dans `.claude/context/`
3. Cherche dans le codebase existant
4. Demande à l'humain (ne fais pas de suppositions)

**Important**: Mieux d'avoir posé la question que de faire la mauvaise chose!
