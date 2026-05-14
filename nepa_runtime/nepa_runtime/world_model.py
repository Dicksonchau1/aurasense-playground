"""
AuraSense World Model — stateful trainee belief tracker.
Runs on port 8766. Receives observations from the browser HRI layer
and from the STDP loop, then exposes a belief state to the agent crew.
"""
import time, math
from typing import Optional, Dict, List
from collections import deque
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="AuraSense World Model")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ── Belief state ──────────────────────────────────────────────────────────
_state = {
    "session_id": None,
    "started_at": None,
    "current_step": 0,
    "step_history": [],          # [{step, dwell, conf, mod, env, ts}]
    "skill_belief": [0.5]*7,     # P(skill mastered) per step (0..1)
    "fatigue": 0.0,              # 0..1 rises over time
    "engagement": 1.0,           # 0..1 falls if no observations
    "anomalies": deque(maxlen=64),
    "last_obs_t": time.monotonic(),
}

def _decay():
    dt = time.monotonic() - _state["last_obs_t"]
    # engagement decays exponentially with no input
    _state["engagement"] = max(0.0, _state["engagement"] * math.exp(-dt / 60.0))
    # fatigue rises slowly with session length
    if _state["started_at"]:
        elapsed = time.monotonic() - _state["started_at"]
        _state["fatigue"] = min(1.0, elapsed / (60.0 * 8))   # full fatigue ~8 min

@app.get("/health")
async def health():
    return {"status":"ok","module":"world_model"}

@app.post("/wm/session/start")
async def start_session(req: Request):
    body = await req.json()
    _state["session_id"]   = body.get("session_id", f"sess-{int(time.time())}")
    _state["started_at"]   = time.monotonic()
    _state["current_step"] = 0
    _state["step_history"] = []
    _state["skill_belief"] = [0.5]*7
    _state["fatigue"]      = 0.0
    _state["engagement"]   = 1.0
    _state["anomalies"].clear()
    _state["last_obs_t"]   = time.monotonic()
    return {"ok":True, "session_id": _state["session_id"]}

@app.post("/wm/observe")
async def observe(req: Request):
    body = await req.json()
    step = int(body.get("step", 0))
    conf = float(body.get("confidence", 0.0))
    mod  = float(body.get("modulation", 0.0))
    env  = float(body.get("envelope", 0.0))
    dwell= float(body.get("dwell", 0.0))

    _state["current_step"] = step
    _state["last_obs_t"]   = time.monotonic()
    _state["engagement"]   = min(1.0, _state["engagement"] + 0.05)

    # Bayesian-ish update on skill belief: weight by mod*conf
    learn = max(0.0, min(1.0, 0.5*mod + 0.5*conf))
    prior = _state["skill_belief"][step]
    posterior = prior * (1 - 0.1) + learn * 0.1   # exponential moving avg
    _state["skill_belief"][step] = round(posterior, 4)

    _state["step_history"].append({
        "step": step, "dwell": dwell, "conf": conf,
        "mod": mod, "env": env, "ts": time.time(),
    })
    if len(_state["step_history"]) > 500:
        _state["step_history"] = _state["step_history"][-500:]

    if conf < 0.3:
        _state["anomalies"].append({"t": time.time(), "type":"low_conf", "step":step})

    _decay()
    return {"ok":True, "skill_belief": _state["skill_belief"]}

@app.get("/wm/state")
async def get_state():
    _decay()
    out = dict(_state)
    out["anomalies"] = list(out["anomalies"])
    out["last_obs_t"] = round(time.monotonic() - out["last_obs_t"], 2)
    return JSONResponse(out)
