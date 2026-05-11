from ..services.audit_ingest import ingest_signed_event
import hashlib

async def handle_drone_inference(request: dict):
    frame_id = request.get("frame_id", "")
    input_digest = hashlib.sha256(frame_id.encode()).hexdigest()
    event = {
        "product": "drone",
        "kind": "inference",
        "input_digest": input_digest,
        "verdict": request.get("verdict"),
        "device_id": request.get("device_id"),
        "drone_id": request.get("drone_id"),
        "frame_id": frame_id,
        "detector": request.get("detector"),
        "tenant_id": request.get("tenant_id"),
        "session_id": request.get("session_id"),
        "trace_id": request.get("trace_id"),
        "edge_ts": request.get("edge_ts"),
    }
    # Wind telemetry: pass through in verdict.context or as needed
    result = await ingest_signed_event(event)
    return result
