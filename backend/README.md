# PicoCards Backend 🚀

The FastAPI server provides the API layer for study deck sharing, collaborative card editing, and JWT sub-domain SSO interception.

## 🛠️ Tech Stack & Requirements

* **Python**: `>=3.12`
* **Package Manager**: [uv](https://github.com/astral-sh/uv) (recommended)
* **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
* **ORM**: [SQLModel](https://sqlmodel.tiangolo.com/) (Pydantic + SQLAlchemy)
* **Migrations**: [Alembic](https://alembic.otierney.net/)
* **Linter/Formatter**: [Ruff](https://github.com/astral-sh/ruff)

## 📁 App Layout

```
backend/
├── app/
│   ├── core/         # DB connection parameters, configuration settings, JWT decode middleware
│   ├── models/       # Relational SQLModel tables (Project, Card, Collaborator)
│   ├── routes/       # Domain routes (/api/projects, /api/cards, /api/projects/.../collaborators)
│   └── main.py       # FastAPI application entrypoint
├── migrations/       # Alembic version schemas
├── pyproject.toml    # Python dependencies (synced with uv)
└── ruff.toml         # Ruff formatting and quality rules
```

## 🚀 Getting Started

### 1. Project Sync
Initialize the virtual environment and install all packages using `uv`:
```bash
uv sync
```

### 2. Database Migrations
Run Alembic migrations to build or update your local SQLite database:
```bash
uv run alembic upgrade head
```

### 3. Run Server
Start the development ASGI server using Uvicorn:
```bash
uv run uvicorn app.main:app --reload --port 8000
```
The API docs will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 4. Code Quality & Testing
Ensure Ruff is fully satisfied:
```bash
uv run ruff check .
uv run ruff format --check .
```
Execute the test suites:
```bash
uv run pytest
```
