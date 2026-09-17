# LARA Shipping Line — Backend API

This is the production backend for the LARA Shipping Line platform, built with FastAPI, PostgreSQL, and SQLAlchemy.
It is designed to be fully integrated with Supabase for Auth, Realtime, and Storage in production.

## Tech Stack
- **Python:** 3.12+ (managed with `uv`)
- **API Framework:** FastAPI
- **Database:** PostgreSQL + SQLAlchemy 2.0
- **Migrations:** Alembic
- **Platform:** Supabase (Auth, Storage, Realtime)

## Environment Setup

1. Configure Python environment:
```bash
uv venv .venv
source .venv/bin/activate
uv pip install -e ".[dev]"
```

2. Create environment variables:
```bash
cp .env.example .env
```
Update `.env` with your local PostgreSQL or Supabase credentials.

3. Database Setup:
If using local PostgreSQL:
```bash
psql -U postgres -c "CREATE DATABASE lara_shipping;"
alembic upgrade head
```

4. Seed the database with demo data:
```bash
python -m scripts.seed
```

### Seed Data Credentials:
- **Admin**: `admin@larashippingline.com` / `Admin@123`
- **Client**: `demo@client.com` / `Client@123`

## Running the Application

Start the local development server:
```bash
uvicorn app.main:app --reload
```
API Documentation will be available at: http://localhost:8000/docs

## Running Tests

```bash
pytest
```
