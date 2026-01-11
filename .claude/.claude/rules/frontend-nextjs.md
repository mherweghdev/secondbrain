# Frontend Next.js/TypeScript — Code Style & Quality

**Objectif**: Code React/Next.js cohérent, lisible, maintenable.

---

## 🎨 Formatage (automatisé via Prettier)

**Fichier config**: `.prettierrc.json`
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**Exécution automatique**:
```bash
npm run format  # Avant chaque commit (via Husky)
```

---

## 📋 TypeScript Strict Mode

**Toujours utiliser**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**❌ INTERDIT**:
```typescript
const x: any = data;  // any is evil
const y = JSON.parse(input);  // Missing type
```

**✅ BON**:
```typescript
interface Note {
  id: string;
  content: string;
  createdAt: string;
}

const note: Note = await fetchNote(id);
```

---

## 🔤 Naming Conventions

| Type | Format | Exemple |
|------|--------|---------|
| **Variables/Fonctions** | camelCase | `getUserNotes`, `isActive` |
| **Components/Types** | PascalCase | `NoteCard`, `UserProfile` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_NOTE_LENGTH`, `API_BASE_URL` |
| **Fichiers Components** | PascalCase | `NoteCard.tsx`, `UserProfile.tsx` |
| **Fichiers Utils** | kebab-case | `note-utils.ts`, `api-client.ts` |
| **Dossiers** | kebab-case | `src/components`, `src/lib` |

---

## 📏 Fonction/Component: Max 25 lignes

**❌ Mauvais (40 lignes)**:
```typescript
export default function NotePage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        setNotes(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {notes.map(note => (
        <div key={note.id}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          // 20 lignes de plus...
        </div>
      ))}
    </div>
  );
}
```

**✅ BON (Décomposé)**:
```typescript
export default function NotePage() {
  const { notes, loading, error } = useNotes();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <NoteList notes={notes} />
    </div>
  );
}

// Hooks séparés
function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes()
      .then(setNotes)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { notes, loading, error };
}

// Components séparés
function NoteList({ notes }: { notes: Note[] }) {
  return (
    <>
      {notes.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}
    </>
  );
}

function NoteCard({ note }: { note: Note }) {
  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
    </div>
  );
}
```

---

## 📦 Imports Organization

**Ordre**:
1. React/Next.js
2. Third-party packages
3. Local components
4. Local utils
5. Types

```typescript
// ✅ BON
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { NoteCard } from '@/components/NoteCard';
import { NoteList } from '@/components/NoteList';

import { fetchNotes } from '@/lib/api';
import { formatDate } from '@/lib/utils';

import type { Note } from '@/types/note';
```

---

## ⚛️ React Best Practices

### Composants Fonctionnels UNIQUEMENT

```typescript
// ✅ BON - Functional component
export function NoteCard({ note }: { note: Note }) {
  return <div>{note.content}</div>;
}

// ❌ MAUVAIS - Class component (obsolète)
class NoteCard extends React.Component {
  render() {
    return <div>{this.props.note.content}</div>;
  }
}
```

### Props Typing

```typescript
// ✅ BON - Interface pour props
interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
  variant?: 'default' | 'compact';
}

export function NoteCard({ note, onDelete, variant = 'default' }: NoteCardProps) {
  return <div>...</div>;
}
```

### Hooks

```typescript
// ✅ BON - Custom hooks avec typage
function useNotes(userId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes(userId).then(setNotes).finally(() => setLoading(false));
  }, [userId]);

  return { notes, loading };
}
```

---

## 🎨 Styling: TailwindCSS

```typescript
// ✅ BON - Classes Tailwind
export function NoteCard({ note }: { note: Note }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{note.title}</h3>
      <p className="mt-2 text-gray-600">{note.content}</p>
    </div>
  );
}

// ❌ MAUVAIS - Inline styles (éviter)
<div style={{ padding: '16px', border: '1px solid gray' }}>
```

---

## 🌐 Next.js App Router Conventions

### Structure de fichiers

```
src/
├── app/
│   ├── (auth)/              # Route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── notes/
│   │   ├── [id]/
│   │   │   └── page.tsx     # Dynamic route
│   │   ├── loading.tsx      # Loading UI
│   │   ├── error.tsx        # Error UI
│   │   └── page.tsx
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── NoteCard.tsx
└── lib/
    ├── api.ts               # API client
    └── utils.ts
```

### Server vs Client Components

```typescript
// ✅ Server Component (default)
export default async function NotePage({ params }: { params: { id: string } }) {
  const note = await fetchNote(params.id);  // Direct data fetching
  return <NoteDisplay note={note} />;
}

// ✅ Client Component (when needed)
'use client';

import { useState } from 'react';

export function NoteEditor({ note }: { note: Note }) {
  const [content, setContent] = useState(note.content);
  // Interactive logic...
  return <textarea value={content} onChange={e => setContent(e.target.value)} />;
}
```

---

## 🔌 API Calls

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(`${API_BASE_URL}/api/notes`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
}

export async function createNote(data: NoteCreate): Promise<Note> {
  const res = await fetch(`${API_BASE_URL}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return res.json();
}
```

---

## 💬 Comments: "Pourquoi", pas "Quoi"

```typescript
// ❌ Mauvais
// Loop through notes and display them
notes.map(note => <NoteCard note={note} />);

// ✅ BON
// Only show notes from last 30 days to avoid overwhelming users
const recentNotes = notes.filter(n => isWithinLast30Days(n.createdAt));
recentNotes.map(note => <NoteCard note={note} />);

// Pas de comment si code auto-explicatif
const activeNotes = notes.filter(n => n.status === 'active');
```

---

## ✨ DRY: Éviter la duplication

```typescript
// ❌ MAUVAIS (répété)
<button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  Save
</button>
<button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  Submit
</button>

// ✅ BON (composant)
function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      {...props}
    >
      {children}
    </button>
  );
}

// Usage
<Button>Save</Button>
<Button>Submit</Button>
```

---

## 🔍 ESLint + Prettier

```bash
npm run lint     # Affiche violations ESLint
npm run format   # Corrige automatiquement (Prettier)
```

**Avant chaque commit**, les deux doivent passer.

---

## 🎯 Résumé Checklist

Avant de soumettre du code frontend:
- [ ] Pas de `any` types
- [ ] Components < 25 lignes (décomposer sinon)
- [ ] Tests existants passent
- [ ] `npm run lint` = 0 erreurs
- [ ] `npm run format` appliqué
- [ ] Noms explicites (camelCase, PascalCase)
- [ ] Pas de code commenté ou console.log
- [ ] Pas de duplication (DRY)
- [ ] Composants fonctionnels uniquement
- [ ] Props typées avec interfaces

---

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
