# Glossaire SecondBrain

**Dernière mise à jour**: 2025-01-10

---

## 📚 Concepts Métier

### Note
Unité de base de capture. Texte libre en format Markdown, créé rapidement par l'utilisateur sans friction. Une note peut contenir :
- Idée rapide
- Todo
- Résumé de réunion
- Insight
- Question

**Exemple**: "Idée: système de tags automatique par IA pour organiser les notes"

### Inbox
Zone de réception temporaire des notes capturées. Avant tout traitement/organisation. Concept emprunté à GTD (Getting Things Done). Dans SecondBrain, l'inbox est implicite : toutes les notes récentes non encore incluses dans un digest.

### Digest
Résumé automatique généré par IA des notes d'une période donnée (hebdomadaire par défaut). Un digest contient :
- **Résumé narratif** : 2-3 paragraphes synthétisant la semaine
- **Thèmes** : Sujets principaux détectés automatiquement
- **Actions** : TODOs extraits automatiquement des notes
- **Connexions** : Liens avec notes/concepts plus anciens

**Exemple de thème détecté**: "Optimisation énergétique" (si plusieurs notes mentionnent énergie, consommation, etc.)

### Capture Rapide (Quick Capture)
Action de saisir une note en moins de 5 secondes. Principe clé du produit : minimiser la friction entre l'idée et le stockage.

**Workflow**: Pensée → Interface (1 clic) → Champ texte → Bouton "Capturer" → Sauvegardé

### Tag Automatique (futur V2)
Catégorie assignée automatiquement par IA à une note pour faciliter la recherche et l'organisation. Exemples : #travail, #personnel, #idées, #todo.

**Différence avec tags manuels**: L'utilisateur ne choisit JAMAIS les tags, l'IA le fait.

### Recherche Sémantique (futur V2)
Recherche par concept/sens, pas juste par mots-clés exacts. Utilise les embeddings (vecteurs) pour trouver des notes similaires même si les mots sont différents.

**Exemple**: Recherche "optimisation" → trouve aussi notes avec "efficiency", "amélioration des process", "réduction des coûts".

### Embedding
Représentation vectorielle (numérique) d'un texte. Permet de comparer la similarité sémantique entre deux textes. Généré par un modèle IA (OpenAI, sentence-transformers, etc.).

**Technique**: Stocké dans PostgreSQL avec extension pgvector.

---

## 🔤 Acronymes Projet

### TDD
**Test-Driven Development** - Écrire les tests AVANT le code. Philosophie centrale du projet (voir `.claude/rules/testing.md`).

### ADR
**Architecture Decision Record** - Document traçant une décision technique importante. Format : Contexte → Options → Choix → Raison → Conséquences. (Voir `.claude/context/decisions.md`)

### MVP
**Minimum Viable Product** - Version minimale du produit avec juste les features essentielles pour valider le concept. SecondBrain MVP = Capture rapide + Liste notes + Digest hebdo + Auth basique.

### IA / AI
**Intelligence Artificielle** - Dans le contexte SecondBrain, fait référence à l'utilisation de Claude API (Anthropic) pour générer les digests et (futur) la recherche sémantique.

### API
**Application Programming Interface** - Interface de communication entre frontend (Next.js) et backend (FastAPI). Utilise REST + JSON.

### JWT
**JSON Web Token** - Format de token d'authentification utilisé pour sécuriser l'API. Stateless, contient les claims (user_id, etc.) encodés.

### ORM
**Object-Relational Mapping** - Couche d'abstraction entre code Python et base de données SQL. SecondBrain utilise SQLAlchemy.

**Exemple**: `note = await db.query(Note).filter(Note.id == note_id).first()` au lieu de SQL brut.

### CRUD
**Create, Read, Update, Delete** - Opérations de base sur les données. Toutes les APIs REST sont basées sur CRUD.

**Exemple pour notes**:
- Create: POST /api/v1/notes
- Read: GET /api/v1/notes/{id}
- Update: PUT /api/v1/notes/{id}
- Delete: DELETE /api/v1/notes/{id}

---

## 🛠️ Termes Techniques

### pgvector
Extension PostgreSQL pour stocker et rechercher des vecteurs (embeddings). Permet la recherche sémantique via calcul de similarité cosinus.

**Installation**: `CREATE EXTENSION vector;`

### structlog
Librairie Python pour logging structuré (JSON). Permet d'ajouter des métadonnées (user_id, note_id, etc.) à chaque log pour faciliter le debugging.

**Exemple**:
```python
logger.info("note_created", note_id=note.id, user_id=user_id)
# Output JSON: {"event": "note_created", "note_id": "...", "user_id": "..."}
```

### Pydantic
Librairie Python pour validation de données et définition de schémas. Utilisée dans FastAPI pour valider les requêtes/réponses API.

**Exemple**:
```python
class NoteCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=10000)
```

### shadcn/ui
Collection de composants React (basés sur Radix UI + Tailwind) pour construire rapidement une UI propre. Utilisée dans le frontend.

**Caractéristique**: Copy-paste des composants (pas npm install), customisable à 100%.

### Server Components (React)
Nouveauté React 18 / Next.js 14. Composants qui s'exécutent côté serveur (pas de JS envoyé au client). Réduit la taille du bundle et améliore les performances.

**Utilisation SecondBrain**: Pages qui affichent les notes (lecture seule, pas d'interactivité).

### Client Components (React)
Composants React traditionnels qui s'exécutent côté client (navigateur). Nécessaires pour interactivité (forms, clicks, state).

**Utilisation SecondBrain**: Formulaire de capture rapide, boutons de suppression, etc.

---

## 📖 Vocabulaire Ubiquitous Language (DDD)

### User / Utilisateur
Personne qui utilise SecondBrain. Possède un compte (email + password), crée des notes, reçoit des digests.

### Content / Contenu
Le texte Markdown saisi par l'utilisateur dans une note. Peut contenir formatage (bold, lists, links).

### Period / Période
Intervalle de temps pour un digest. Par défaut : 7 jours (hebdomadaire). Futur : quotidien, mensuel.

**Exemple**: Période du digest = 2025-01-03 à 2025-01-10.

### Theme / Thème
Sujet principal détecté automatiquement par l'IA dans un ensemble de notes.

**Exemple**: Si 5 notes parlent d'énergie solaire, le thème "Énergie renouvelable" sera détecté.

### Action Item / Action
Tâche identifiée automatiquement par l'IA dans les notes (phrases commençant par "TODO", "À faire", verbes d'action, etc.).

**Exemple**: Note contient "TODO: appeler le plombier" → Action extraite : "Appeler le plombier".

---

## 🌐 Acronymes Externes (Context)

### GTD
**Getting Things Done** - Méthodologie de productivité de David Allen. SecondBrain s'inspire du concept d'inbox et de capture rapide.

### Zettelkasten
Méthode de prise de notes interconnectées (slip-box en allemand). Inspiré SecondBrain pour l'idée de connexions automatiques entre notes.

### PKM
**Personal Knowledge Management** - Gestion de la connaissance personnelle. Catégorie de produits dont fait partie SecondBrain (avec Notion, Obsidian, Roam Research).

---

## 📝 Notes

- Ce glossaire doit être mis à jour quand un nouveau concept métier est introduit
- Privilégier les définitions courtes et exemples concrets
- Utiliser ce vocabulaire dans le code (noms de variables, fonctions, classes)
