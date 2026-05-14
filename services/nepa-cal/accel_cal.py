# Accel Calibration Service (FastAPI)
from fastapi import APIRouter, FastAPI, Request
from pydantic import BaseModel
from typing import Literal

router = APIRouter()

# --- Models ---
class AccelPos(BaseModel):
    pos: Literal["LEVEL","LEFT","RIGHT","NOSEDOWN","NOSEUP","BACK"]

# --- State (simulated) ---
state = {
    "status": "idle",
    "step": 0,
    "current_pos": None,
    "last_text": "",
    "log": [],
    "sequence": 0
}

# --- Endpoints ---
@router.post("/cal/accel/start")
def start():
    state["status"] = "active"
    state["step"] = 0
    state["current_pos"] = "LEVEL"
    state["sequence"] += 1
    state["log"].append("MAV_CMD_PREFLIGHT_CALIBRATION param5=1")
    return {"ok": True, "step": 0, "next_position": "LEVEL", "sequence": state["sequence"]}

@router.post("/cal/accel/position")
def position(pos: AccelPos):
    state["current_pos"] = pos.pos
    state["step"] += 1
    state["log"].append(f"MAV_CMD_ACCELCAL_VEHICLE_POS param1={pos.pos}")
    state["log"].append("COMMAND_ACK result=5 (IN_PROGRESS)")
    if state["step"] >= 6:
        state["status"] = "success"
        state["log"].append("COMMAND_ACK result=0 (ACCEPTED)")
    return {"ok": True, "confirmed_pos": pos.pos, "ack_result": 5, "next_position": None if state["step"]>=6 else "NEXT", "step": state["step"]}

@router.post("/cal/accel/level")
def level():
    state["log"].append("MAV_CMD_PREFLIGHT_CALIBRATION param5=2")
    return {"ok": True}

@router.post("/cal/accel/simple")
def simple():
    state["log"].append("MAV_CMD_PREFLIGHT_CALIBRATION param5=4")
    return {"ok": True}

@router.get("/cal/accel/status")
def status():
    return {
        "status": state["status"],
        "current_step": state["step"],
        "current_pos": state["current_pos"],
        "last_text": state["last_text"],
        "log": state["log"][-20:],
        "sequence": state["sequence"]
    }

# --- FastAPI sub-app ---
app = FastAPI()
app.include_router(router)
