# PicoCards 📇

PicoCards is an ultra-fast, zero-friction study card application designed strictly to minimize distraction and maximize recall speed. It features a stunning, high-contrast neobrutalist monochromatic theme and a fluid, double-sided study player.

## 🛠️ Tech Stack & Workspace Overview

PicoCards is designed as a modern monorepo:
* **Frontend**: Built using **React + TypeScript + Bun** with **Tailwind CSS v4** and styled entirely with high-contrast neobrutalist rules. Lintel and formatting are managed by **Biome**.
* **Backend**: Powered by **FastAPI + SQLModel + Alembic** running in a fast Python environment synced via `uv`.

## 📁 Repository Directory Structure

```
picocards/
├── .docs/                 # Architectural specifications and guardrails
│   ├── TODO.md            # The master checklist of tasks and phases
│   ├── ARCHITECTURE.md    # Multi-peer JWT auth specifications & DB tables
│   ├── DESIGN.md          # Monochromatic theme guidelines & spacing rules
│   └── CLEAN_CODE.md      # Biome gates and coding paradigms
├── frontend/              # Bun React application
│   ├── src/
│   │   ├── components/    # Reusable UI primitives (e.g. NavigationHeader)
│   │   ├── context/       # Theme, Language, and Auth contexts
│   │   ├── pages/         # Page-by-page feature pages (Homepage, Dashboard, Workspace)
│   │   └── index.css      # Tailwind v4 configuration and global component definitions
│   └── package.json
└── backend/               # FastAPI service
    ├── app/               # FastAPI logic routes & model tables
    ├── pyproject.toml     # uv configuration
    └── README.md          # Backend instructions
```

## 🚀 Running Locally

### Frontend Setup & Launch
Make sure you have [Bun](https://bun.sh/) installed:
```bash
cd frontend
bun install
bun dev
```
To run compilation checks:
```bash
bun tsc --noEmit
```
To lint and format checks:
```bash
bun biome check src
```

### Backend Setup & Launch
Synced via `uv`:
```bash
cd backend
uv sync
uvicorn app.main:app --reload
```
To run standard tests:
```bash
pytest
```
