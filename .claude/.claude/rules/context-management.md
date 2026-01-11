# Context Management — Second Cerveau pour Agents IA

**Objectif**: Centraliser la connaissance du projet dans des fichiers Markdown pour alléger le contexte des agents tout en préservant l'information critique.

---

## 🧠 Philosophie

**Problème résolu**:
- Agents IA oublient le contexte entre sessions
- Répéter les mêmes infos (architecture, décisions) pollue le contexte
- Perte de traçabilité des décisions importantes

**Solution**:
- Fichiers Markdown dans `.claude/context/` = mémoire persistante
- Agents lisent ces fichiers AVANT de coder
- Mise à jour par les agents quand décisions importantes

---

## 📁 Structure du Second Cerveau

```
.claude/
├── rules/                    # Règles de développement (statiques)
│   ├── README.md
│   ├── core-rules.md
│   ├── backend-python.md
│   ├── frontend-nextjs.md
│   ├── testing.md
│   ├── git-workflow.md
│   ├── logging.md
│   ├── documentation.md
│   └── context-management.md  # ← Tu es ici
└── context/                  # Second cerveau (dynamique, évolue)
    ├── architecture.md       # Structure système, stack, choix tech
    ├── user-stories.md       # Features, MVP, roadmap
    ├── decisions.md          # Architecture Decision Records (ADR)
    └── glossary.md           # Termes métier, acronymes
```

---

## 📄 Fichiers du Second Cerveau

### 1. `architecture.md` — Structure Système

**Contenu**:
- Stack technique complète
- Structure des dossiers (backend/frontend)
- Flow de données (user → API → DB → response)
- Choix architecturaux majeurs
- Schéma de base de données (tables principales)

**Exemple**:
```markdown
# Architecture SecondBrain

## Stack Technique

**Backend**:
- Python 3.11 + FastAPI
- PostgreSQL + SQLAlchemy ORM
- structlog (logging)
- pytest (tests)

**Frontend**:
- Next.js 14 (App Router)
- TypeScript + React
- TailwindCSS + shadcn/ui

## Structure Backend

\`\`\`
backend/
├── app/
│   ├── api/v1/          # Endpoints REST
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic validation
│   └── services/        # Business logic
└── tests/
\`\`\`

## Database Schema

**notes** table:
- id (UUID, PK)
- user_id (UUID, FK to users)
- content (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Data Flow

1. User → Frontend (Next.js)
2. Frontend → Backend API (FastAPI)
3. Backend → Service Layer (validation, business logic)
4. Service → Database (SQLAlchemy)
5. Database → Service → API → Frontend → User
```

**Quand mettre à jour**:
- Changement de stack (nouvelle lib, migration)
- Nouvelle table/model majeur
- Changement de flow de données

---

### 2. `user-stories.md` — Features & Roadmap

**Contenu**:
- MVP défini (liste des features essentielles)
- User stories au format standard
- Roadmap (V1, V2, V3...)
- Features en cours / done / backlog

**Exemple**:
```markdown
# User Stories SecondBrain

## MVP (Version 1.0)

### US-001: Capture Rapide
**En tant qu'utilisateur stressé,**
**Je veux capturer une idée en moins de 5 secondes,**
**Afin de ne jamais perdre une information importante.**

**Critères d'acceptation**:
- [ ] Interface accessible en 1 clic
- [ ] Un champ texte + bouton "Capturer"
- [ ] Validation instantanée
- [ ] Pas besoin de choisir catégorie/tag

**Statut**: ✅ Done
**Commit**: `feat(backend): add quick capture endpoint` (abc123)

---

### US-002: Digest Hebdomadaire
**En tant qu'utilisateur submergé de notes,**
**Je veux recevoir chaque vendredi un résumé intelligent,**
**Afin d'avoir une vue claire sans effort.**

**Critères d'acceptation**:
- [ ] Généré automatiquement vendredi 17h
- [ ] Contient: résumé, thèmes, actions, connexions
- [ ] Envoyé par email + accessible dans l'app

**Statut**: 🔄 En cours
**Branch**: `feat/backend/weekly-digest`

---

## Backlog (V2+)

- US-003: Recherche sémantique
- US-004: Import Notion/Markdown
- US-005: Mode équipe
```

**Quand mettre à jour**:
- Nouvelle user story validée
- User story terminée (update statut)
- Changement de scope MVP
- Feature ajoutée au backlog

---

### 3. `decisions.md` — Architecture Decision Records (ADR)

**Contenu**:
- Historique des décisions importantes
- Format: Contexte → Options → Choix → Raison → Conséquences
- Numérotées chronologiquement

**Exemple**:
```markdown
# Architecture Decision Records

## ADR-001: Choix du framework backend

**Date**: 2025-01-10
**Statut**: ✅ Acceptée

**Contexte**:
Besoin d'un framework backend Python moderne pour API REST asynchrone.

**Options considérées**:
1. **FastAPI** - Moderne, async natif, auto-doc OpenAPI
2. **Flask** - Simple, mature, mais sync
3. **Django REST** - Complet, mais lourd pour notre cas

**Décision**: FastAPI

**Raison**:
- Async natif (important pour IA API calls futures)
- Type hints natifs (mypy compliance)
- Auto-génération OpenAPI (documentation gratuite)
- Performance excellente
- Communauté active

**Conséquences**:
- ✅ Positif: Dev rapide, code type-safe
- ✅ Positif: Perf async pour appels IA
- ⚠️ Négatif: Moins mature que Flask (acceptable)

---

## ADR-002: Format de stockage des notes

**Date**: 2025-01-10
**Statut**: ✅ Acceptée

**Contexte**:
Les notes doivent être stockées en DB. Format: texte brut, Markdown, ou JSON ?

**Options**:
1. **Markdown** - Lisible, portable, standard
2. **Plain text** - Simple mais perd formatage
3. **JSON structuré** - Flexible mais complexe

**Décision**: Markdown

**Raison**:
- Format humain lisible
- Portable (export facile)
- Support natif par beaucoup d'outils
- Compatible avec embeddings IA (futur)

**Conséquences**:
- ✅ Export/import facile
- ✅ Futur: parsing pour IA digest
- ⚠️ Validation du Markdown à gérer
```

**Quand mettre à jour**:
- Décision technique importante (choix de lib, pattern, archi)
- Changement de décision existante (superseded)
- Expérimentation réussie/échouée

---

### 4. `glossary.md` — Termes Métier

**Contenu**:
- Définitions des concepts métier
- Acronymes du projet
- Vocabulaire partagé (ubiquitous language)

**Exemple**:
```markdown
# Glossaire SecondBrain

## Concepts Métier

**Note**:
Unité de base de capture. Texte libre en Markdown, créé rapidement par l'utilisateur.

**Digest**:
Résumé automatique généré par IA des notes d'une période (hebdo/quotidien). Contient: thèmes, actions, connexions.

**Inbox**:
Zone de réception des notes capturées. Avant organisation/traitement.

**Tag** (futur):
Catégorie automatique assignée par IA à une note pour faciliter la recherche.

---

## Acronymes

**TDD**: Test-Driven Development
**ADR**: Architecture Decision Record
**MVP**: Minimum Viable Product
**IA**: Intelligence Artificielle (contexte: Claude API pour digest)
```

**Quand mettre à jour**:
- Nouveau concept métier introduit
- Clarification d'un terme ambigu
- Ajout d'acronyme utilisé dans le projet

---

## 🔄 Workflow des Agents

### Avant de coder (TOUJOURS)

1. **Lire `.claude/context/architecture.md`**
   - Comprendre la structure globale
   - Vérifier la stack technique

2. **Lire `.claude/context/user-stories.md`**
   - Identifier la feature à implémenter
   - Comprendre les critères d'acceptation

3. **Lire `.claude/context/decisions.md`**
   - Vérifier s'il y a des contraintes/choix existants
   - Ne pas contredire les ADR validées

4. **Lire `.claude/context/glossary.md`**
   - Utiliser le vocabulaire correct
   - Comprendre les concepts métier

5. **Lire les rules spécifiques** (backend-python.md, testing.md, etc)

### Pendant le développement

- Respecter les décisions dans `decisions.md`
- Utiliser les termes du `glossary.md`
- Suivre l'architecture de `architecture.md`

### Après une décision importante

**Mettre à jour `decisions.md`**:
```markdown
## ADR-XXX: Titre de la décision

**Date**: YYYY-MM-DD
**Statut**: Acceptée

**Contexte**: [Quel problème?]
**Options**: [Quelles options?]
**Décision**: [Choix fait]
**Raison**: [Pourquoi?]
**Conséquences**: [Impact]
```

---

## ✅ Règles de Mise à Jour

### Quand mettre à jour le second cerveau

**TOUJOURS mettre à jour si**:
- Changement d'architecture (nouveau service, nouvelle table)
- Nouvelle feature ajoutée au scope
- Décision technique importante prise
- Nouveau concept métier introduit

**JAMAIS mettre à jour pour**:
- Bugs mineurs
- Refactoring sans changement de comportement
- Corrections de typos
- Changements de code sans impact archi

### Comment mettre à jour

1. **Identifier le fichier concerné**
   - Architecture → `architecture.md`
   - Feature → `user-stories.md`
   - Décision → `decisions.md`
   - Nouveau terme → `glossary.md`

2. **Ajouter/modifier la section concernée**

3. **Commit avec message clair**:
   ```bash
   git commit -m "docs(context): update architecture with new note tagging service"
   ```

---

## ❌ Anti-patterns

**❌ MAUVAIS**:
- Dupliquer l'info entre context/ et code
- Mettre du code dans les fichiers context/
- Écrire des romans (rester concis)
- Oublier de mettre à jour après changement majeur

**✅ BON**:
- Concis, factuel, à jour
- Seulement les décisions importantes
- Référencer les commits/branches si pertinent
- Vocabulaire clair et partagé

---

## 📚 Ressources

- [Architecture Decision Records (ADR)](https://adr.github.io/)
- [Domain-Driven Design - Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html)
