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

Getting started (explicit)

1) Install dependencies for both workspaces (from project root):

```bash
npm install
npm --workspace frontend install
npm --workspace backend install
```

2) Start both dev servers in separate terminals (or use `npm run dev` from root):

Frontend (Vite):

```bash
cd frontend
npm run dev
# opens on http://localhost:5173
```

Backend (API):

```bash
cd backend
npm run dev
# API on http://localhost:4000
```

3) Build for production and start the backend (serves built frontend when present):

```bash
npm run build
npm --workspace backend run start
```

Troubleshooting
- If `gh` or Homebrew steps were run during setup, ensure the `origin` remote is set correctly: `git remote -v`.
- If ports are in use, update `frontend` or `backend` `package.json` dev scripts to use free ports.

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
