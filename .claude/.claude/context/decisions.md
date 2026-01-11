# Architecture Decision Records (ADR)

**Dernière mise à jour**: 2025-01-10

---

## ADR-001: Choix du framework backend (Python)

**Date**: 2025-01-10  
**Statut**: ✅ Acceptée

**Contexte**:  
Besoin d'un framework backend Python moderne pour API REST asynchrone avec appels futurs à l'IA (Claude API).

**Options considérées**:
1. **FastAPI** - Moderne, async natif, auto-doc OpenAPI, type hints
2. **Flask** - Simple, mature, mais sync par défaut
3. **Django REST Framework** - Complet, mais lourd pour notre cas (pas besoin d'admin, etc.)

**Décision**: FastAPI

**Raison**:
- Async natif (important pour appels Claude API sans bloquer)
- Type hints Python natifs (mypy compliance, meilleure DX)
- Auto-génération OpenAPI/Swagger (documentation gratuite)
- Performance excellente (Starlette + Pydantic)
- Communauté active et moderne

**Conséquences**:
- ✅ Positif: Dev rapide, code type-safe, excellente DX
- ✅ Positif: Performance pour appels IA concurrents
- ✅ Positif: Documentation API auto-générée
- ⚠️ Négatif: Moins mature que Flask (acceptable pour MVP)
- ⚠️ Négatif: Moins de libs tierces (mais growing ecosystem)

---

## ADR-002: Format de stockage des notes

**Date**: 2025-01-10  
**Statut**: ✅ Acceptée

**Contexte**:  
Les notes doivent être stockées en DB. Choix du format: texte brut, Markdown, ou JSON structuré ?

**Options considérées**:
1. **Markdown** - Lisible, portable, standard de facto
2. **Plain text** - Simple mais perd tout formatage
3. **JSON structuré** - Flexible mais complexe, pas lisible

**Décision**: Markdown

**Raison**:
- Format humain lisible (important si l'utilisateur exporte)
- Portable (standard, beaucoup d'outils supportent)
- Compatible avec embeddings IA (tokenization facile)
- Permet formatage basique (bold, lists, links)
- Facile à parser pour génération de digest

**Conséquences**:
- ✅ Export/import facile (juste des fichiers .md)
- ✅ Futur: parsing pour IA digest (headers, lists, etc)
- ✅ Utilisateur peut écrire du formatage riche
- ⚠️ Validation du Markdown à gérer (éviter injection)
- ⚠️ Pas de structure rigide (vs JSON), mais OK pour notes libres

---

## ADR-003: Choix du frontend framework

**Date**: 2025-01-10  
**Statut**: ✅ Acceptée

**Contexte**:  
Besoin d'un framework frontend moderne pour SaaS web (pas d'app mobile native pour MVP).

**Options considérées**:
1. **Next.js** - React SSR/SSG, App Router, optimisé SEO
2. **Vite + React** - Plus simple, mais pas de SSR
3. **SvelteKit** - Moderne, performant, mais moins de libs

**Décision**: Next.js 14 (App Router)

**Raison**:
- React (composants réutilisables, écosystème énorme)
- App Router (Server Components, meilleure perf)
- SEO-friendly (important si landing page publique plus tard)
- Vercel deploy gratuit (CI/CD facile)
- TypeScript natif (type safety frontend/backend)

**Conséquences**:
- ✅ Developer experience excellente
- ✅ Performance (SSR + caching)
- ✅ Déploiement gratuit sur Vercel
- ⚠️ Courbe d'apprentissage (App Router nouveau)
- ⚠️ Overhead pour MVP simple (acceptable, invest futur)

---

## ADR-004: Base de données (PostgreSQL vs autres)

**Date**: 2025-01-10  
**Statut**: ✅ Acceptée

**Contexte**:  
Choix de la base de données pour stockage notes, users, digests.

**Options considérées**:
1. **PostgreSQL** - SQL relationnel, pgvector (embeddings futur)
2. **MongoDB** - NoSQL, flexible, mais moins adapté relations
3. **SQLite** - Simple pour dev, mais pas scalable production

**Décision**: PostgreSQL 14+

**Raison**:
- Relations claires (users → notes → digests)
- pgvector extension (futur: recherche sémantique par embeddings)
- ACID compliant (important pour consistance données)
- Supporté par Railway/Render (hosting facile)
- JSON fields si besoin (JSONB) pour flexibilité

**Conséquences**:
- ✅ Prêt pour recherche sémantique (pgvector)
- ✅ Relations robustes (foreign keys, transactions)
- ✅ Hosting simple (Railway inclut Postgres)
- ⚠️ Setup local légèrement plus complexe que SQLite (docker-compose)

---

## ADR-005: Génération de digests (IA)

**Date**: 2025-01-10  
**Statut**: ✅ Acceptée

**Contexte**:  
Choix de l'API IA pour générer les digests hebdomadaires intelligents.

**Options considérées**:
1. **Claude API (Anthropic)** - Excellent pour summarization, context window énorme
2. **OpenAI GPT-4** - Bon aussi, mais plus cher, context window plus petit
3. **Open source (Llama, Mistral)** - Gratuit, mais qualité moindre, complexité self-hosting

**Décision**: Claude API (Anthropic)

**Raison**:
- Meilleure qualité de summarization (testé)
- Context window 200k tokens (peut ingérer beaucoup de notes)
- Pricing raisonnable (Sonnet moins cher que GPT-4)
- Alignement avec valeurs (safety-first)
- API simple et bien documentée

**Conséquences**:
- ✅ Qualité de digest excellente
- ✅ Peut traiter beaucoup de notes en une fois
- ✅ API fiable (uptime élevé)
- ⚠️ Coût variable selon usage (à monitorer)
- ⚠️ Dépendance externe (si Anthropic down, digests down)

---

## ADR-006: Authentification (JWT vs sessions)

**Date**: 2025-01-10  
**Statut**: ✅ Acceptée

**Contexte**:  
Choix du mécanisme d'authentification pour l'API.

**Options considérées**:
1. **JWT tokens** - Stateless, scalable, standard
2. **Sessions (cookies)** - Stateful, serveur gère, plus simple
3. **OAuth only** - Déléguer à Google/GitHub, mais lock-in

**Décision**: JWT tokens (avec refresh tokens futur)

**Raison**:
- Stateless (pas de session store, scalable)
- Standard (beaucoup de libs FastAPI)
- Frontend peut stocker (localStorage ou httpOnly cookie)
- Compatible avec futures apps mobiles
- Permet OAuth en plus (ajout facile)

**Conséquences**:
- ✅ Scalable (pas de session store centralisé)
- ✅ Compatible mobile futur
- ✅ Standard bien supporté
- ⚠️ Gestion refresh tokens à implémenter (V2)
- ⚠️ Révocation tokens plus complexe (mitigé par TTL court)

---

## Template pour nouveaux ADR

```markdown
## ADR-XXX: Titre de la décision

**Date**: YYYY-MM-DD
**Statut**: ✅ Acceptée / ❌ Refusée / 🔄 Superseded by ADR-YYY

**Contexte**: 
[Quel problème essaie-t-on de résoudre?]

**Options considérées**:
1. Option A - Description
2. Option B - Description
3. Option C - Description

**Décision**: [Option choisie]

**Raison**:
[Pourquoi cette option? Critères de décision?]

**Conséquences**:
- ✅ Positif: ...
- ✅ Positif: ...
- ⚠️ Négatif: ... (et comment on mitigue)
```
