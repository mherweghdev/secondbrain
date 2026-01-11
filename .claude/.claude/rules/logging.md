# Règles de Logging — structlog (Backend) & Console (Frontend)

## Philosophie

Le logging doit être **informatif sans être verbeux**, **structuré** et **actionnable**. Chaque log doit avoir un but clair : debug en développement, monitoring en production, ou alerte en cas d'erreur critique.

---

## 🐍 Backend: structlog (Python)

### Import et utilisation de base

```python
import structlog

logger = structlog.get_logger(__name__)

# ❌ NE JAMAIS utiliser print()
print("User data:", user)  # INTERDIT

# ✅ TOUJOURS utiliser le logger
logger.info("user_logged_in", user_id=user.id)
```

### Configuration (app/core/logging.py)

```python
import structlog

def configure_logging(log_level: str = "INFO") -> None:
    structlog.configure(
        processors=[
            structlog.stdlib.add_log_level,
            structlog.stdlib.add_logger_name,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.JSONRenderer(),  # Production: JSON
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )
```

---

## 📊 Niveaux de log et usage

### `logger.error()` - Erreurs critiques

**Quand l'utiliser :**
- Échec d'opération critique (création note, authentification, DB)
- Exceptions non gérées
- Erreurs qui nécessitent une intervention

**Format :**
```python
logger.error(
    "operation_failed",
    error=str(error),
    error_type=type(error).__name__,
    user_id=user_id,
    operation="create_note",
    traceback=traceback.format_exc(),  # Stack trace complète
)
```

**Exemples :**
```python
# ✅ BON - Contexte complet
try:
    note = await note_service.create_note(user_id, content)
except Exception as e:
    logger.error(
        "note_creation_failed",
        error=str(e),
        error_type=type(e).__name__,
        user_id=user_id,
        content_length=len(content),
    )
    raise

# ❌ MAUVAIS - Message vague
logger.error("Error occurred", error=str(e))
```

### `logger.warning()` - Avertissements

**Quand l'utiliser :**
- Situations anormales mais non critiques
- Dégradation de service (fallback, retry)
- Limites approchées (quota, rate limit)

**Exemples :**
```python
# ✅ Service dégradé
if cache_error:
    logger.warning(
        "cache_unavailable_using_db",
        error=str(cache_error),
        fallback="database",
    )

# ✅ Limite approchée
if note_count > 8000:
    logger.warning(
        "user_note_quota_near_limit",
        user_id=user_id,
        current_count=note_count,
        limit=10000,
        percentage=80,
    )
```

### `logger.info()` - Événements importants

**Quand l'utiliser :**
- Événements métier significatifs (inscription, connexion, création note)
- Démarrage/arrêt de services
- Changements d'état importants

**Exemples :**
```python
# ✅ Événements métier
logger.info(
    "user_registered",
    user_id=user.id,
    email=user.email,
    registration_method="oauth",
)

logger.info(
    "note_created",
    note_id=note.id,
    user_id=user_id,
    content_length=len(content),
)

# ✅ Démarrage de service
logger.info(
    "server_started",
    host=host,
    port=port,
    environment=settings.ENVIRONMENT,
)

# ❌ MAUVAIS - Détails techniques non pertinents en info
logger.info("database_query_executed", sql=query, duration=25)
```

### `logger.debug()` - Détails techniques

**Quand l'utiliser :**
- Flux de données (transformations, validations)
- Appels d'API externes
- Détails d'implémentation
- Debugging local

**Important :** Les logs debug sont **masqués en production** (sauf si LOG_LEVEL=debug)

**Exemples :**
```python
# ✅ Transformation de données
logger.debug(
    "data_transformed",
    before=raw_data,
    after=transformed_data,
)

# ✅ Appel API externe
logger.debug(
    "calling_external_api",
    url=api_url,
    method="POST",
    # JAMAIS de tokens en clair !
)

# ❌ MAUVAIS - Information sensible
logger.debug("user_password", password=password)  # INTERDIT !
```

---

## 🔑 Métadonnées structurées

### Format recommandé

```python
logger.level(
    "event_name",  # snake_case, descriptif
    # Identifiants
    user_id=user_id,
    note_id=note_id,
    
    # Contexte d'erreur
    error=str(error),
    error_type=type(error).__name__,
    
    # Données métier
    content_length=len(content),
    status=status,
    
    # Métriques
    duration_ms=duration,
    count=count,
)
```

### Règles pour les métadonnées

**✅ À FAIRE :**
- Utiliser des objets structurés (kwargs, pas de strings concaténées)
- Noms de champs en snake_case
- Inclure les IDs pour traçabilité
- Sanitizer les données sensibles

**❌ À ÉVITER :**
- Mots de passe, tokens, clés API
- Données personnelles sensibles
- Objets circulaires (request/response complets)
- Données trop volumineuses (base64 images)

```python
# ✅ BON - Données sanitisées
logger.info(
    "api_call",
    endpoint="/api/v1/notes",
    method="POST",
    status_code=201,
    duration_ms=145,
    user_id=user.id,  # Seulement l'ID
)

# ❌ MAUVAIS - Données sensibles
logger.info(
    "user_created",
    user={
        "email": "user@example.com",
        "password": "plaintext123",  # INTERDIT !
    }
)
```

---

## 🎯 Contexte des erreurs

### Toujours inclure l'exception complète

```python
# ✅ BON - Stack trace complète
try:
    await dangerous_operation()
except Exception as e:
    logger.error(
        "operation_failed",
        error=str(e),
        error_type=type(e).__name__,
        exc_info=True,  # Ajoute automatiquement la stack trace
    )
    raise

# ❌ MAUVAIS - Perte de la stack trace
except Exception as e:
    logger.error("operation_failed", message=str(e))
```

---

## 🌐 Frontend: Console API

### Utilisation structurée

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[INFO] ${message}`, data);
    }
  },
  
  warn: (message: string, data?: Record<string, unknown>) => {
    console.warn(`[WARN] ${message}`, data);
  },
  
  error: (message: string, error?: Error, data?: Record<string, unknown>) => {
    console.error(`[ERROR] ${message}`, { error, ...data });
    // En production: envoyer à Sentry
  },
  
  debug: (message: string, data?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
};

// Usage
logger.info('note_created', { noteId: note.id });
logger.error('fetch_failed', error, { endpoint: '/api/notes' });
```

---

## 📏 Logging dans les Services

**Backend**:
```python
# app/services/note_service.py
class NoteService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.logger = structlog.get_logger(__name__)
    
    async def create_note(self, user_id: str, content: str) -> Note:
        self.logger.debug(
            "create_note_called",
            user_id=user_id,
            content_length=len(content),
        )
        
        try:
            note = Note(user_id=user_id, content=content)
            self.db.add(note)
            await self.db.commit()
            
            self.logger.info(
                "note_created",
                note_id=note.id,
                user_id=user_id,
            )
            
            return note
        except Exception as e:
            self.logger.error(
                "note_creation_failed",
                error=str(e),
                error_type=type(e).__name__,
                user_id=user_id,
                exc_info=True,
            )
            await self.db.rollback()
            raise
```

---

## 📌 Messages de log - Guidelines

### Format des messages

```python
# ✅ BON - snake_case, descriptif
logger.error("payment_processing_failed", ...)
logger.info("user_registered", ...)
logger.warning("cache_miss", ...)
logger.debug("data_transformed", ...)

# ❌ MAUVAIS - Trop verbeux
logger.error("An error occurred while trying to process payment", ...)

# ❌ MAUVAIS - Pas assez descriptif
logger.error("error", ...)
```

---

## 🔧 Configuration par environnement

### Développement (local)
```bash
LOG_LEVEL=DEBUG  # Tout afficher
```

### Staging
```bash
LOG_LEVEL=INFO   # Info + warn + error
```

### Production
```bash
LOG_LEVEL=WARNING   # Seulement warn + error
```

---

## ❌ Anti-patterns à éviter

### Logging dans des boucles

```python
# ❌ MAUVAIS
for note in notes:
    logger.info("processing_note", note_id=note.id)  # 1000 logs !

# ✅ BON
logger.info(
    "processing_notes_batch",
    count=len(notes),
    sample_ids=notes[:5].map(lambda n: n.id),  # Premiers 5 seulement
)
```

---

## ✅ Checklist avant commit

- [ ] Aucun `print()` dans le code backend
- [ ] Aucun `console.log()` non structuré dans le frontend
- [ ] Pas de données sensibles (mots de passe, tokens)
- [ ] Messages en snake_case, descriptifs
- [ ] Métadonnées structurées (kwargs/objects)
- [ ] Niveau de log approprié (error/warn/info/debug)
- [ ] Contexte suffisant pour debugging
- [ ] Exceptions complètes (exc_info=True)

---

## 📚 Ressources

- [structlog Documentation](https://www.structlog.org/)
- Configuration: `backend/app/core/logging.py`
- LOG_LEVEL dans `.env`: DEBUG, INFO, WARNING, ERROR
