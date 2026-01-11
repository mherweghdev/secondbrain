# Testing Rules — pytest & Jest

**Mantra**: Tests = Source of Truth. Ne les modifie jamais s'ils passent.

---

## 🎯 Règle d'Or: NE JAMAIS MODIFIER UN TEST VALIDÉ

**Situation**: Un test passe ✅, tu ajoutes du code, le test échoue ❌

**❌ MAUVAIS**:
```python
# test_note_service.py
def test_create_note_with_valid_content():
    note = create_note(user_id="user-1", content="Hello")
    assert note.content == "Hello"  # Ce test passe

# Toi tu ajoutes du code et le test échoue
# MAUVAISE SOLUTION: Modifier le test
def test_create_note_with_valid_content():
    note = create_note(user_id="user-1", content="Hello")
    assert note.content == "HELLO"  # ← Modifié pour faire passer!
```

**✅ BON**:
```python
# Si le test échoue, c'est que ton CODE est mauvais, pas le test
# Revenir en arrière et fixer le code dans note_service.py
def create_note(user_id: str, content: str) -> Note:
    # Corriger la logique ici (ne pas upper() le content par exemple)
    return Note(user_id=user_id, content=content)

# Le test reste intact
def test_create_note_with_valid_content():
    note = create_note(user_id="user-1", content="Hello")
    assert note.content == "Hello"  # Unchanged
```

---

## 📁 Structure des Tests

### Backend (pytest)
```
backend/
├── app/
│   ├── services/
│   │   └── note_service.py
│   └── api/
│       └── v1/
│           └── notes.py
└── tests/
    ├── conftest.py              # Fixtures globales
    ├── services/
    │   └── test_note_service.py
    └── api/
        └── v1/
            └── test_notes.py
```

### Frontend (Jest)
```
frontend/
├── src/
│   ├── components/
│   │   └── NoteCard.tsx
│   └── lib/
│       └── api.ts
└── __tests__/
    ├── components/
    │   └── NoteCard.test.tsx
    └── lib/
        └── api.test.ts
```

---

## 🔴 Test-Driven Development (TDD)

**Ordre STRICT**:
1. **Écris le test en premier** (❌ test échoue, RED)
2. **Écris le code minimum** pour le faire passer (✅ test passe, GREEN)
3. **Refactorise** sans casser le test (REFACTOR)

**Exemple Backend (pytest)**:
```python
# 1. Test d'abord (failing)
def test_create_note_requires_content():
    with pytest.raises(ValueError, match="Content required"):
        create_note(user_id="user-1", content="")

# 2. Code minimum
def create_note(user_id: str, content: str) -> Note:
    if not content:
        raise ValueError("Content required")
    return Note(user_id=user_id, content=content)

# 3. Refactorise (test toujours vert)
def create_note(user_id: str, content: str) -> Note:
    validate_content(content)  # Extracted
    return Note(user_id=user_id, content=content)

def validate_content(content: str) -> None:
    if not content or not content.strip():
        raise ValueError("Content required")
```

---

## 🧪 Types de Tests

### 1. Tests Unitaires (80% du coverage)

**Backend (pytest)**:
```python
# test_note_service.py
import pytest
from app.services.note_service import NoteService
from app.models.note import Note

@pytest.fixture
def note_service(db_session):
    return NoteService(db_session)

def test_create_note_success(note_service):
    note = await note_service.create_note(
        user_id="user-1",
        content="Test note"
    )
    assert note.id is not None
    assert note.content == "Test note"
    assert note.user_id == "user-1"

def test_create_note_validates_content(note_service):
    with pytest.raises(ValueError):
        await note_service.create_note(user_id="user-1", content="")
```

**Frontend (Jest)**:
```typescript
// NoteCard.test.tsx
import { render, screen } from '@testing-library/react';
import { NoteCard } from '@/components/NoteCard';

describe('NoteCard', () => {
  const mockNote = {
    id: '1',
    content: 'Test note',
    createdAt: '2025-01-10T10:00:00Z',
  };

  it('renders note content', () => {
    render(<NoteCard note={mockNote} />);
    expect(screen.getByText('Test note')).toBeInTheDocument();
  });

  it('calls onDelete when delete button clicked', () => {
    const handleDelete = jest.fn();
    render(<NoteCard note={mockNote} onDelete={handleDelete} />);
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(handleDelete).toHaveBeenCalledWith('1');
  });
});
```

### 2. Tests d'Intégration (15% coverage)

**Backend**:
```python
# test_note_flow.py
@pytest.mark.integration
async def test_create_and_retrieve_note(client, db_session):
    # Create note
    response = await client.post(
        "/api/v1/notes",
        json={"content": "Integration test"}
    )
    assert response.status_code == 201
    note_id = response.json()["id"]
    
    # Retrieve note
    response = await client.get(f"/api/v1/notes/{note_id}")
    assert response.status_code == 200
    assert response.json()["content"] == "Integration test"
```

### 3. Tests E2E (5% coverage, optionnel MVP)

**Frontend (Playwright ou Cypress)**:
```typescript
// e2e/notes.spec.ts
test('user can create and view note', async ({ page }) => {
  await page.goto('/notes');
  await page.click('button:has-text("New Note")');
  await page.fill('textarea', 'My first note');
  await page.click('button:has-text("Save")');
  
  await expect(page.locator('text=My first note')).toBeVisible();
});
```

---

## 📊 Couverture Minimale

| Module | Couverture min |
|--------|---|
| Backend services | 80% |
| Backend API routes | 70% |
| Frontend components | 70% |
| Frontend utils | 80% |

**Vérifier**:
```bash
# Backend
pytest --cov=app --cov-report=term-missing

# Frontend
npm test -- --coverage
```

---

## 🎭 Mocking Best Practices

### Backend (pytest)

```python
# ✅ BON - Mock spécifique
from unittest.mock import AsyncMock, patch

@pytest.fixture
def mock_db():
    db = AsyncMock()
    db.commit = AsyncMock()
    db.rollback = AsyncMock()
    return db

async def test_create_note_commits(mock_db):
    service = NoteService(mock_db)
    await service.create_note(user_id="user-1", content="Test")
    mock_db.commit.assert_called_once()
```

### Frontend (Jest)

```typescript
// ✅ BON - Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: '1', content: 'Test' }),
  })
) as jest.Mock;

test('fetches notes successfully', async () => {
  const notes = await fetchNotes();
  expect(notes).toHaveLength(1);
  expect(fetch).toHaveBeenCalledWith('/api/notes');
});
```

---

## 🧪 Tester les Erreurs

**Backend**:
```python
def test_get_note_raises_not_found():
    with pytest.raises(NotFoundError, match="Note not found"):
        await service.get_note("nonexistent-id")

def test_create_note_validates_user():
    with pytest.raises(ValidationError) as exc_info:
        await service.create_note(user_id="", content="Test")
    assert "User ID required" in str(exc_info.value)
```

**Frontend**:
```typescript
test('shows error message when fetch fails', async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
  
  render(<NotePage />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

---

## 🏭 Fixtures & Factories

**Backend**:
```python
# conftest.py
import pytest
from app.models.note import Note

@pytest.fixture
def sample_note():
    return Note(
        id="note-1",
        user_id="user-1",
        content="Sample note",
        created_at=datetime.utcnow()
    )

@pytest.fixture
def note_factory():
    def _create_note(**kwargs):
        defaults = {
            "id": f"note-{uuid4()}",
            "user_id": "user-1",
            "content": "Test note",
        }
        return Note(**{**defaults, **kwargs})
    return _create_note

# Usage
def test_with_factory(note_factory):
    note = note_factory(content="Custom content")
    assert note.content == "Custom content"
```

---

## 📏 Avant Merge: Quality Gates

**Backend**:
```bash
pytest                      # Tests unitaires
pytest --cov=app --cov-fail-under=80  # Coverage >= 80%
ruff check .                # Linting
black --check .             # Format
mypy .                      # Type checking
```

**Frontend**:
```bash
npm test                    # Tests unitaires
npm run test:coverage       # Coverage >= 70%
npm run lint                # ESLint
npm run format              # Prettier
npm run build               # Build OK
```

---

## 📌 Checklist de Test

Avant de soumettre du code:
- [ ] Écris les tests EN PREMIER (TDD)
- [ ] Tous les tests passent ✅
- [ ] Couverture >= seuil (80% backend, 70% frontend)
- [ ] Pas de test modifié de la version précédente
- [ ] Mocks appropriés (pas trop / pas trop peu)
- [ ] Noms clairs: `test_should_...` ou `it('should ...')`
- [ ] Tests isolés (pas de dépendances entre tests)
- [ ] Pas de `console.log` ou `print()` dans les tests

---

## 🚨 Exception: Refactoring de Tests

**SEUL** cas où tu peux modifier un test validé:

```python
# Ancien test - fonctionne mais mal écrit
def test_t1():
    n = create(u)
    assert n.exp > datetime.now()

# ✅ OK de refactoriser pour clarté (comportement identique)
def test_create_note_sets_future_expiration():
    note = create_note(user_id="user-1")
    assert note.expires_at > datetime.utcnow()
```

**Condition**: Le comportement testé DOIT rester identique.

---

## 📚 Ressources

- [pytest Documentation](https://docs.pytest.org/)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://testingjavascript.com/)
