# 📋 SecondBrain — Agent Development Rules

**Bienvenue Agents IA!** Ces règles vous aideront à développer proprement pour le projet SecondBrain.

---

## 📖 Fichiers de Règles

| Fichier | Contenu | Important |
|---------|---------|-----------|
| **core-rules.md** | Principes fondamentaux (KISS, DRY, TDD) | 🔴 LIRE EN PREMIER |
| **backend-python.md** | Style Python, FastAPI, type hints | Avant de coder backend |
| **frontend-nextjs.md** | Style TypeScript/Next.js, React | Avant de coder frontend |
| **testing.md** | Tests = source of truth, NE JAMAIS les modifier | Très important |
| **documentation.md** | Minimaliste, utiliser les docs existantes | À respecter |
| **git-workflow.md** | Commits atomiques, messages clairs, branches | Pour chaque PR |
| **logging.md** | Logging structuré (structlog backend, console frontend) | Important |
| **context-management.md** | Gestion du second cerveau (.claude/context/) | Très important |

---

## 🚀 Avant de Coder

1. **Lire `core-rules.md`** ← Comprendre la philosophie
2. **Lire `testing.md`** ← Important: tests ne se touchent PAS
3. **Lire `backend-python.md` OU `frontend-nextjs.md`** ← Selon ce que tu codes
4. **Lire `.claude/context/architecture.md`** ← Architecture globale
5. **Lire `.claude/context/user-stories.md`** ← Contexte de la feature
6. **Commencer à coder** ← Avec les règles en tête

---

## 🎯 Résumé Rapide (TL;DR)

### Principes
- ✅ KISS (Keep It Stupid Simple)
- ✅ DRY (Don't Repeat Yourself)
- ✅ TDD (Tests First)
- ❌ Pas de tests modifiés
- ❌ Pas de doc non-sollicitée

### Code Backend (Python)
- Fonctions < 25 lignes
- Type hints partout (mypy strict)
- Black formatter (88 chars)
- Pas de duplication

### Code Frontend (TypeScript)
- Fonctions < 25 lignes
- TypeScript strict (pas de `any`)
- Prettier + ESLint
- Composants fonctionnels uniquement

### Tests
- Tests AVANT le code (TDD)
- Ne jamais modifier un test validé
- Coverage: backend 80%, frontend 70%
- pytest (backend) + Jest (frontend)

### Documentation
- Utiliser: architecture.md, user-stories.md, tests, comments
- NE PAS créer: docs/, API.md, SETUP.md
- Comments expliquent le "pourquoi"

### Git
- Branches: `feat/scope/description`
- Commits: `feat(scope): description`
- Atomique: 1 commit = 1 feature logique
- Message clair et significatif

### Context Management
- Lire `.claude/context/*.md` avant de coder
- Mettre à jour si décisions importantes
- Ne pas dupliquer info entre context et code

---

## ✅ Pre-Commit Checklist

Avant de push:

**Backend:**
```bash
pytest                    # ✅ Tests passent
pytest --cov              # ✅ Coverage >= 80%
ruff check .              # ✅ 0 erreurs
black --check .           # ✅ Format OK
mypy .                    # ✅ Type hints OK
```

**Frontend:**
```bash
npm test                  # ✅ Tests passent
npm run test:coverage     # ✅ Coverage >= 70%
npm run lint              # ✅ 0 erreurs
npm run format            # Auto-fix
npm run build             # ✅ Build OK
```

**Git:**
```bash
git log -n 3              # Vérifier commits clairs
```

---

## 🤔 Questions Fréquentes

### "J'ai une question qui n'est pas dans les règles"
→ Regarde la section pertinente (core, backend, frontend, test, doc, git)
→ Cherche dans `.claude/context/` (architecture, decisions)
→ Demande à l'humain si tu doutes

### "Dois-je créer une documentation?"
→ Non (sauf si l'humain la demande)
→ Mettre à jour `.claude/context/architecture.md` si changement architecture
→ Utiliser tests pour montrer l'usage

### "Un test échoue, dois-je le modifier?"
→ NON! C'est TON CODE qui est mauvais
→ Revenir en arrière et fixer le code
→ Test modifié = règle violée

### "Ma fonction fait 30 lignes, c'est OK?"
→ Non, max 25 lignes
→ Décompose en plusieurs fonctions
→ Chaque fonction = 1 responsabilité

### "Dois-je commenter chaque ligne?"
→ Non, code lisible ne nécessite pas commentaire
→ Comments pour le "pourquoi", pas le "quoi"

### "Où documenter une décision d'architecture?"
→ `.claude/context/decisions.md` (Architecture Decision Record)
→ Format: Problème → Solutions évaluées → Choix → Raison

---

## 🧠 Second Cerveau (.claude/context/)

**Important**: Toujours consulter ces fichiers AVANT de coder

- **architecture.md** ← Structure système, stack technique, choix
- **user-stories.md** ← Features, MVP, roadmap
- **decisions.md** ← Historique des décisions importantes (ADR)
- **glossary.md** ← Termes métier, acronymes

**Mettre à jour** ces fichiers si:
- Changement d'architecture
- Nouvelle feature ajoutée
- Décision importante prise
- Nouveau concept métier introduit

---

## 📞 En Cas de Doute

1. Chercher dans les fichiers de règles
2. Chercher dans `.claude/context/`
3. Chercher dans le codebase (patterns existants)
4. Lire les tests existants (ils montrent comment faire)
5. Demander à l'humain

**Important**: Mieux d'avoir posé la question que de faire la mauvaise chose!

---

## 🎓 Ressources Externes

Si tu veux en savoir plus:
- [Conventional Commits](https://www.conventionalcommits.org/)
- [FastAPI Best Practices](https://fastapi.tiangolo.com/tutorial/)
- [Next.js Documentation](https://nextjs.org/docs)
- [pytest Documentation](https://docs.pytest.org/)
- [Black Code Style](https://black.readthedocs.io/)

---

**Bonne chance! 🚀**
