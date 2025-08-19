from __future__ import annotations
import json
from pathlib import Path
from typing import Any, Dict, List, Optional

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
