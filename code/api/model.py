from __future__ import annotations
from pathlib import Path
from typing import Any, Dict, Optional
from pydantic import BaseModel


class Settings(BaseModel):
    API_PREFIX: str = "/api"
    DATA_PATH: Path = Path(__file__).resolve().parents[2] / "data" / "flood_rainfall_geojson.geojson"

settings = Settings()

class RiskByNameResponse(BaseModel):
    kelurahan: str
    score: Optional[int] = None
    # category: Optional[str] = None
    properties: Dict[str, Any] = {}
