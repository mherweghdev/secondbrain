# CI/CD Pipeline Documentation

## Overview

Le projet utilise **GitHub Actions** comme plateforme CI/CD pour automatiser les vérifications de qualité du code sur chaque push et pull request.

**Pipeline:** `.github/workflows/ci.yml`

**Triggers:**
- Push vers `main`, `develop`, ou branches `feat/**`
- Pull requests vers `main` ou `develop`

**Temps d'exécution cible:** < 5 minutes

## Quality Checks

Le workflow exécute automatiquement les vérifications suivantes:

### 1. ESLint (Linting)
- Vérifie la qualité du code et le respect des standards
- Commande: `npm run lint`
- Règles strictes: zéro `any`, pas de variables inutilisées

### 2. TypeScript Type Check
- Validation des types sans génération de build
- Commande: `npm run typecheck`
- Mode strict activé

### 3. Tests avec Coverage
- Tests unitaires et d'intégration
- Commande: `npm run test:coverage`
- Seuils minimaux: 80% (lines, branches, functions, statements)
- Le rapport de couverture est uploadé comme artifact GitHub Actions

### 4. Build Next.js
- Validation de la production build
- Commande: `npm run build`
- Vérifie que toutes les routes et imports sont valides

## Docker Services

Le workflow démarre automatiquement les services Docker nécessaires:

**PostgreSQL 15-alpine:**
- Port: 5432
- Database: `secondbrain_test`
- User: `testuser`
- Healthcheck: `pg_isready`

**Redis 7-alpine:**
- Port: 6379
- Healthcheck: `redis-cli ping`

## Environment Variables

Variables d'environnement configurées dans le workflow:

```yaml
NODE_VERSION: '20'
DATABASE_URL: postgresql://testuser:testpass@localhost:5432/secondbrain_test
REDIS_URL: redis://localhost:6379
NODE_ENV: test
LOG_LEVEL: error
```

**Note:** Ces credentials sont pour les tests CI uniquement (containers éphémères).

## Coverage Reports

Les rapports de couverture sont:
- Générés automatiquement à chaque run
- Uploadés comme artifacts GitHub (rétention: 30 jours)
- Accessibles via: Actions → Workflow Run → Artifacts
- Format: `coverage-report-{git-sha}`

Pour voir le coverage localement:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## Pull Request Comments

Le workflow ajoute automatiquement un commentaire sur chaque PR avec:
- ✅ Status des checks (pass/fail)
- 📊 Résumé du coverage (lines, branches, functions, statements)
- 📦 Lien vers le rapport de couverture complet

## Performance Optimizations

**Optimisations appliquées:**
- ✅ npm cache via `actions/setup-node@v4` (économise 30-60s)
- ✅ `npm ci` au lieu de `npm install` (installation déterministe)
- ✅ Exécution parallèle des steps avec `if: always()`
- ✅ Healthchecks Docker pour fiabilité
- ✅ Shallow git clone pour checkout rapide

**Répartition du temps:**
| Étape | Temps cible |
|-------|-------------|
| Checkout | 10-15s |
| Node setup + cache | 30-45s |
| npm ci | 60-90s |
| Verify services | 10-20s |
| Lint | 30-45s |
| Typecheck | 30-60s |
| Tests + Coverage | 90-120s |
| Build | 60-90s |
| **TOTAL** | **4-6 min** ✅ |

## Branch Protection Rules (Configuration Manuelle)

### Configuration GitHub

Pour configurer la protection de la branche `main`:

**1. Aller dans:** GitHub → Settings → Branches → Add branch protection rule

**2. Branch name pattern:**
```
main
```

**3. Activer les options suivantes:**

✅ **Require a pull request before merging**
- Require approvals: 1 (recommandé pour projets en équipe)
- Dismiss stale pull request approvals when new commits are pushed

✅ **Require status checks to pass before merging**
- Require branches to be up to date before merging
- Status checks that are required:
  - `quality-checks` (nom du job CI/CD)

✅ **Require conversation resolution before merging**
- Toutes les conversations doivent être résolues

✅ **Include administrators**
- Applique les règles aux administrateurs

✅ **Restrict who can push to matching branches** (optionnel)
- Limite les pushs directs (recommandé: owner uniquement)

**4. Cliquer sur "Create" ou "Save changes"**

### Vérification

Pour vérifier que les règles sont actives:

1. Créer une branche de test
2. Faire une modification et push
3. Ouvrir une PR vers `main`
4. Vérifier que le check `quality-checks` apparaît
5. Vérifier que le bouton "Merge" est disabled tant que CI n'a pas passé

## Troubleshooting

### Workflow échoue sur "Verify database connection"

**Cause:** Healthchecks Docker pas encore prêts

**Solution:** Le workflow attend automatiquement avec `timeout 30` et netcat. Si ça persiste, vérifier les healthcheck options dans `ci.yml`.

### "npm ci" échoue avec lockfile mismatch

**Cause:** `package-lock.json` désynchronisé

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "fix: update package-lock.json"
```

### Coverage upload échoue

**Cause:** Répertoire `coverage/` non généré

**Solution:** Vérifier que `jest.config.ts` a `collectCoverage: true` ou utiliser `npm run test:coverage`.

### Workflow dépasse 5 minutes

**Solutions:**
1. Vérifier que npm cache est activé (`actions/setup-node` avec `cache: 'npm'`)
2. Réduire les timeouts dans `jest.config.ts`
3. Considérer le split en workflows séparés (PR checks vs Deploy)

### TypeScript errors en CI mais pas localement

**Cause:** Types manquants en CI ou configurations différentes

**Solution:**
```bash
npm run typecheck  # Reproduire localement
```
Vérifier que `tsconfig.json` inclut tous les types nécessaires.

## Local Development Scripts

Scripts npm disponibles pour développement local:

```bash
# Lint
npm run lint              # Check code quality
npm run lint:fix          # Auto-fix linting issues

# Type checking
npm run typecheck         # Validate TypeScript types

# Tests
npm test                  # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
npm run test:integration  # Run integration tests only

# Formatting
npm run format            # Format code with Prettier
npm run format:check      # Check if code is formatted

# Build
npm run build             # Production build
npm run dev               # Development server

# Docker
npm run docker:up         # Start PostgreSQL + Redis
npm run docker:down       # Stop services
npm run test:db:check     # Verify database connection
```

## CI/CD Best Practices

**✅ DO:**
- Commit le `package-lock.json` (nécessaire pour `npm ci`)
- Tester localement avec `npm run lint && npm run typecheck && npm run test:coverage && npm run build`
- Utiliser les scripts npm au lieu des commandes directes
- Résoudre les warnings avant de push

**❌ DON'T:**
- Ne pas commiter de secrets en dur (utiliser GitHub Secrets)
- Ne pas skip les tests avec `--no-verify` (hooks git à venir en Story 0.5)
- Ne pas push directement sur `main` (toujours passer par PR)
- Ne pas ignorer les failures CI

## Security & Secrets

**Credentials dans CI:**
- ✅ Test credentials pour containers éphémères (OK en clair dans env)
- ❌ Production secrets (utiliser GitHub Secrets: Settings → Secrets → Actions)

**GitHub Secrets pour production (Phase 2):**
- `SUPABASE_SERVICE_ROLE_KEY` - Auth production
- `DATABASE_URL` - Database production
- `VERCEL_TOKEN` - Deployment token (si Vercel)

## Next Actions

**Après configuration de branch protection:**

1. ✅ Créer une PR de test pour vérifier le workflow
2. ✅ Vérifier que tous les checks passent
3. ✅ Confirmer que le merge est bloqué si CI échoue
4. ✅ Télécharger le coverage artifact pour validation
5. ✅ Vérifier le temps d'exécution (< 5 min)

**Améliorations futures (Phase 2):**
- Build cache pour Next.js (`.next` directory)
- Test sharding pour grandes suites de tests
- Workflows séparés (PR checks vs Deploy vs Nightly)
- Integration avec Codecov ou Coveralls pour tracking historique
- Playwright tests dans CI (Story future)

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Next.js CI/CD Best Practices](https://nextjs.org/docs/pages/building-your-application/deploying/ci-build-caching)
- [Jest Coverage Configuration](https://jestjs.io/docs/configuration#collectcoverage-boolean)

---

**Document créé:** Story 0.4 - Setup CI/CD Pipeline (GitHub Actions)
**Dernière mise à jour:** 2026-01-13
