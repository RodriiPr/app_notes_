# Notes App

A full-stack notes application with tagging and filtering support.

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + Vite | React 18.3, Vite 5.2 |
| Backend | Python + FastAPI | Python 3.11, FastAPI 0.111 |
| ORM | SQLAlchemy + Alembic | 2.0.30 / 1.13.1 |
| Database | PostgreSQL | 16 |
| Container | Docker + Docker Compose | Docker 24+, Compose v2 |

## Requirements

- Docker 24+
- Docker Compose v2 (`docker compose` not `docker-compose`)

## Run

```bash
chmod +x start.sh
./start.sh
```

Then open:
- **Frontend**: http://localhost
- **API Docs**: http://localhost:8000/docs

## Stop

```bash
docker compose down         # stop containers
docker compose down -v      # stop + remove database
```

## Features

### Phase 1
- Create, edit, and delete notes
- Archive / unarchive notes
- View active notes
- View archived notes

### Phase 2
- Create and delete categories
- Assign / remove categories from notes
- Filter notes by category

## Architecture

```
backend/
├── main.py
└── app/
    ├── controllers/   # REST endpoints (FastAPI routers)
    ├── services/      # Business logic
    ├── repositories/  # Data access layer (SQLAlchemy)
    ├── models.py      # DB models
    ├── schemas.py     # Pydantic DTOs
    └── database.py    # DB connection

frontend/
└── src/
    ├── components/    # React components
    ├── services/      # API calls (axios)
    └── App.jsx        # Main app
```
