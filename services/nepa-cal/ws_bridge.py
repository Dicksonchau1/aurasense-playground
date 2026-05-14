# WebSocket Bridge (FastAPI)
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json

router = APIRouter()

clients = set()

@router.websocket("/ws/mavlink")
async def ws_mavlink(websocket: WebSocket):
    await websocket.accept()
    clients.add(websocket)
    try:
        while True:
            # Simulate sending MAVLink frames
            await asyncio.sleep(1)
            await websocket.send_text(json.dumps({"type": "STATUSTEXT", "text": "Simulated status", "severity": 6}))
            await websocket.send_text(json.dumps({"type": "ATTITUDE", "roll": 0, "pitch": 0, "yaw": 0}))
            await websocket.send_text(json.dumps({"type": "GPS", "lat": 22.3193, "lon": 114.2260, "alt": 10, "fix_type": 3, "sats": 12}))
            await websocket.send_text(json.dumps({"type": "BATTERY", "voltage_battery": 16.2, "current_battery": 2.1, "battery_remaining": 98}))
    except WebSocketDisconnect:
        clients.remove(websocket)

# For FastAPI main app
