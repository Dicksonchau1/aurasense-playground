# RC Calibration Service (FastAPI)
from fastapi import APIRouter, FastAPI
from typing import Dict
import time

router = APIRouter()

state = {
    "status": "idle",
    "elapsed_sec": 0,
    "channels": {f"CH{i+1}": {"min": 1000, "max": 2000, "trim": 1500, "reversed": False} for i in range(8)}
}

@router.post("/cal/rc/start")
def start():
    state["status"] = "capturing"
    state["elapsed_sec"] = 0
    return {"ok": True, "duration_sec": 30}

@router.get("/cal/rc/status")
def status():
    if state["status"] == "capturing":
        state["elapsed_sec"] += 1
        for ch in state["channels"].values():
            ch["min"] = max(900, ch["min"] - 1)
            ch["max"] = min(2100, ch["max"] + 1)
            ch["trim"] = (ch["min"] + ch["max"]) // 2
        if state["elapsed_sec"] >= 30:
            state["status"] = "complete"
    return {
        "status": state["status"],
        "elapsed_sec": state["elapsed_sec"],
        "channels": state["channels"]
    }

app = FastAPI()
app.include_router(router)
