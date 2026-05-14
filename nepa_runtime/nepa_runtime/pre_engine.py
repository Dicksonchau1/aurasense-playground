"""
AuraSense 8-Lane Pre-Engine.
Receives raw frame state from browser (landmarks + downsampled RGB sample
of the ROI as 8x8x3 means) and runs all 8 perception lanes in one pass.
"""
import time, math
import numpy as np
from typing import Optional, List, Dict
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Reuse the existing STDP loop singleton
from nepa_runtime.stdp_hybrid_loop import get_loop as get_stdp_loop

app = FastAPI(title="AuraSense 8-Lane Pre-Engine")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Persistent heatmap (32x24) + previous landmarks for motion energy
_HEAT = np.zeros((24, 32), dtype=np.float32)
_PREV_LM = None

def lane5_lidar(landmarks: List[List[Dict]]) -> Optional[Dict]:
    """Mock LiDAR depth: use mean z of landmarks as proximity signal."""
    if not landmarks: return None
    zs = [lm.get("z", 0) for hand in landmarks for lm in hand]
    if not zs: return None
    mean_z = float(np.mean(zs))
    # Closer to camera = more negative z; map to 0..1 proximity score
    proximity = max(0.0, min(1.0, (0.05 - mean_z) / 0.10))
    return {"mean_z": round(mean_z, 4), "proximity": round(proximity, 3)}

def lane6_heatmap(landmarks: List[List[Dict]]) -> Dict:
    """Accumulate motion energy into a 32x24 grid."""
    global _HEAT, _PREV_LM
    _HEAT *= 0.93   # decay
    if landmarks and _PREV_LM is not None:
        try:
            for hand_idx, hand in enumerate(landmarks):
                if hand_idx >= len(_PREV_LM): break
                prev_hand = _PREV_LM[hand_idx]
                for i, lm in enumerate(hand):
                    if i >= len(prev_hand): break
                    px = int(lm["x"] * 31); py = int(lm["y"] * 23)
                    px = max(0, min(31, px)); py = max(0, min(23, py))
                    dx = lm["x"] - prev_hand[i]["x"]
                    dy = lm["y"] - prev_hand[i]["y"]
                    energy = float(np.hypot(dx, dy))
                    _HEAT[py, px] += energy * 5.0
        except Exception:
            pass
    _PREV_LM = landmarks if landmarks else _PREV_LM
    _HEAT = np.clip(_HEAT, 0, 3.0)
    return {
        "max_energy": round(float(_HEAT.max()), 3),
        "mean_energy": round(float(_HEAT.mean()), 4),
        "grid": _HEAT.tolist(),  # 24 rows × 32 cols
    }

def lane7_soap(rgb_sample: Optional[List[List[List[float]]]]) -> Dict:
    """rgb_sample is an 8x8x3 mean RGB grid of the ROI. Foam = high V, low S, white-ish."""
    if not rgb_sample:
        return {"foam_score": 0.0, "lather_present": False}
    arr = np.array(rgb_sample, dtype=np.float32) / 255.0
    R = arr[..., 0]; G = arr[..., 1]; B = arr[..., 2]
    V = np.maximum(np.maximum(R, G), B)
    minc = np.minimum(np.minimum(R, G), B)
    S = np.where(V > 1e-3, (V - minc) / V, 0.0)
    # White-ish bubbles: high V, low S
    foam_mask = (V > 0.78) & (S < 0.18)
    foam = float(foam_mask.mean())
    return {"foam_score": round(foam, 3),
            "lather_present": bool(foam > 0.18),
            "mean_value": round(float(V.mean()), 3)}

def lane8_wet_dry(rgb_sample, soap_state) -> Dict:
    """
    Wet hand = high specular highlights (very bright spots) + low foam.
    Dry hand = uniform reflectance, low specular, low foam.
    Returns wet_prob and an anomaly flag if state contradicts current step.
    """
    if not rgb_sample:
        return {"wet_prob": 0.0, "anomaly": None}
    arr = np.array(rgb_sample, dtype=np.float32) / 255.0
    V = np.max(arr, axis=-1)
    spec = (V > 0.92).mean()         # fraction of near-white pixels
    uniform = float(1.0 - V.std())   # higher = more uniform = drier
    wet_prob = float(min(1.0, max(0.0, spec * 1.2 + (0.5 - uniform/2))))
    # Anomaly heuristic
    foam = soap_state.get("foam_score", 0.0)
    anomaly = None
    if wet_prob > 0.6 and foam < 0.05:
        anomaly = "wet_no_lather"          # rinsed but not lathered yet
    elif wet_prob < 0.2 and foam > 0.4:
        anomaly = "lather_dry"             # lather present but hands look dry?
    return {
        "wet_prob": round(wet_prob, 3),
        "specular": round(float(spec), 3),
        "anomaly": anomaly,
    }

@app.get("/health")
async def health():
    return {"status":"ok","module":"pre_engine","lanes":8}

@app.post("/engine/frame")
async def engine_frame(req: Request):
    body = await req.json()
    step = int(body.get("step", 0))
    landmarks = body.get("landmarks", [])
    handedness = body.get("handedness", [])
    confidence = float(body.get("confidence", 0.0))
    rgb_sample = body.get("rgb_sample", None)   # optional 8x8x3

    # ── Lanes 1–4: re-use the existing STDP hybrid loop ───────────────
    stdp_resp = get_stdp_loop().update(step, landmarks, handedness, confidence)

    # ── Lane 5: LiDAR (mocked) ────────────────────────────────────────
    l5 = lane5_lidar(landmarks)
    # ── Lane 6: Heatmap ───────────────────────────────────────────────
    l6 = lane6_heatmap(landmarks)
    # ── Lane 7: Soap/lather ───────────────────────────────────────────
    l7 = lane7_soap(rgb_sample)
    # ── Lane 8: Wet/dry anomaly ───────────────────────────────────────
    l8 = lane8_wet_dry(rgb_sample, l7)

    return JSONResponse({
        "step": step,
        "L1_skel":   {"landmarks_count": sum(len(h) for h in landmarks)},
        "L2_roi":    stdp_resp.get("roi"),
        "L3_spikes": {"fired": stdp_resp.get("spikes_fired", 0)},
        "L4_stdp":   {"modulation": stdp_resp.get("modulation", 0),
                      "weight_mean": stdp_resp.get("weight_mean", 0)},
        "L5_lidar":  l5,
        "L6_heat":   {"max": l6["max_energy"], "mean": l6["mean_energy"]},
        "L7_soap":   l7,
        "L8_wetdry": l8,
        "tick":      stdp_resp.get("tick", 0),
    })

@app.get("/engine/heatmap")
async def heatmap():
    """Return the full 24x32 heatmap grid for browser overlay."""
    return JSONResponse({"grid": _HEAT.tolist(), "rows": 24, "cols": 32})
