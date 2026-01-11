# Documentation Policy: Minimaliste

**Philosophie**: Le code est la meilleure documentation. Écrire minimalement, mettre à jour l'existant.

---

## 🎯 Règle Principale

**NE PAS créer de nouvelles documentations**.

Avant de créer un fichier doc:
1. Chercher une documentation existante
2. Si elle existe → la mettre à jour
3. Si elle n'existe pas → demander à Matthieu avant de la créer

---

## ✅ Documents EXISTANTS à Utiliser

### 1. **workflow.md** (Architecture globale)
- À JOUR et complet
- Contient: architecture, sprints, processus API, déploiement
- **Mettre à jour si**: changement d'architecture, de processus

### 2. **api-contract/openapi.yaml** (Source de vérité API)
- Source de vérité pour tous les endpoints
- Types TypeScript générés automatiquement
- **Mettre à jour si**: nouvel endpoint, changement de réponse

### 3. **Code Comments** (Explications inline)
- "Pourquoi" pas "quoi"
- Rester bref
- Exemple:
  ```typescript
  // Only send to active users (inactive can't authenticate)
  const activeUsers = users.filter(u => u.status === 'active');
  ```

### 4. **Tests** (Documentation par l'exemple)
- Tests = la meilleure documentation
- Montrent quoi faire, comment l'utiliser
- Exemple:
  ```typescript
  test('activateTrial should set expiration to 30 days', () => {
    const trial = activateTrial(userId);
    expect(trial.expiresAt).toEqual(now + 30 * 24 * 60 * 60 * 1000);
  });
  // ← Ce test explique mieux que 100 mots
  ```

### 5. **README.md** (Setup et quick start)
- Existent dans chaque dossier (backend, admin-web)
- Contiennent: dépendances, setup local, commandes
- **Mettre à jour si**: changement de setup, dépendances majeures

### 6. **TypeScript Types** (Documentation implicite)
- Types strictes = documentation auto-vérifiée
- Exemple:
  ```typescript
  interface Trial {
    id: string;
    user_id: string;
    status: 'active' | 'expired' | 'used';
    expiresAt: Date;
    createdAt: Date;
  }
  // ← Type explicite, pas besoin de doc séparée
  ```

---

## ❌ Absolument INTERDIT

❌ Créer `docs/`, `ARCHITECTURE.md`, `API.md` (sauf demande explicite Matthieu)
❌ Créer `GUIDE.md`, `HOW_TO.md`, tutoriels
❌ Créer `DATABASE_SCHEMA.md` (utiliser Prisma schema + types)
❌ Créer `SETUP.md` (mettre à jour README.md existant)
❌ Docstrings trop longues (max 2-3 lignes)

---

## ✅ À FAIRE

### Cas 1: Nouvel endpoint API
1. ✅ Ajouter dans `api-contract/openapi.yaml`
2. ✅ Types générés automatiquement
3. ✅ Implémenter dans backend
4. ✅ Écrire tests (le test explique l'usage)
5. ❌ Pas de fichier doc séparé

### Cas 2: Changement important
1. ✅ Mettre à jour `workflow.md` si affecte le processus
2. ✅ Ajouter commentaire dans le code
3. ✅ Écrire tests pour montrer le comportement
4. ❌ Pas de nouveau document

### Cas 3: Bug complexe à fixer
1. ✅ Écrire un test qui le reproduit
2. ✅ Ajouter JSDoc bref au-dessus de la fonction
3. ✅ Commenter dans le code (le "pourquoi" du fix)
4. ❌ Pas de `BUGFIX.md`

### Cas 4: Configuration sensible
1. ✅ Documenter dans `.env.example` (montrer format)
2. ✅ Valider avec Zod/Joi (auto-documenter)
3. ✅ Utiliser enums TypeScript si options limitées
4. ❌ Pas de `CONFIG.md`

---

## 📝 JSDoc: Usage Minimal

**Ajouter JSDoc SEULEMENT si**:
- Fonction publique (exportée)
- Comportement non obvieux
- Peut lancer des erreurs

**Format court** (max 3 lignes):
```typescript
/**
 * Activate trial for user. Creates 30-day subscription.
 * @throws {NotFoundError} if user doesn't exist
 */
async function activateTrial(userId: string): Promise<Trial> {
  // ...
}
```

**PAS de JSDoc pour** (code auto-explicite):
```typescript
// ❌ Inutile
/**
 * Get user by ID
 * @param id User ID
 * @returns User object
 */
function getUser(id: string): User {

// ✅ Code parle pour lui
function getUser(id: string): User {
```

---

## 🗂️ Structure Documentation Actuellement

```
copi-vtc/
├── workflow.md                 ✅ UTILISER (architecture globale)
├── api-contract/
│   └── openapi.yaml           ✅ UTILISER (source de vérité API)
│   └── README.md              ✅ Peut mettre à jour
├── copi-backend/
│   ├── README.md              ✅ Peut mettre à jour
│   ├── src/                   ✅ Code comments OK
│   └── __tests__/             ✅ Tests = docs
├── copi-admin-web/
│   ├── README.md              ✅ Peut mettre à jour
│   ├── src/                   ✅ Code comments OK
│   └── __tests__/             ✅ Tests = docs
└── .claude/rules/             ← Tu es ici! Agent rules
```

---

## 📌 Checklist Documentation

Avant de soumettre du code:
- [ ] Ai-je cherché une doc existante avant de la créer?
- [ ] Mes commentaires expliquent le "pourquoi" pas le "quoi"?
- [ ] Mes tests documentent l'usage?
- [ ] J'ai mis à jour workflow.md si changement d'architecture?
- [ ] J'ai mis à jour openapi.yaml si changement d'API?
- [ ] J'ai mis à jour README si changement de setup?
- [ ] Pas de nouveaux fichiers doc créés sans raison?

---

## 💡 Philosophie

> "Code + Tests + Comments = meilleure doc que docs/README.md"

- Tests montrent comment utiliser le code
- Types TypeScript montrent la structure des données
- Comments expliquent les "pourquoi" non-évidentes
- Code bien nommé ne nécessite pas d'explication

Résultat: moins de docs à maintenir, plus facile d'update, moins de doc out-of-date.