import asyncio
import json
import websockets
from typing import Dict, Set
import random

# In-memory session management
sessions: Dict[str, Set[websockets.WebSocketServerProtocol]] = {}

async def handler(websocket, path):
    # Parse sessionId from path, e.g. /ws/atlas/detections/{sessionId}
    try:
        session_id = path.rstrip('/').split('/')[-1]
        if session_id not in sessions:
            sessions[session_id] = set()
        sessions[session_id].add(websocket)
        print(f"Client connected to session {session_id}")

        async for message in websocket:
            # Handle incoming messages (e.g., CameraCommand)
            print(f"Received: {message}")
            # Echo or process as needed
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Cleanup
        if session_id in sessions:
            sessions[session_id].discard(websocket)
            if not sessions[session_id]:
                del sessions[session_id]
        print(f"Client disconnected from session {session_id}")


# Broadcast helpers for different event types
async def broadcast_detection_frame(session_id: str, detection_frame: dict):
    await _broadcast(session_id, {"type": "DetectionFrame", **detection_frame})

async def broadcast_alert(session_id: str, alert: dict):
    await _broadcast(session_id, {"type": "AlertEvent", **alert})

async def broadcast_camera_ack(session_id: str, ack: dict):
    await _broadcast(session_id, {"type": "CameraCommandAck", **ack})

async def broadcast_video_health(session_id: str, health: dict):
    await _broadcast(session_id, {"type": "VideoStreamHealth", **health})

async def _broadcast(session_id: str, msg_obj: dict):
    if session_id in sessions:
        msg = json.dumps(msg_obj)
        await asyncio.gather(*[ws.send(msg) for ws in sessions[session_id]])


async def main():
    async with websockets.serve(handler, "0.0.0.0", 8765):
        print("WebSocket server started on ws://0.0.0.0:8765")

        # Start background tasks for real data integration
        await asyncio.gather(
            listen_for_detection_frames(),
            listen_for_alerts(),
            listen_for_camera_acks(),
            listen_for_video_health(),
        )

# === Real Data Hooks ===
# Replace the following functions with your actual data source integration.

async def listen_for_detection_frames():
    """Listen for real detection frames and broadcast them."""
    while True:
        # TODO: Replace this with your real detection frame source (e.g., database, message queue, API call)
        await asyncio.sleep(1)
        # Example: frame = await get_next_detection_frame()
        # await broadcast_detection_frame(session_id, frame)
        pass

async def listen_for_alerts():
    """Listen for real alerts and broadcast them."""
    while True:
        # TODO: Replace this with your real alert source
        await asyncio.sleep(1)
        # Example: alert = await get_next_alert()
        # await broadcast_alert(session_id, alert)
        pass

async def listen_for_camera_acks():
    """Listen for real camera command acks and broadcast them."""
    while True:
        # TODO: Replace this with your real camera ack source
        await asyncio.sleep(1)
        # Example: ack = await get_next_camera_ack()
        # await broadcast_camera_ack(session_id, ack)
        pass

async def listen_for_video_health():
    """Listen for real video stream health metrics and broadcast them."""
    while True:
        # TODO: Replace this with your real video health source
        await asyncio.sleep(1)
        # Example: health = await get_next_video_health()
        # await broadcast_video_health(session_id, health)
        pass

if __name__ == "__main__":
    asyncio.run(main())
