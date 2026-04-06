# Notes SPA (Nuxt v3)
### Implemented by Artyom Babich

My contacts: [Telegram](https://t.me/a_k_o_n_s_t), [CV on HeadHunter](https://spb.hh.ru/resume/99a0dd53ff0d82782a0039ed1f787035786c66)

---

## About

SPA-application for managing notes with todo lists. Built with Nuxt 3 (Composition API, `<script setup>`).

Each note has a title and a list of tasks (todo items) with checkboxes.

### Features

- Create, edit, and delete notes
- Add, remove, edit, and check/uncheck todo items
- Undo/Redo support (Ctrl+Z / Ctrl+Shift+Z)
- Data persistence via localStorage (Pinia store)
- Confirmation modals for destructive actions (no alerts)
- Dark/light theme with system preference detection
- i18n: Russian and English
- Responsive layout (3 / 2 / 1 column grid)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 3, Vue 3 (Composition API) |
| Language | TypeScript (strict) |
| State management | Pinia + localStorage |
| Styling | SCSS Modules, CSS custom properties |
| i18n | @nuxtjs/i18n (lazy loading) |
| Font | Inter (self-hosted via @fontsource) |
| UI components | Custom (UiButton, UiModal, UiCheckbox) |
| Icons | Inline SVG |

## Project Structure

```
├── assets/css/          # Theme (light/dark), global styles, SCSS mixins
├── components/
│   ├── layout/          # Header, LocaleSwitcher, ThemeSwitcher
│   ├── notes/           # NoteCard, TodoItem
│   └── ui/              # UiButton, UiModal, UiCheckbox
├── composables/         # useUndoRedo, useTheme
├── i18n/locales/        # ru.json, en.json
├── layouts/             # Default layout
├── pages/
│   ├── index.vue        # Notes list
│   └── notes/[id].vue   # Create/edit note
├── stores/              # Pinia notes store
└── types/               # TypeScript interfaces
```

## Quick Start

### Docker (recommended)

```bash
docker-compose up
```

App will be available at [http://localhost:3000](http://localhost:3000)

### Local Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
node .output/server/index.mjs
```
