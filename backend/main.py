from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db
from models import Base, Car, Valuation
from schemas import ValuationCreate, ValuationResponse, CarCreate, CarResponse
from typing import List
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="VärderaBil API",
    description="AI-driven bilvärdering - Backend API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Skapa databas-tabeller
Base.metadata.create_all(bind=engine)

BILUPPGIFTER_API_KEY = os.getenv("BILUPPGIFTER_API_KEY")
BILUPPGIFTER_BASE_URL = "https://api.biluppgifter.se/api/v1"


# ─── Hjälpfunktioner ──────────────────────────────────────────────────────────

def _calculate_price(brand: str, model: str, year: int, mileage: int, condition: str) -> int:
    """Beräknar uppskattat marknadspris baserat på biluppgifter."""
    base_price = 300_000

    # Åldersjustering
    age = 2026 - year
    base_price -= age * 8_000

    # Miltalsjustering
    base_price -= mileage * 5

    # Skickjustering
    condition_lower = condition.lower()
    if condition_lower == "excellent":
        base_price += 20_000
    elif condition_lower == "fair":
        base_price -= 20_000
    elif condition_lower == "poor":
        base_price -= 50_000

    return max(base_price, 20_000)


def _parse_vehicle(data: dict, regno: str) -> dict:
    """Extraherar relevanta fält ur Biluppgifter-svaret."""
    basic     = data.get("basic", {}).get("data", {})
    status    = data.get("status", {}).get("data", {})
    technical = data.get("technical", {}).get("data", {})

    mileage_km  = technical.get("mileage") or status.get("mileage")
    mileage_mil = round(mileage_km / 10) if mileage_km else None

    return {
        "regno":            regno,
        "make":             basic.get("make", ""),
        "model":            basic.get("model", ""),
        "year":             basic.get("vehicle_year") or basic.get("model_year"),
        "color":            basic.get("color", ""),
        "fuel_type":        technical.get("fuel_type", ""),
        "engine_volume":    technical.get("engine_volume"),
        "horsepower":       technical.get("power_hp"),
        "mileage_mil":      mileage_mil,
        "status":           status.get("status"),
        "in_traffic":       status.get("status") == 1,
        "first_registered": status.get("first_on_swedish_roads"),
    }


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"message": "VärderaBil API är igång!", "status": "online", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/vehicle/{regno}")
async def get_vehicle(regno: str):
    """Hämtar fordonsinformation från Biluppgifter.se via regnummer."""
    if not BILUPPGIFTER_API_KEY:
        raise HTTPException(status_code=500, detail="API-nyckel saknas. Sätt BILUPPGIFTER_API_KEY i .env")

    regno_clean = regno.upper().strip()
    if len(regno_clean) != 6:
        raise HTTPException(status_code=400, detail="Regnummer måste vara exakt 6 tecken")

    headers = {
        "Authorization": f"Bearer {BILUPPGIFTER_API_KEY}",
        "Accept": "application/json",
        "User-Agent": "VärderaBil/1.0",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            f"{BILUPPGIFTER_BASE_URL}/vehicle/regno/{regno_clean}",
            headers=headers,
            params={"include": "basic,status,technical"},
        )

    if response.status_code == 404:
        raise HTTPException(status_code=404, detail="Fordonet hittades inte")
    if response.status_code == 401:
        raise HTTPException(status_code=401, detail="Ogiltig API-nyckel")
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Fel från Biluppgifter: {response.status_code}")

    return _parse_vehicle(response.json(), regno_clean)


@app.post("/api/valuations", response_model=ValuationResponse)
def create_valuation(valuation: ValuationCreate, db: Session = Depends(get_db)):
    """Skapar en ny värdering med riktig prisalgoritm och sparar i databasen."""
    estimated_price = float(_calculate_price(
        valuation.brand, valuation.model,
        valuation.year, valuation.mileage, valuation.condition
    ))

    db_valuation = Valuation(
        reg_nr=valuation.reg_nr,
        brand=valuation.brand,
        model=valuation.model,
        year=valuation.year,
        mileage=valuation.mileage,
        condition=valuation.condition,
        estimated_price=estimated_price,
    )

    db.add(db_valuation)
    db.commit()
    db.refresh(db_valuation)
    return db_valuation


@app.get("/api/valuations/{valuation_id}", response_model=ValuationResponse)
def get_valuation(valuation_id: int, db: Session = Depends(get_db)):
    valuation = db.query(Valuation).filter(Valuation.id == valuation_id).first()
    if not valuation:
        raise HTTPException(status_code=404, detail="Värdering hittades inte")
    return valuation


@app.get("/api/cars", response_model=List[CarResponse])
def get_cars(db: Session = Depends(get_db)):
    return db.query(Car).all()


@app.post("/api/cars", response_model=CarResponse)
def create_car(car: CarCreate, db: Session = Depends(get_db)):
    db_car = Car(
        brand=car.brand,
        model=car.model,
        year=car.year,
        mileage=car.mileage,
        condition=car.condition,
        price=car.price,
        source=car.source,
    )
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car
