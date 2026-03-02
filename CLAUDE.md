# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

No test framework is configured.

## Architecture

Single-page React app (Vite + React Router v7) with three routes:

| Route | Component | Purpose |
|---|---|---|
| `/` | `src/pages/Home.jsx` | Continent grid landing page |
| `/world-quiz` | `src/pages/WorldQuiz.jsx` | Numbered flag grid with difficulty tabs |
| `/flag/:id` | `src/pages/FlagDetail.jsx` | Individual flag reveal + TTS |

### Data Layer (`src/data/`)

- **`flags.js`** — All 193 UN member states with `{ id, name, code, difficulty }`. IDs are continuous: Easy 1–48, Medium 49–96, Hard 97–144, Impossible 145–193. Also exports `difficultyMeta`, `getFlagById(id)`, `getFlagsByDifficulty(difficulty)`.
- **`continents.js`** — Six continent entries used only on the Home page.
- **`awards.js`** — `AWARDS` object keyed by milestone count (10, 20, 30, 40, 50, 60) and `MILESTONES` array.

### State & Persistence

Visited flags are stored in `localStorage` under the key `"adhi-visited-flags"` as a JSON array of flag IDs. `FlagDetail` writes to this store on mount; `WorldQuiz` reads it to show visit indicators and progress bars.

### Award System

When a visited flag is **new** and `stored.size` hits a milestone (10/20/30/40/50/60), `FlagDetail` sets `currentAward` state, which renders `<AwardBanner>` as a full-screen overlay with CSS fireworks animation.

### Flag Images

Fetched from `https://flagcdn.com/w640/{code}.png` (detail view) and `https://flagcdn.com/w320/{code}.png` (continent cards) / `https://flagcdn.com/w80/{code}.png` (award banner thumbnails) using the ISO 3166-1 alpha-2 `code` field.

### Speech Synthesis

`FlagDetail` uses the Web Speech API (`window.speechSynthesis`) to read the country name aloud. Rate 0.85, pitch 1.1. The utterance is cancelled on component unmount.

### Styling

All styles live in `src/App.css` (page/component styles) and `src/index.css` (global reset + Google Fonts import). No CSS modules or utility framework. CSS custom properties (`--d-color`, `--t-color`, `--n-color`, `--p-angle`, etc.) are used extensively for per-element theming via inline `style` props.

Fonts: **Fredoka One** (headings/badges) + **Baloo 2** (body), loaded from Google Fonts in `index.css`.
