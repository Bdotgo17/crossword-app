# Crossword App (starter)

This workspace contains a minimal full-stack crossword starter app.

Structure
- `frontend` - Vite + React + TypeScript app (dev: 5173)
- `backend` - Node + Express + TypeScript API (dev: 4000)

Quick start (macOS / zsh)

Install dependencies:

```bash
npm install
```

Run both in dev (root):

```bash
npm run dev
```

The frontend dev server will proxy API calls to `http://localhost:4000/api` (CORS is enabled).

Build for production:

```bash
npm run build
# then serve the backend start script which will serve built frontend when present
npm run start
```

Notes
- Example puzzle JSON is in `backend/src/puzzles/example.json`.
- Backend tests: `npm --workspace backend test`.
