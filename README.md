# VärderaBil — Smart Vehicle Valuation Platform

A modern web application that helps car owners get instant, transparent market valuations for their vehicles.

## About the Project

VärderaBil allows users to:
- Enter vehicle details (make, model, year, mileage, condition)
- Receive an instant market valuation estimate
- Download the result as a professional PDF report
- Compare different vehicles side-by-side

No registration required for basic valuations — simple, fast, and trustworthy.

## Tech Stack

**Frontend:**
- React 19 (with Vite)
- Tailwind CSS
- React Router

**Backend:**
- FastAPI (Python)
- SQLite / PostgreSQL
- SQLAlchemy ORM

**Tools:**
- Bun (package manager)
- Git & GitHub
- VS Code

**Deployment:**
- Vercel (frontend)
- Render / Railway (backend)

## Installation & Setup

### Prerequisites
- Bun v1.3+
- Python 3.10+
- Git

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/AIbyAhmed/varderabil.git
cd varderabil/frontend

# Install dependencies
bun install

# Start development server
bunx --bun vite
```

The app will run at `http://localhost:5173/`

### Backend Setup (Coming Soon)

Backend will be added in Week 2 of development.

## Project Timeline

**Total Duration:** 3 weeks (15 working days)

- **Week 1:** Frontend development (React pages, Tailwind styling, routing)
- **Week 2:** Backend API (FastAPI, database, CRUD endpoints)
- **Week 3:** Integration, testing, deployment

## Development Notes

### Why Bun instead of npm?
This project uses Bun due to ARM64 Windows compatibility issues with npm and Rollup. Bun provides native ARM64 support and is faster than npm while remaining 100% compatible with npm packages.

## Author

**Ahmed & Ali**  
EC Utbildning — Web Development Program

## License

Educational project for EC Utbildning. 

## Links

- [Miro Planning Board](https://miro.com/app/board/uXjVGDaFPX4=/)
