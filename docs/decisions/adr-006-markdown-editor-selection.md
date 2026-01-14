# ADR-006: Markdown Editor Selection

## Status
Accepted

## Date
2026-01-11

## Context

The secondbrain note capture requires a web-based markdown editor with:

**Functional Requirements:**
- Syntax highlighting for markdown
- Keyboard shortcuts (Ctrl+B bold, Ctrl+I italic, Ctrl+K link, etc.)
- Preview side-by-side (optional toggle)
- Auto-save integration (debounced 500ms)
- Pure markdown storage (no WYSIWYG HTML conversion)

**UX Requirements:**
- Keyboard-first experience (100% navigable without mouse)
- Clean, distraction-free interface
- Fast performance (no lag during typing)
- Mobile responsive (Phase 2)

**Technical Requirements:**
- React/Next.js compatible
- TypeScript support
- Small bundle size (<100KB for editor library)
- Accessible (WCAG 2.1 AA compliant)

## Decision

We will use **CodeMirror 6** with the `@uiw/react-codemirror` React wrapper.

**Installation:**
```bash
npm install @uiw/react-codemirror @codemirror/lang-markdown
```

**Configuration:**
```typescript
// src/components/notes/NoteEditor.tsx
'use client';

import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { useNoteStore } from '@/stores/note-store';
import { useAutoSave } from '@/hooks/useAutoSave';

export function NoteEditor() {
  const { currentContent, setContent } = useNoteStore();
  const debouncedSave = useAutoSave(500); // 500ms debounce

  const handleChange = (value: string) => {
    setContent(value);
    debouncedSave(value); // Auto-save after 500ms of no typing
  };

  return (
    <div className="note-editor">
      <CodeMirror
        value={currentContent}
        extensions={[markdown()]}
        onChange={handleChange}
        theme="light"
        basicSetup={{
          lineNumbers: false,        // Clean interface
          foldGutter: false,         // No code folding
          highlightActiveLine: true,
          highlightActiveLineGutter: false
        }}
        placeholder="Start typing your note..."
      />
    </div>
  );
}
```

**Keyboard Shortcuts (Built-in):**
- `Ctrl+B`: Bold (`**text**`)
- `Ctrl+I`: Italic (`*text*`)
- `Ctrl+K`: Link (`[text](url)`)
- `Ctrl+Z`: Undo
- `Ctrl+Shift+Z`: Redo
- `Tab`: Indent
- `Shift+Tab`: Outdent

**Custom Keyboard Shortcuts:**
```typescript
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';

const customKeymap = keymap.of([
  ...defaultKeymap,
  { key: 'Ctrl-s', run: () => { saveNote(); return true; } },
  { key: 'Ctrl-/', run: () => { togglePreview(); return true; } }
]);

<CodeMirror
  extensions={[markdown(), customKeymap]}
  // ...
/>
```

**Preview Side-by-Side:**
```typescript
// src/components/notes/NoteEditorWithPreview.tsx
import ReactMarkdown from 'react-markdown';

export function NoteEditorWithPreview() {
  const [showPreview, setShowPreview] = useState(false);
  const { currentContent } = useNoteStore();

  return (
    <div className="flex">
      <div className="flex-1">
        <NoteEditor />
      </div>
      {showPreview && (
        <div className="flex-1 border-l p-4">
          <ReactMarkdown>{currentContent}</ReactMarkdown>
        </div>
      )}
      <button onClick={() => setShowPreview(!showPreview)}>
        {showPreview ? 'Hide Preview' : 'Show Preview'}
      </button>
    </div>
  );
}
```

## Consequences

### Positive
- **Modern Architecture**: CodeMirror 6 is latest version (v5 EOL)
- **Syntax Highlighting**: Built-in markdown support with `@codemirror/lang-markdown`
- **Keyboard Shortcuts**: Comprehensive keybindings out-of-the-box
- **Performance**: Virtualized rendering (handles 100,000+ line documents)
- **Extensible**: Rich extension API for custom functionality
- **Accessible**: WCAG 2.1 AA compliant
- **TypeScript Native**: Full TypeScript support
- **Small Bundle**: ~50KB (gzipped) for core + markdown mode
- **React Integration**: `@uiw/react-codemirror` provides clean React API

### Negative
- **Learning Curve**: CodeMirror 6 API more complex than simple textarea
- **Migration from v5**: Many v5 plugins not yet ported to v6 (not applicable for new project)
- **Bundle Size**: Larger than plain textarea (acceptable trade-off for features)

### Trade-offs Accepted
- **No WYSIWYG**: Pure markdown editing (intentional - markdown-native requirement)
- **Preview as Separate Component**: Side-by-side preview vs inline WYSIWYG (better for markdown purists)

## Alternatives Considered

### Alternative 1: TipTap (Prosemirror-based)
- **Pros**:
  - Modern, extensible editor
  - WYSIWYG with markdown shortcuts
  - React hooks API
  - Great TypeScript support
- **Cons**:
  - **WYSIWYG conflicts with markdown-native requirement**: Stores content as HTML/JSON, not pure markdown
  - Heavier bundle (~150KB)
  - More complex API for simple markdown editing
- **Rejected Because**: Requirement is pure markdown storage, not WYSIWYG

### Alternative 2: @toast-ui/react-editor
- **Pros**:
  - Dual-mode: WYSIWYG + markdown
  - Korean-backed (Toast UI), production-ready
  - Built-in preview toggle
- **Cons**:
  - Heavy bundle (~200KB)
  - Less flexible than CodeMirror
  - WYSIWYG mode unnecessary complexity
  - Styling harder to customize
- **Rejected Because**: Overkill for pure markdown editing, bundle size too large

### Alternative 3: SimpleMDE / EasyMDE
- **Pros**:
  - Simple API
  - Built-in toolbar
  - Preview toggle included
- **Cons**:
  - Based on CodeMirror 5 (EOL)
  - No TypeScript support
  - Limited extensibility
  - Unmaintained (last update 2+ years ago)
- **Rejected Because**: Built on deprecated CodeMirror 5, no TypeScript

### Alternative 4: Monaco Editor (VS Code Editor)
- **Pros**:
  - Same editor as VS Code
  - Excellent TypeScript support
  - Rich features (IntelliSense, diff editor)
- **Cons**:
  - **Massive bundle**: ~2MB (even with tree-shaking)
  - Overkill for markdown editing
  - Complex setup for React integration
  - Designed for code, not markdown
- **Rejected Because**: 40x larger bundle than CodeMirror for features we don't need

### Alternative 5: Plain Textarea + Manual Implementation
- **Pros**:
  - Zero dependencies
  - Tiny bundle (built-in HTML)
- **Cons**:
  - No syntax highlighting
  - No keyboard shortcuts (must implement manually)
  - Poor UX for markdown editing
  - No undo/redo stack
  - Reinventing the wheel
- **Rejected Because**: Poor UX, weeks of work to implement features CodeMirror provides

### Alternative 6: Lexical (Facebook)
- **Pros**:
  - Modern, extensible framework
  - React-first design
  - Facebook-backed
- **Cons**:
  - Newer/less mature than CodeMirror
  - More complex API (requires building editor from scratch)
  - No out-of-box markdown mode
  - Smaller community/ecosystem
- **Rejected Because**: CodeMirror more mature with better markdown support

## Related Decisions
- ADR-005: Frontend State Management (Zustand stores editor content)
- Epic 1 (Note Capture): Editor is core component of note capture workflow
- Epic 4 (Refinement): Editor reused for editing notes during refinement

## Implementation Notes

**Epic 1 Story 1.1: Implement Note Editor**

1. Install dependencies:
```bash
npm install @uiw/react-codemirror @codemirror/lang-markdown
npm install react-markdown  # For preview
```

2. Create editor component:
```bash
mkdir -p src/components/notes
touch src/components/notes/NoteEditor.tsx
```

3. Create auto-save hook:
```typescript
// src/hooks/useAutoSave.ts
import { useCallback, useRef } from 'react';

export function useAutoSave(delay: number = 500) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((content: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      // Save to API
      await fetch('/api/notes/current', {
        method: 'PATCH',
        body: JSON.stringify({ content }),
        headers: { 'Content-Type': 'application/json' }
      });
    }, delay);
  }, [delay]);
}
```

**Success Criteria:**
- ✅ Editor renders with markdown syntax highlighting
- ✅ Keyboard shortcuts work (Ctrl+B, Ctrl+I, Ctrl+K)
- ✅ Auto-save triggers 500ms after last keystroke
- ✅ Content persists in Zustand store during typing
- ✅ Preview toggle works (side-by-side markdown rendering)

**Testing Pattern:**
```typescript
// src/components/notes/NoteEditor.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteEditor } from './NoteEditor';

describe('NoteEditor', () => {
  it('renders with placeholder text', () => {
    render(<NoteEditor />);
    expect(screen.getByPlaceholderText('Start typing your note...')).toBeInTheDocument();
  });

  it('updates content on typing', async () => {
    render(<NoteEditor />);
    const editor = screen.getByRole('textbox');

    await userEvent.type(editor, '# Hello World');

    expect(useNoteStore.getState().currentContent).toBe('# Hello World');
  });

  it('triggers auto-save after 500ms', async () => {
    jest.useFakeTimers();
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({} as Response);

    render(<NoteEditor />);
    const editor = screen.getByRole('textbox');

    await userEvent.type(editor, 'Test content');

    // Fast-forward 500ms
    jest.advanceTimersByTime(500);

    expect(mockFetch).toHaveBeenCalledWith('/api/notes/current', {
      method: 'PATCH',
      body: JSON.stringify({ content: 'Test content' }),
      headers: { 'Content-Type': 'application/json' }
    });

    jest.useRealTimers();
  });
});
```

**Styling (Tailwind CSS):**
```typescript
<CodeMirror
  className="min-h-[500px] border rounded-lg"
  // Custom theme via className
/>
```

**Custom Theme (Light/Dark):**
```typescript
import { EditorView } from '@codemirror/view';

const customTheme = EditorView.theme({
  "&": {
    backgroundColor: "#ffffff",
    color: "#1f2937"
  },
  ".cm-content": {
    fontFamily: "ui-monospace, monospace",
    fontSize: "14px",
    lineHeight: "1.6"
  },
  ".cm-gutters": {
    backgroundColor: "#f9fafb",
    border: "none"
  }
}, { dark: false });

<CodeMirror extensions={[markdown(), customTheme]} />
```

**Mobile Responsiveness (Phase 2):**
```typescript
const isMobile = useMediaQuery('(max-width: 768px)');

<CodeMirror
  basicSetup={{
    lineNumbers: !isMobile,  // Hide line numbers on mobile
    // ... other mobile optimizations
  }}
/>
```

**Performance Optimization:**
```typescript
// Memoize editor to prevent unnecessary re-renders
const MemoizedCodeMirror = React.memo(CodeMirror);

// Use in component
<MemoizedCodeMirror
  value={currentContent}
  onChange={handleChange}
  extensions={[markdown()]}
/>
```

**Accessibility:**
- CodeMirror 6 has built-in screen reader support
- ARIA labels automatically applied
- Keyboard navigation fully functional
- No additional work needed for WCAG 2.1 AA compliance

**Future Enhancements (Phase 2):**
- Collaborative editing (via Y.js or OT)
- Vim mode (`@codemirror/legacy-modes/mode/vim`)
- Autocomplete for hashtags/mentions (`@codemirror/autocomplete`)
- Spell checking (`@codemirror/spellcheck`)
