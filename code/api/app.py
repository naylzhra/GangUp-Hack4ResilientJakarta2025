from __future__ import annotations
import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List

from model import settings, RiskByNameResponse, GuidebookParams, RABParams
from fastapi.responses import FileResponse
from pathlib import Path
from utils import load_geojson, estimate_plan, build_guidebook_pdf, build_rab_pdf


from model import DesignRequest, DesignResponse, DesignRule
from utils import load_matrix, choose_rule

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
        return RiskByNameResponse(kelurahan=kelurahan, score=0, properties={})
    props = feat.get("properties", {}) or {}
    score = props.get("Score")
    # category = score_to_category(score)
    return RiskByNameResponse(
        kelurahan=kelurahan,
        score=int(round(float(score))) if score is not None else None,
        # category=category,
        properties=props,
    )

@app.get(f"{settings.API_PREFIX}/design-matrix", response_model=List[DesignRule])
def list_matrix():
    return load_matrix()

@app.post(f"{settings.API_PREFIX}/design-solution", response_model=DesignResponse)
def design_solution(payload: DesignRequest):
    rule, how, dbg = choose_rule(payload)
    return DesignResponse(designModule=rule.designModule, matchedRule=rule, matchedBy=how, debug=dbg)

@app.get(f"{settings.API_PREFIX}/design-solution", response_model=DesignResponse)
def design_solution_get(
    lebar: float = Query(...),
    surface: str = Query(..., regex="^(beton|aspal|tanah)$"),
    drainage: bool = Query(...),
    highFloodRisk: bool = Query(...),
    activity: str = Query(..., description="CSV, e.g. anak,orang"),
):
    payload = DesignRequest(
        lebar=lebar,
        surface=surface,
        drainage=drainage,
        highFloodRisk=highFloodRisk,
        activity=[s.strip() for s in activity.split(",")],
    )
    rule, how, dbg = choose_rule(payload)
    return DesignResponse(designModule=rule.designModule, matchedRule=rule, matchedBy=how, debug=dbg)

@app.post(f"{settings.API_PREFIX}/reload")
def reload_index():
    global _IDX
    print(settings.DATA_PATH)
    _IDX = load_geojson(settings.DATA_PATH)
    return {"status": "reloaded", "features": len(_IDX.features)}

@app.post(f"{settings.API_PREFIX}/guidebook")
def guidebook(payload: GuidebookParams):
    feat = _IDX.get_by_kelurahan(payload.kelurahan)
    if not feat:
        raise HTTPException(status_code=404, detail="Kelurahan not found")
    props = feat.get("properties", {}) or {}
    score_raw = props.get("Score")
    score = int(round(float(score_raw))) if score_raw is not None else None

    overrides = {
        "unit_cost_paving_idr_m2": payload.unit_cost_paving_idr_m2,
        "unit_cost_drain_clean_idr_m": payload.unit_cost_drain_clean_idr_m,
        "crew_prod_paving_m2_per_day": payload.crew_prod_paving_m2_per_day,
        "crew_prod_drain_m_per_day": payload.crew_prod_drain_m_per_day,
    }
    est = estimate_plan(payload.width_m, payload.length_m, score, overrides)

    pdf_bytes = build_guidebook_pdf(
        kelurahan=payload.kelurahan,
        project_name=payload.project_name or "Gang Improvement",
        score=score,
        props=props,
        est=est,
    )

    out = Path("Guidebook_temp.pdf")
    out.write_bytes(pdf_bytes)
    return FileResponse(
        path=str(out),
        media_type="application/pdf",
        filename=f"Guidebook_{payload.kelurahan.replace(' ','_')}.pdf",
    )

@app.post(f"{settings.API_PREFIX}/rab")
def rab_pdf(payload: RABParams):   # RABParams has: moduleNum, lebar, panjang
    pdf_bytes = build_rab_pdf(
        moduleNum=payload.moduleNum,
        lebar=payload.lebar,
        panjang=payload.panjang,
    )
    out = Path("RAB_temp.pdf")
    out.write_bytes(pdf_bytes)
    return FileResponse(
        path=str(out),
        media_type="application/pdf",
        filename="RAB.pdf",
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host=os.getenv("HOST", "0.0.0.0"), port=int(os.getenv("PORT", "8000")), reload=True)