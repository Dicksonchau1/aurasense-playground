from ..services.audit_ingest import ingest_signed_event
import hashlib

async def handle_fleet_inference(request: dict):
    frame_id = request.get("frame_id", "")
    input_digest = hashlib.sha256(frame_id.encode()).hexdigest()
    event = {
        "product": "fleet",
        "kind": "inference",
        "input_digest": input_digest,
        "verdict": request.get("verdict"),
        "device_id": request.get("device_id"),
        "robot_id": request.get("robot_id"),
        "frame_id": frame_id,
        "detector": request.get("detector"),
        "tenant_id": request.get("tenant_id"),
        "session_id": request.get("session_id"),
        "trace_id": request.get("trace_id"),
        "edge_ts": request.get("edge_ts"),
    }
    result = await ingest_signed_event(event)
    return result
