# Compass Calibration Service (FastAPI)
from fastapi import APIRouter, FastAPI, Request
from pydantic import BaseModel
from typing import Literal, Optional

router = APIRouter()

class CompassStart(BaseModel):
    fitness: Literal["relaxed","default","strict"]
    large_vehicle: bool
    heading_deg: Optional[float] = None

# --- State (simulated) ---
state = {
    "status": "idle",
    "progress": {
        "COMPASS_1": {"pct": 0, "fitness": 0.0},
        "COMPASS_2": {"pct": 0, "fitness": 0.0},
        "COMPASS_3": {"pct": 0, "fitness": 0.0}
    },
    "last_text": "",
    "log": []
}

@router.post("/cal/compass/start")
def start(data: CompassStart):
    state["status"] = "running"
    state["progress"] = {k: {"pct": 0, "fitness": 0.0} for k in state["progress"]}
    state["log"].append("MAV_CMD_PREFLIGHT_CALIBRATION param2=1")
    return {"ok": True, "compasses": [1,2,3]}

@router.get("/cal/compass/status")
def status():
    # Simulate progress
    import random
    if state["status"] == "running":
        for k in state["progress"]:
            state["progress"][k]["pct"] = min(100, state["progress"][k]["pct"] + random.randint(10, 30))
            state["progress"][k]["fitness"] = random.uniform(0.8, 1.0)
        if all(v["pct"] >= 100 for v in state["progress"].values()):
            state["status"] = "success"
            state["log"].append("MAG_CAL_REPORT (COMPLETE)")
    return {
        "status": state["status"],
        "progress": state["progress"],
        "last_text": state["last_text"],
        "log": state["log"][-20:]
    }

app = FastAPI()
app.include_router(router)
