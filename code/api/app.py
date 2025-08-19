from __future__ import annotations
import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from model import settings, RiskByNameResponse
from utils import load_geojson

app = FastAPI(title="Flood Risk (name-based)", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    print(settings.DATA_PATH)
    _IDX = load_geojson(settings.DATA_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load GeoJSON: {e}") from e


@app.get(f"{settings.API_PREFIX}/health")
def health():
    return {"status": "ok", "features": len(_IDX.features)}

# GET /api/risk?kelurahan=Duren%20Sawit
@app.get(f"{settings.API_PREFIX}/risk", response_model=RiskByNameResponse)
def risk_by_name(kelurahan: str = Query(..., description="exact kelurahan display name")):
    feat = _IDX.get_by_kelurahan(kelurahan)
    if not feat:
        raise HTTPException(status_code=404, detail="Kelurahan not found")
    props = feat.get("properties", {}) or {}
    score = props.get("Score")
    # category = score_to_category(score)
    return RiskByNameResponse(
        kelurahan=kelurahan,
        score=int(round(float(score))) if score is not None else None,
        # category=category,
        properties=props,
    )

@app.post(f"{settings.API_PREFIX}/reload")
def reload_index():
    global _IDX
    print(settings.DATA_PATH)
    _IDX = load_geojson(settings.DATA_PATH)
    return {"status": "reloaded", "features": len(_IDX.features)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host=os.getenv("HOST", "0.0.0.0"), port=int(os.getenv("PORT", "8000")), reload=True)