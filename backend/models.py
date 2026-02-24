from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
from datetime import datetime

# Model för bilpriser från marknaden
class Car(Base):
    __tablename__ = "cars"
    
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, index=True)        # Märke (Volvo, VW, etc.)
    model = Column(String, index=True)        # Modell (V70, Golf, etc.)
    year = Column(Integer)                    # Årsmodell
    mileage = Column(Integer)                 # Miltal
    condition = Column(String)                # Skick (excellent, good, etc.)
    price = Column(Float)                     # Pris i kr
    source = Column(String)                   # Källa (Blocket, Wayke, etc.)
    created_at = Column(DateTime, default=datetime.utcnow)

# Model för värderingar
class Valuation(Base):
    __tablename__ = "valuations"
    
    id = Column(Integer, primary_key=True, index=True)
    reg_nr = Column(String)                   # Registreringsnummer
    brand = Column(String)                    # Märke
    model = Column(String)                    # Modell
    year = Column(Integer)                    # Årsmodell
    mileage = Column(Integer)                 # Miltal
    condition = Column(String)                # Skick
    estimated_price = Column(Float)           # Uppskattat pris
    created_at = Column(DateTime, default=datetime.utcnow)