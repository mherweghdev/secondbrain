# Backend Python/FastAPI — Code Style & Quality

**Objectif**: Code Python cohérent, lisible, maintenable avec FastAPI.

---

## 🎨 Formatage (automatisé via Black)

**Fichier config**: `pyproject.toml`
```toml
[tool.black]
line-length = 88
target-version = ['py311']
include = '\.pyi?$'
```

**Exécution automatique**:
```bash
black .                    # Format tout le code
black --check .            # Vérifier sans modifier
```

---

## 📋 Type Hints (OBLIGATOIRE)

**Toujours utiliser les type hints**:
```python
# ✅ BON
def create_note(user_id: str, content: str) -> Note:
    note = Note(user_id=user_id, content=content)
    return note

async def get_user(user_id: str) -> User | None:
    user = await db.query(User).filter(User.id == user_id).first()
    return user

# ❌ MAUVAIS
def create_note(user_id, content):  # Pas de types
    return Note(user_id=user_id, content=content)
```

**mypy strict mode**:
```toml
# pyproject.toml
[tool.mypy]
python_version = "3.11"
strict = true
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
```

---

## 🔤 Naming Conventions

| Type | Format | Exemple |
|------|--------|---------|
| **Variables/Fonctions** | snake_case | `get_user_notes`, `is_active` |
| **Classes** | PascalCase | `NoteService`, `UserRepository` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS`, `DEFAULT_TIMEOUT` |
| **Fichiers Python** | snake_case | `note_service.py`, `user_repository.py` |
| **Dossiers** | snake_case | `app/services`, `app/models` |
| **Privé (convention)** | _leading_underscore | `_internal_helper()` |

---

## 📏 Fonction: Max 25 lignes

**❌ Mauvais (35 lignes)**:
```python
async def process_user_notes(user_id: str) -> list[Note]:
    if not user_id:
        raise ValueError("user_id required")
    
    user = await db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundError("User not found")
    
    notes = await db.query(Note).filter(Note.user_id == user_id).all()
    active_notes = [n for n in notes if n.status == "active"]
    
    for note in active_notes:
        note.last_accessed = datetime.now()
        # 20 lignes de plus...
    
    await db.commit()
    return active_notes
```

**✅ BON (Décomposé)**:
```python
async def process_user_notes(user_id: str) -> list[Note]:
    """Process and return active notes for a user."""
    validate_user_id(user_id)
    user = await get_user_or_raise(user_id)
    notes = await get_active_notes(user_id)
    await update_last_accessed(notes)
    return notes

def validate_user_id(user_id: str) -> None:
    if not user_id:
        raise ValueError("user_id required")

async def get_user_or_raise(user_id: str) -> User:
    user = await db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundError("User not found")
    return user

async def get_active_notes(user_id: str) -> list[Note]:
    notes = await db.query(Note).filter(Note.user_id == user_id).all()
    return [n for n in notes if n.status == "active"]

async def update_last_accessed(notes: list[Note]) -> None:
    for note in notes:
        note.last_accessed = datetime.now()
    await db.commit()
```

---

## 📦 Imports Organization

**Ordre** (enforced by `ruff`):
1. Standard library
2. Third-party packages
3. Local imports
4. Type imports (séparés avec `TYPE_CHECKING`)

```python
# ✅ BON
import asyncio
from datetime import datetime
from typing import TYPE_CHECKING

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteResponse
from app.services.note_service import NoteService

if TYPE_CHECKING:
    from app.models.user import User
```

---

## 💬 Docstrings: Google Style

**Pour fonctions publiques**:
```python
async def create_note(
    user_id: str,
    content: str,
    db: AsyncSession
) -> Note:
    """Create a new note for a user.
    
    Args:
        user_id: The ID of the user creating the note
        content: The note content in markdown format
        db: Database session
        
    Returns:
        The created Note object
        
    Raises:
        NotFoundError: If user doesn't exist
        ValidationError: If content is empty or too long
    """
    # Implementation...
```

**Pas de docstring pour code auto-explicatif**:
```python
# ❌ Inutile
def get_note_by_id(note_id: str) -> Note | None:
    """Get a note by its ID."""
    return db.query(Note).filter(Note.id == note_id).first()

# ✅ Signature claire, pas besoin de doc
def get_note_by_id(note_id: str) -> Note | None:
    return db.query(Note).filter(Note.id == note_id).first()
```

---

## 🏗️ FastAPI Conventions

### Structure des endpoints
```python
# app/api/v1/notes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, get_current_user
from app.schemas.note import NoteCreate, NoteResponse
from app.services.note_service import NoteService

router = APIRouter(prefix="/notes", tags=["notes"])

@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    note_data: NoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NoteResponse:
    """Create a new note."""
    service = NoteService(db)
    note = await service.create_note(
        user_id=current_user.id,
        content=note_data.content
    )
    return NoteResponse.from_orm(note)
```

### Séparation des responsabilités

**Router** (thin, routing only):
```python
@router.get("/{note_id}")
async def get_note(
    note_id: str,
    service: NoteService = Depends(get_note_service),
) -> NoteResponse:
    note = await service.get_note(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return NoteResponse.from_orm(note)
```

**Service** (business logic):
```python
# app/services/note_service.py
class NoteService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_note(self, note_id: str) -> Note | None:
        result = await self.db.execute(
            select(Note).where(Note.id == note_id)
        )
        return result.scalar_one_or_none()
```

**Repository** (data access, si nécessaire):
```python
# app/repositories/note_repository.py
class NoteRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_id(self, note_id: str) -> Note | None:
        result = await self.db.execute(
            select(Note).where(Note.id == note_id)
        )
        return result.scalar_one_or_none()
```

---

## 🔒 Pydantic Schemas (Validation)

```python
# app/schemas/note.py
from datetime import datetime
from pydantic import BaseModel, Field, validator

class NoteBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=10000)

class NoteCreate(NoteBase):
    """Schema for creating a note."""
    
    @validator("content")
    def content_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Content cannot be empty")
        return v

class NoteResponse(NoteBase):
    """Schema for note response."""
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode)
```

---

## 🗄️ SQLAlchemy Models

```python
# app/models/note.py
from datetime import datetime
from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

class Note(Base):
    __tablename__ = "notes"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow,
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )
```

---

## ✨ DRY: Éviter la duplication

**❌ Mauvais (copié 3x)**:
```python
# note_service.py
if not user_id or len(user_id) != 36:
    raise ValueError("Invalid user_id")

# digest_service.py
if not user_id or len(user_id) != 36:
    raise ValueError("Invalid user_id")
```

**✅ BON (extrait)**:
```python
# app/core/validators.py
def validate_uuid(value: str, field_name: str = "id") -> None:
    if not value or len(value) != 36:
        raise ValueError(f"Invalid {field_name}")

# Utilisé partout
from app.core.validators import validate_uuid
validate_uuid(user_id, "user_id")
```

---

## 🔍 Linting: Ruff

**Configuration** (`pyproject.toml`):
```toml
[tool.ruff]
line-length = 88
target-version = "py311"

[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # pyflakes
    "I",   # isort
    "B",   # flake8-bugbear
    "C4",  # flake8-comprehensions
]
ignore = []

[tool.ruff.lint.isort]
known-first-party = ["app"]
```

**Exécution**:
```bash
ruff check .               # Vérifier
ruff check . --fix         # Corriger automatiquement
```

---

## 🎯 Résumé Checklist

Avant de soumettre du code backend:
- [ ] Type hints partout (mypy passe)
- [ ] Fonctions < 25 lignes
- [ ] Tests existants passent
- [ ] `ruff check .` = 0 erreurs
- [ ] `black --check .` = OK
- [ ] Noms en snake_case
- [ ] Pas de code commenté ou print()
- [ ] Pas de duplication (DRY)
- [ ] Docstrings pour fonctions publiques
- [ ] Pydantic schemas pour validation
- [ ] Logging structuré (pas de print)

---

## 📚 Ressources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic V2 Documentation](https://docs.pydantic.dev/latest/)
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/)
- [Black Code Style](https://black.readthedocs.io/)
- [Ruff Linter](https://docs.astral.sh/ruff/)
