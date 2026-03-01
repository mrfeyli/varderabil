from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Schema för att skapa värdering (från frontend)
class ValuationCreate(BaseModel):
    reg_nr: str
    brand: str
    model: str
    year: int
    mileage: int
    condition: str

# Schema för värdering-svar (till frontend)
class ValuationResponse(BaseModel):
    id: int
    reg_nr: str
    brand: str
    model: str
    year: int
    mileage: int
    condition: str
    estimated_price: float
    created_at: datetime
    
    class Config:
        from_attributes = True

# Schema för att uppdatera värdering (PATCH — alla fält valfria)
class ValuationUpdate(BaseModel):
    brand:     Optional[str]   = None
    model:     Optional[str]   = None
    year:      Optional[int]   = None
    mileage:   Optional[int]   = None
    condition: Optional[str]   = None

# Schema för bilpris
class CarCreate(BaseModel):
    brand: str
    model: str
    year: int
    mileage: int
    condition: str
    price: float
    source: str

class CarResponse(BaseModel):
    id: int
    brand: str
    model: str
    year: int
    mileage: int
    condition: str
    price: float
    source: str
    created_at: datetime
    
    class Config:
        from_attributes = True