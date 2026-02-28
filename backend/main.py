from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="VärderaBil API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # I produktion: byt till din frontend-URL
    allow_methods=["GET"],
    allow_headers=["*"],
)

BILUPPGIFTER_API_KEY = os.getenv("BILUPPGIFTER_API_KEY")
BILUPPGIFTER_BASE_URL = "https://api.biluppgifter.se/api/v1"


@app.get("/api/vehicle/{regno}")
async def get_vehicle(regno: str):
    """
    Hämtar fordonsinformation från Biluppgifter.se via regnummer.
    Returnerar märke, modell, årsmodell, miltal m.m.
    """
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

    data = response.json()

    # Mappa Biluppgifter-svaret till vår interna modell
    vehicle = _parse_vehicle(data, regno_clean)
    return vehicle


def _parse_vehicle(data: dict, regno: str) -> dict:
    """Extraherar relevanta fält ur Biluppgifter-svaret."""
    basic = data.get("basic", {}).get("data", {})
    status = data.get("status", {}).get("data", {})
    technical = data.get("technical", {}).get("data", {})

    # Miltal: Biluppgifter returnerar miltal i km, vi konverterar till svenska mil
    mileage_km = technical.get("mileage") or status.get("mileage")
    mileage_mil = round(mileage_km / 10) if mileage_km else None

    return {
        "regno": regno,
        "make": basic.get("make", ""),
        "model": basic.get("model", ""),
        "year": basic.get("vehicle_year") or basic.get("model_year"),
        "color": basic.get("color", ""),
        "fuel_type": technical.get("fuel_type", ""),
        "engine_volume": technical.get("engine_volume"),
        "horsepower": technical.get("power_hp"),
        "mileage_mil": mileage_mil,
        "status": status.get("status"),  # 1 = i trafik, 0 = avställd
        "in_traffic": status.get("status") == 1,
        "first_registered": status.get("first_on_swedish_roads"),
    }


@app.get("/health")
def health():
    return {"status": "ok"}

from pydantic import BaseModel

class ValuationRequest(BaseModel):
    brand: str
    model: str
    year: int
    mileage: int
    condition: str


@app.post("/valuation")
def calculate_valuation(data: ValuationRequest):
    base_price = 300000

    # Årsjustering
    age = 2026 - data.year
    base_price -= age * 8000

    # Miltalsjustering
    base_price -= data.mileage * 5

    # Skick-justering
    if data.condition.lower() == "excellent":
        base_price += 20000
    elif data.condition.lower() == "good":
        base_price += 0
    elif data.condition.lower() == "fair":
        base_price -= 2000

    # Minsta värde
    if base_price < 20000:
        base_price = 20000

    return {
        "brand": data.brand,
        "model": data.model,
        "estimated_value": base_price
    }
