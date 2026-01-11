# User Stories SecondBrain

**Dernière mise à jour**: 2025-01-10

---

## 🎯 Vision Produit

**Mission**: Transformer les notes chaotiques en connaissance structurée, automatiquement.

**Utilisateur cible**: Knowledge workers qui capturent des infos toute la journée mais n'arrivent pas à en faire une synthèse claire.

**Différenciation**: L'IA fait le travail de structuration À LA PLACE de l'utilisateur (vs Notion/Obsidian qui demandent un effort constant).

---

## 📦 MVP (Version 1.0) — 3-4 semaines

Fonctionnalités essentielles pour valider le concept.

---

### US-001: Capture Rapide

**En tant qu'utilisateur stressé/occupé,**  
**Je veux capturer une idée en moins de 5 secondes,**  
**Afin de ne jamais perdre une information importante.**

**Critères d'acceptation**:
- [ ] Interface web accessible en 1 clic (bookmark)
- [ ] Un champ texte (markdown) + bouton "Capturer"
- [ ] Validation instantanée (feedback visuel "✓ Capturé")
- [ ] Pas besoin de choisir catégorie/tag (automatique plus tard)
- [ ] Fonctionne même hors ligne (sync auto quand connexion revient) — FUTUR

**Priorité**: 🔴 CRITICAL (base du produit)  
**Statut**: ⏳ À faire  
**Estimation**: 2-3 jours  
**Branch**: `feat/backend/quick-capture`

**Dépendances techniques**:
- Backend: POST /api/v1/notes endpoint
- Frontend: Page /notes/new avec formulaire simple
- DB: Table notes créée

---

### US-002: Liste des Notes

**En tant qu'utilisateur,**  
**Je veux voir toutes mes notes récentes,**  
**Afin de me rappeler ce que j'ai capturé.**

**Critères d'acceptation**:
- [ ] Page /notes affiche les 50 dernières notes
- [ ] Tri par date (plus récent en premier)
- [ ] Affichage: titre (première ligne) + preview (50 chars)
- [ ] Clic sur note → voir détail complet

**Priorité**: 🔴 CRITICAL  
**Statut**: ⏳ À faire  
**Estimation**: 1-2 jours  
**Branch**: `feat/frontend/notes-list`

---

### US-003: Digest Hebdomadaire Automatique

**En tant qu'utilisateur submergé de notes,**  
**Je veux recevoir chaque vendredi un résumé intelligent de ma semaine,**  
**Afin d'avoir une vue claire sans effort de synthèse.**

**Critères d'acceptation**:
- [ ] Généré automatiquement chaque vendredi 17h (configurable)
- [ ] Contient:
  - Résumé narratif de la semaine (2-3 paragraphes)
  - Thèmes principaux détectés
  - Actions identifiées (TODO extraits automatiquement)
  - Connexions avec notes plus anciennes
- [ ] Accessible dans l'app (page /digests)
- [ ] Envoyé par email (FUTUR V2)
- [ ] Possibilité de régénérer avec un prompt custom (FUTUR)

**Priorité**: 🟠 HIGH  
**Statut**: ⏳ À faire  
**Estimation**: 4-5 jours  
**Branch**: `feat/backend/weekly-digest`

**Dépendances techniques**:
- Claude API (Anthropic) setup
- Celery ou cron job pour scheduling
- Prompt engineering pour digest generation

---

### US-004: Recherche Simple

**En tant qu'utilisateur qui a 100+ notes,**  
**Je veux chercher dans mes notes par mots-clés,**  
**Afin de retrouver une info rapidement.**

**Critères d'acceptation**:
- [ ] Barre de recherche en haut de /notes
- [ ] Recherche full-text dans le contenu des notes
- [ ] Résultats avec highlight des mots-clés
- [ ] Recherche case-insensitive

**Priorité**: 🟡 MEDIUM  
**Statut**: ⏳ À faire  
**Estimation**: 1-2 jours  
**Branch**: `feat/backend/search`

---

### US-005: Authentification Basique

**En tant qu'utilisateur,**  
**Je veux créer un compte et me connecter,**  
**Afin que mes notes soient privées.**

**Critères d'acceptation**:
- [ ] Page /register (email + password)
- [ ] Page /login
- [ ] JWT token stocké (localStorage ou cookie)
- [ ] Protected routes (/notes, /digests)
- [ ] Logout

**Priorité**: 🟠 HIGH (avant launch)  
**Statut**: ⏳ À faire  
**Estimation**: 2-3 jours  
**Branch**: `feat/auth/jwt`

---

## 🚀 Version 2.0 (Backlog)

Features à implémenter après validation du MVP.

---

### US-006: Recherche Sémantique

**En tant qu'utilisateur,**  
**Je veux retrouver une note même si je ne me souviens pas des mots exacts,**  
**Afin de ne plus jamais perdre mes insights.**

**Exemples**:
- Recherche "optimisation" → trouve aussi notes avec "efficiency", "amélioration"
- Recherche par concept, pas juste mots-clés

**Dépendances techniques**:
- pgvector (PostgreSQL extension)
- Embeddings generation (OpenAI ou sentence-transformers)
- Cosine similarity search

**Priorité**: 🟡 MEDIUM  
**Estimation**: 5-7 jours

---

### US-007: Import Markdown/Notion

**En tant qu'utilisateur qui a déjà des notes ailleurs,**  
**Je veux importer mes notes existantes,**  
**Afin de centraliser ma connaissance.**

**Formats supportés**:
- Markdown files (drag & drop)
- Notion export (zip)
- Plain text

**Priorité**: 🟡 MEDIUM  
**Estimation**: 3-4 jours

---

### US-008: Tags Automatiques (IA)

**En tant qu'utilisateur,**  
**Je veux que l'IA tag automatiquement mes notes,**  
**Afin de les organiser sans effort.**

**Exemples de tags**: #travail, #personnel, #idées, #todo, etc.

**Priorité**: 🟢 LOW  
**Estimation**: 3-4 jours

---

### US-009: Mode Équipe

**En tant que manager,**  
**Je veux que mon équipe partage une knowledge base,**  
**Afin de centraliser les connaissances collectives.**

**Features**:
- Workspace partagé
- Notes privées vs partagées
- Digest d'équipe hebdo

**Priorité**: 🟢 LOW (après product-market fit)  
**Estimation**: 10-15 jours

---

## 📊 Roadmap

### Sprint 1 (Semaine 1-2): MVP Core
- [ ] US-001: Capture rapide
- [ ] US-002: Liste des notes
- [ ] US-004: Recherche simple

### Sprint 2 (Semaine 3-4): IA + Auth
- [ ] US-003: Digest hebdomadaire
- [ ] US-005: Authentification

### Sprint 3 (Post-MVP): V2 Features
- [ ] US-006: Recherche sémantique
- [ ] US-007: Import Markdown
- [ ] US-008: Tags automatiques

---

## 📝 Notes

- Priorisation basée sur: valeur utilisateur + simplicité technique
- MVP = 3-4 semaines de dev solo (avec agents IA)
- V2 = après feedback utilisateurs réels
