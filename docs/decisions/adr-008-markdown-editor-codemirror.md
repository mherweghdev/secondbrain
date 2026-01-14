# ADR-008: Markdown Editor (CodeMirror 6)

## Status

Accepted

## Context

- Epic 1: Note capture requires Markdown editing
- User expectation: Syntax highlighting, auto-save indicator
- Keyboard-first UX: Keyboard shortcuts for formatting
- Accessible: Screen reader support required

## Decision

Use **CodeMirror 6 via @uiw/react-codemirror wrapper**

- React component integration
- Markdown syntax highlighting
- Line numbers and folding support
- Keyboard shortcuts (Ctrl+B for bold, etc.)
- Theme support (light/dark)

## Rationale

- **Modern architecture**: CodeMirror 6 is latest stable
- **Extensible**: Language packs, themes, extensions
- **React-friendly**: `@uiw/react-codemirror` wrapper
- **Performance**: Efficient rendering for large notes
- **Accessibility**: ARIA attributes supported

## Consequences

### Positive

- ✅ Professional editor UX
- ✅ Markdown-first design
- ✅ Syntax highlighting built-in
- ✅ Keyboard shortcuts customizable
- ✅ Mobile-friendly (touch support)

### Negative

- ❌ Bundle size increase (~100KB)
- ❌ Initial setup complexity
- ❌ Custom theming requires CSS knowledge

## Alternatives Considered

### Alternative A: @toast-ui/react-editor

- ✅ **Advantages**: WYSIWYG + Markdown support
- ❌ **Disadvantages**: Heavier bundle, less keyboard-first
- **Rejected**: CodeMirror more developer-friendly

### Alternative B: Lexical (Meta)

- ✅ **Advantages**: Modern, well-designed
- ❌ **Disadvantages**: New (less stable), fewer examples
- **Rejected**: CodeMirror 6 more mature

### Alternative C: Textarea with Markdown.js

- ✅ **Advantages**: Minimal bundle
- ❌ **Disadvantages**: No syntax highlighting, poor UX
- **Rejected**: User experience too limited

## Implementation Notes

### Installation

```bash
npm install @uiw/react-codemirror @codemirror/lang-markdown
```

### Component Example

```typescript
// components/MarkdownEditor.tsx
'use client'

import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { githubLight } from '@uiw/codemirror-theme-github'

export function MarkdownEditor({ value, onChange }) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={[markdown()]}
      theme={githubLight}
      height="500px"
    />
  )
}
```

### Keyboard Shortcuts

```typescript
// Customizable via keymap extension
const customKeymap = [
  { key: 'Ctrl-b', run: () => insertMarkdown('**', '**') },
  { key: 'Ctrl-i', run: () => insertMarkdown('*', '*') },
  { key: 'Ctrl-k', run: () => insertMarkdown('[', '](url)') }
]
```

## Migration Path

**To Lexical**: 2-3 days to migrate editor components

**To Slate**: 1-2 days if custom plugins needed

## See Also

- [ADR-001: Starter Template](./adr-001-starter-template.md) - React component support
- [ADR-010: Testing Framework](./adr-011-testing-jest-rtl.md) - Editor testing
- [CodeMirror 6 Documentation](https://codemirror.net/)
- [@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror)
