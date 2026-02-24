from fastapi import FastAPI
from database import engine
from models import Base

# Skapa FastAPI-applikation
app = FastAPI(
    title="VärderaBil API",
    description="AI-driven bilvärdering - Backend API",
    version="1.0.0"
)

# Skapa databas-tabeller
Base.metadata.create_all(bind=engine)

# Root endpoint (Hello World)
@app.get("/")
def read_root():
    return {
        "message": "VärderaBil API är igång! 🚗",
        "status": "online",
        "version": "1.0.0"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}