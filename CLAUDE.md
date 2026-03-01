# CLAUDE.md — VärderaBil

## Rules

- Never push to GitHub without asking the user first.
- Never commit or push passwords, API keys, secrets, or any sensitive security information.
- Never commit code that doesn't work — always test locally before committing.
- No large commits — prefer small, clear commits with descriptive messages.
- Never delete or modify varderabil.db directly — always via the API or migrations.
- Never commit the .db file — it must be in .gitignore.
- Never expose backend endpoints without validation — always use schemas.py validation.
- Always ask before making breaking changes to the API structure.
- Never hardcode prices or data in the frontend — it must always come from the backend.
- Always explain what will be done before doing it — no surprises.
- Ask when uncertain — better one question too many than a wrong decision.

## Project

VärderaBil is a school project (EC Utbildning) by Ahmed & Ali.
AI-driven car valuation that compares prices from the entire Swedish car market.

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, React Router
- Backend: FastAPI, SQLite/PostgreSQL, SQLAlchemy
- Package manager: Bun

## Start the Project

### Frontend
cd frontend && npm run dev

### Backend
cd backend && uvicorn main:app --reload
