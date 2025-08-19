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

class GuidebookParams(BaseModel):
    kelurahan: str
    width_m: float
    length_m: float
    project_name: Optional[str] = "Gang Improvement"
    # Optional fine-tuning (defaults are provided if omitted)
    unit_cost_paving_idr_m2: Optional[int] = None
    unit_cost_drain_clean_idr_m: Optional[int] = None
    crew_prod_paving_m2_per_day: Optional[int] = None
    crew_prod_drain_m_per_day: Optional[int] = None
