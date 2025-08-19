from __future__ import annotations
import json
import math
from pathlib import Path
from typing import Any, Dict, List, Optional

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
import io


# def score_to_category(score: Optional[float]) -> Optional[str]:
#     if score is None:
#         return None
#     try:
#         s = int(round(float(score)))
#     except Exception:
#         return None

#     if s <= 2:
#         return "Rendah"
#     if s == 3:
#         return "Sedang"
#     if s == 4:
#         return "Tinggi"
#     if s >= 5:
#         return "Sangat Tinggi"
#     return None


def _norm(s: str) -> str:
    return " ".join(s.strip().lower().split())


class GeoIndex:
    def __init__(self, features: List[Dict[str, Any]]):
        self.features = features

        names: List[str] = []
        seen_norm: set[str] = set()
        self.by_kelurahan: Dict[str, Dict[str, Any]] = {}

        for f in features:
            props = f.get("properties", {}) or {}
            name = props.get("kelurahan")
            if not isinstance(name, str):
                continue
            key = _norm(name)
            if key not in seen_norm:
                seen_norm.add(key)
                names.append(name)
                self.by_kelurahan[key] = f

        self.kelurahan_names = sorted(names, key=lambda x: x.lower())

    def search(self, q: Optional[str]) -> List[str]:
        if not q:
            return self.kelurahan_names
        nq = _norm(q)
        return [n for n in self.kelurahan_names if nq in _norm(n)]

    def get_by_kelurahan(self, kelurahan: str) -> Optional[Dict[str, Any]]:
        return self.by_kelurahan.get(_norm(kelurahan))


def load_geojson(path: Path) -> GeoIndex:
    if not path.exists():
        raise FileNotFoundError(f"GeoJSON not found: {path}")
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    feats = data.get("features", [])
    if not isinstance(feats, list):
        raise ValueError("Invalid GeoJSON: 'features' must be a list")

    return GeoIndex(features=feats)

DEFAULTS = {
    "unit_cost_paving_idr_m2": 350_000,   # paving/concrete per m2
    "unit_cost_drain_clean_idr_m": 50_000,# drain cleaning per meter
    "crew_prod_paving_m2_per_day": 35,    # crew productivity (m2/day)
    "crew_prod_drain_m_per_day": 60,      # crew productivity (m/day)
}

def rupiah(n: float) -> str:
    # simple IDR format with thousands sep
    return f"Rp {int(round(n)):,.0f}".replace(",", ".")

def estimate_plan(width_m: float, length_m: float, score: Optional[int], overrides: Dict[str, Any] | None = None):
    cfg = DEFAULTS.copy()
    if overrides:
        for k, v in overrides.items():
            if v is not None and k in cfg:
                cfg[k] = v

    area_m2 = width_m * length_m

    # Cost model (tweak freely)
    cost_paving = area_m2 * cfg["unit_cost_paving_idr_m2"]
    cost_clean  = length_m * cfg["unit_cost_drain_clean_idr_m"]

    # Risk multiplier (example): raise budget for higher risk
    risk_mult = {None:1.0, 1:1.0, 2:1.05, 3:1.10, 4:1.20, 5:1.30}.get(score, 1.0)

    total_cost = (cost_paving + cost_clean) * risk_mult

    # Duration estimate (crew days)
    days_paving = math.ceil(area_m2 / cfg["crew_prod_paving_m2_per_day"]) if area_m2 > 0 else 0
    days_clean  = math.ceil(length_m / cfg["crew_prod_drain_m_per_day"]) if length_m > 0 else 0
    # add 20% overhead
    total_days  = math.ceil((days_paving + days_clean) * 1.2)

    return {
        "width_m": width_m,
        "length_m": length_m,
        "area_m2": area_m2,
        "unit_cost_paving_idr_m2": cfg["unit_cost_paving_idr_m2"],
        "unit_cost_drain_clean_idr_m": cfg["unit_cost_drain_clean_idr_m"],
        "cost_paving": cost_paving,
        "cost_clean": cost_clean,
        "risk_multiplier": risk_mult,
        "total_cost": total_cost,
        "days_paving": days_paving,
        "days_clean": days_clean,
        "total_days": total_days,
    }

# ---------- PDF generator ----------
def build_guidebook_pdf(
    *,
    kelurahan: str,
    project_name: str,
    score: Optional[int],
    props: Dict[str, Any],
    est: Dict[str, Any],
) -> bytes:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    W, H = A4

    def line(y): c.line(20*mm, y, W-20*mm, y)

    y = H - 25*mm
    c.setFont("Helvetica-Bold", 16)
    c.drawString(20*mm, y, f"{project_name} – Guidebook")
    y -= 8*mm
    c.setFont("Helvetica", 11)
    c.drawString(20*mm, y, f"Kelurahan: {kelurahan}")
    y -= 6*mm
    c.drawString(20*mm, y, f"Risk score: {score if score is not None else '-'}")
    y -= 6*mm
    c.drawString(20*mm, y, f"Kecamatan: {props.get('WADMKC') or props.get('District') or '-'} | Kota: {props.get('City') or '-'}")
    y -= 6*mm
    c.drawString(20*mm, y, f"Historical Avg Flood Height: {props.get('Avg_height', '-') } cm")
    y -= 6*mm
    line(y); y -= 10*mm

    # Plan summary
    c.setFont("Helvetica-Bold", 13); c.drawString(20*mm, y, "Plan Summary"); y -= 7*mm
    c.setFont("Helvetica", 11)
    c.drawString(20*mm, y, f"- Width x Length: {est['width_m']} m x {est['length_m']} m (Area: {est['area_m2']:.1f} m²)"); y -= 6*mm
    c.drawString(20*mm, y, f"- Paving Unit Cost: {rupiah(est['unit_cost_paving_idr_m2'])}/m²"); y -= 6*mm
    c.drawString(20*mm, y, f"- Drain Cleaning Unit Cost: {rupiah(est['unit_cost_drain_clean_idr_m'])}/m"); y -= 6*mm
    c.drawString(20*mm, y, f"- Subtotal Paving: {rupiah(est['cost_paving'])}"); y -= 6*mm
    c.drawString(20*mm, y, f"- Subtotal Drain Cleaning: {rupiah(est['cost_clean'])}"); y -= 6*mm
    c.drawString(20*mm, y, f"- Risk Multiplier: x{est['risk_multiplier']:.2f}"); y -= 6*mm
    c.setFont("Helvetica-Bold", 12)
    c.drawString(20*mm, y, f"Estimated Budget: {rupiah(est['total_cost'])}"); y -= 8*mm
    c.setFont("Helvetica-Bold", 12)
    c.drawString(20*mm, y, f"Estimated Duration: {est['total_days']} days"); y -= 10*mm
    line(y); y -= 8*mm

    # What to do guide (checklist)
    c.setFont("Helvetica-Bold", 13); c.drawString(20*mm, y, "What To Do (Checklist)"); y -= 7*mm
    c.setFont("Helvetica", 11)
    steps = [
        "Survey & mark the work area (with residents present).",
        "Clear debris; ensure access for materials & tools.",
        "Drain cleaning along the selected length (manual/mechanical).",
        "Base preparation: compact subgrade, add gravel if needed.",
        "Paving / concrete laying to target width with slope to drains.",
        "Edge finishing; surface curing per vendor spec.",
        "Quality check; update residents on safe use timeline.",
        "Create simple O&M schedule (monthly drain cleaning, sweep).",
    ]
    for s in steps:
        if y < 40*mm:
            c.showPage(); y = H - 25*mm; c.setFont("Helvetica", 11)
        c.drawString(20*mm, y, f"• {s}"); y -= 6*mm

    # Materials list (very rough starter)
    y -= 4*mm; line(y); y -= 8*mm
    c.setFont("Helvetica-Bold", 13); c.drawString(20*mm, y, "Materials & Labor (Starter)"); y -= 7*mm
    c.setFont("Helvetica", 11)
    mats = [
        ("Cement/concrete mix for paving", f"~{est['area_m2']:.0f} m²"),
        ("Aggregates/sand/base layer", f"as per spec"),
        ("Formwork & tools", "rental/owned"),
        ("Crew (paving)", f"{est['days_paving']} crew-days (est.)"),
        ("Crew (drain cleaning)", f"{est['days_clean']} crew-days (est.)"),
    ]
    for a,b in mats:
        if y < 40*mm:
            c.showPage(); y = H - 25*mm; c.setFont("Helvetica", 11)
        c.drawString(20*mm, y, f"- {a}: {b}"); y -= 6*mm

    # Footer
    y -= 6*mm; line(y); y -= 6*mm
    c.setFont("Helvetica-Oblique", 9)
    c.drawString(20*mm, y, "Note: This is a high-level estimate. Final costs depend on site conditions & procurement.")
    c.showPage()
    c.save()
    return buf.getvalue()