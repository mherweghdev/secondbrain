# Git Workflow & Commit Conventions

**Standard**: Conventional Commits + GitHub Flow

---

## 🌿 Branch Naming

Format: `<type>/<scope>/<short-description>`

```
feat/backend/user-trial-activation
fix/admin/login-redirect-bug
docs/workflow-api-versioning
chore/deps-upgrade-express
test/backend/trial-service-coverage
```

**Types**:
- `feat/` - Nouvelle fonctionnalité
- `fix/` - Correction de bug
- `docs/` - Documentation (workflow.md, README, etc)
- `test/` - Ajout de tests, amélioration coverage
- `refactor/` - Refactoring (pas de changement fonctionnel)
- `chore/` - Maintenance (dépendances, config)

**Scope** (optionnel mais recommandé):
- `backend/`, `admin/`, `api/`, `auth/`, etc.

---

## 📝 Commit Messages

**Format**: `<type>(<scope>): <subject>`

**Exemple COMPLET**:
```
feat(backend): add trial activation endpoint

- Create POST /api/v1/users/activate-trial endpoint
- Set trial expiration to 30 days
- Add validation for duplicate activation
- Update OpenAPI spec

Fixes #42
```

### Structure

```
<type>(<scope>): <subject>
                        ↑
              Garder court (< 50 chars)
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Type (start of subject line)
- `feat`: Nouvelle fonctionnalité
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests/coverage
- `refactor`: Code refactoring
- `chore`: Build, deps, etc.
- `perf`: Performance improvements

### Subject (première ligne)
- ✅ Impératif present: "add" pas "added"
- ✅ Pas de point à la fin
- ✅ Garder < 50 caractères
- ✅ Minuscule (sauf noms propres)

### Body (optionnel pour commits petits)
- Explique POURQUOI, pas QUOI
- Chaque ligne < 72 caractères
- Bullet points OK avec `-`

### Footer
```
Fixes #42              ← Issue référencée
Closes #43
Related to #44

BREAKING CHANGE: description    ← Si breaking change API
```

---

## ✅ Exemples Bons Commits

### Simple feature
```
feat(backend): add user email validation

- Create validateEmail utility function
- Reject emails without @ character
- Add tests for edge cases
```

### Bug fix
```
fix(admin): correct trial expiration date display

The expiration was shown in UTC instead of user's timezone.
Changed db.query to use user's timezone offset.

Fixes #127
```

### Refactoring
```
refactor(backend): extract authentication logic to service

Extract JWT validation from middleware into separate service
to make it reusable and testable.

No functional changes.
```

### Documentation
```
docs(workflow): update API versioning strategy

Changed from path versioning (/v1/api) to header versioning
(api-version header). See BREAKING CHANGE for migration guide.

BREAKING CHANGE: API endpoints moved from /api/v1/* to /api/*
  with api-version header required.
```

---

## ❌ Exemples Mauvais Commits

❌ `fixed stuff`
❌ `WIP`
❌ `asdf`
❌ `update` (pas assez spécifique)
❌ `Fixed the trial bug that was broken before` (trop long)
❌ `Add feature to show the users and then validate them` (trop vague)

---

## 🔄 Pull Request Process

### Avant de créer la PR

```bash
# 1. À jour avec main
git fetch origin
git rebase origin/main

# 2. Tous les tests passent
npm test                # ✅ Doit être vert
npm run test:contract   # ✅ Doit être vert
npm run lint            # ✅ 0 erreurs
npm run build           # ✅ Doit réussir

# 3. Commit atomiques
# Chaque commit = une fonction/feature logique
git log origin/main..HEAD
# Affiche: 1-3 commits max, bien nommés

# 4. Push
git push origin feat/backend/user-trial-activation
```

### PR Template (GitHub)

```markdown
## 🎯 Objectif
Implémente l'activation de l'essai gratuit pour les utilisateurs.

## 📝 Changements
- Ajoute endpoint POST /api/v1/users/activate-trial
- Crée fonction activateTrial() dans UserService
- Met à jour schéma DB (subscription_tier)
- Ajoute 8 tests unitaires

## 🔗 Context
- Issue: #42
- OpenAPI spec updated to v1.2.0

## ✅ Checklist
- [x] Tests unitaires passent (jest)
- [x] Tests de contrat passent (dredd)
- [x] Coverage > 80%
- [x] Pas de secrets en commits
- [x] Lint/format OK
- [x] Build réussit
- [x] Pas de duplication (DRY respecté)
```

---

## 🚫 Règles STRICTES

**JAMAIS faire**:
- ❌ Commit secrets (.env, keys, credentials)
- ❌ Commit `node_modules/` ou build artifacts
- ❌ Commit console.log ou code commenté
- ❌ Force push sauf si tu es sûr (pas sur main!)
- ❌ Merge conflit sans review
- ❌ Plusieurs features dans 1 commit (garder atomique)

**Toujours faire**:
- ✅ Tests avant push
- ✅ Lint/format avant push (Husky le bloque)
- ✅ Messages clairs et significatifs
- ✅ Commits atomiques (1 feature = 1 commit)
- ✅ Référencer les issues (#42)

---

## 📊 Workflow Complet (jour type)

```bash
# 1. Créer branche depuis main
git checkout main
git pull origin main
git checkout -b feat/backend/user-notifications

# 2. Développer
# ... ton code ...
npm test              # ✅ Tout passe
npm run format        # Auto-format

# 3. Commit atomique
git add src/services/notification.service.ts
git add src/services/notification.service.test.ts
git commit -m "feat(backend): add user notification service

- Create NotificationService with send() method
- Add email and SMS templates
- Add 5 unit tests with 100% coverage"

# 4. Continuer sur même branche si besoin
# ... plus de code ...
git add src/controllers/notification.controller.ts
git commit -m "feat(backend): add notification endpoint

- Create POST /api/v1/notifications endpoint
- Add validation for payload
- Add OpenAPI schema"

# 5. Before push: rebase sur main
git fetch origin
git rebase origin/main
# Si conflict: git add . && git rebase --continue

# 6. Push et créer PR
git push origin feat/backend/user-notifications
# → GitHub affiche lien "Create PR"

# 7. GitHub Actions tourne les tests
# → Si tout vert: merge button available

# 8. Après merge
git checkout main
git pull origin main
# La branche feature peut être supprimée
```

---

## 🔍 Vérifier avant Push

```bash
# Commits clairs?
git log origin/main..HEAD
# Affiche tes commits avec messages

# Code prêt?
npm test                  # ✅
npm run test:contract     # ✅
npm run lint              # ✅ 0 errors
npm run format            # Auto-fix
npm run build             # ✅

# Pas de secrets?
git show --name-status
# Vérifier pas de .env, .key, credentials.json

# On push?
git push origin feat/...
```

---

## 📌 Checklist Commit

- [ ] Message clair (type + scope + subject)
- [ ] Commit atomique (1 feature logique)
- [ ] Tests passent ✅
- [ ] Lint/format OK
- [ ] Pas de secrets
- [ ] Pas de code commenté
- [ ] Pas de console.log
- [ ] Référence issue si applicable (#42)

---

## 🎯 Résumé: Workflow Rapide

```bash
# Feature branch depuis main
git checkout -b feat/backend/my-feature

# Code + test
npm test

# Commit clair
git commit -m "feat(backend): my feature

- What you did
- Why you did it"

# Rebase sur main
git rebase origin/main

# Push et PR
git push origin feat/backend/my-feature

# Merge après approval
```

**C'est tout ce que tu dois savoir!**