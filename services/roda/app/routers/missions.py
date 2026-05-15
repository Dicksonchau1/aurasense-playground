from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone

router = APIRouter(prefix="/missions", tags=["missions"])

# Minimal in-memory registry for demo
MISSION_ID = "22222222-2222-2222-2222-222222222222"

REPORT = {
    "mission_id": MISSION_ID,
    "state": "complete",
    "started_at": "2026-05-14T15:00:00.000Z",
    "completed_at": "2026-05-14T15:09:00.000Z",
    "duration_s": 540,
    "operator": "demo@aurasensehk.com",
    "params": {"altitude_agl": 60, "speed_mps": 5, "side_overlap_pct": 70, "front_overlap_pct": 70, "standoff_m": 8},
    "building": {
        "mbis_id": "MBIS-HK-000484",
        "name_en": "ICC Tower", "name_zh": "環球貿易廣場",
        "district": "Tsim Sha Tsui West",
        "centroid": {"lat": 22.3042, "lng": 114.1602},
        "footprint": {"type": "Polygon", "coordinates": [[[114.1598,22.3038],[114.1606,22.3038],[114.1606,22.3046],[114.1598,22.3046],[114.1598,22.3038]]]},
        "height_m": 484, "floors": 108,
        "lod_mesh_url": "https://cdn.test/icc.glb",
        "faces": [
            {"face_id": f, "azimuth_deg": i * 90, "area_m2": 12000,
             "panel_grid": {"cols": 30, "rows": 100, "panel_w_m": 1, "panel_h_m": 1},
             "atlas_url": f"https://cdn.test/icc/{f}/{{z}}/{{x}}/{{y}}.webp",
             "uv_bounds": [0,0,1,1],
             "defects_url": f"https://cdn.test/icc/{f}/defects.geojson",
            } for i, f in enumerate(["N","E","S","W","ROOF"])
        ]
    },
    "coverage": {"total": 96.4, "faces": {"N": 98, "E": 95, "S": 97, "W": 94, "ROOF": 99}},
    "defects": [
        {"id": "DF-484-001", "face_id": "N", "u": 0.42, "v": 0.71, "type": "Spalling",   "severity": "s3", "conf": 0.92, "ts": 1747353660000},
        {"id": "DF-484-002", "face_id": "E", "u": 0.18, "v": 0.32, "type": "Cracking",   "severity": "s2", "conf": 0.86, "ts": 1747353720000},
        {"id": "DF-484-003", "face_id": "ROOF", "u": 0.61, "v": 0.55, "type": "Efflorescence", "severity": "s1", "conf": 0.78, "ts": 1747353900000},
    ],
    "ai": {"model": "AuraSense", "version": "v2.4", "mAP": 0.91,
            "classes": {"spall": 0.48, "crack": 0.31, "effl": 0.18, "seep": 0.12, "delam": 0.21},
            "mean_infer_ms": 9.4 },
    "images": {"count": 1890, "size_mb": 3970, "sample_urls": []},
    "telemetry_uri": "https://cdn.test/telemetry.ndjson",
    "report_url": f"https://app.aurasensehk.com/missions/{MISSION_ID}/report",
}

@router.get("/{mission_id}/report")
async def get_report(mission_id: str):
    if mission_id != MISSION_ID:
        raise HTTPException(404, "mission not found")
    return REPORT
