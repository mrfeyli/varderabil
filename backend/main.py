from fastapi import FastAPI

# Skapa FastAPI-applikation
app = FastAPI(
    title="VärderaBil API",
    description="AI-driven bilvärdering - Backend API",
    version="1.0.0"
)

# Root endpoint (Hello World)
@app.get("/")
def read_root():
    return {
        "message": "VärderaBil API är igång!",
        "status": "online",
        "version": "1.0.0"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}