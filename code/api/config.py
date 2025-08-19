# code/api/config.py
from __future__ import annotations
import os
from pathlib import Path
from pydantic import BaseModel

class Settings(BaseModel):
    API_PREFIX: str = "/api"
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    ROOT_DIR: Path = Path(__file__).resolve().parents[2]
    DATA_DIR: Path = ROOT_DIR / "data"
    GEOJSON_PATH: Path = DATA_DIR / "flood_rainfall_geojson.geojson"
    DATA_EPSG: str = "EPSG:23845"  # <<— set to your GeoJSON’s CRS (guess: 23845 for Jakarta datasets)

settings = Settings(
    API_PREFIX=os.getenv("API_PREFIX", "/api"),
    CORS_ORIGINS=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    DATA_EPSG=os.getenv("DATA_EPSG", "EPSG:23845"),
)
