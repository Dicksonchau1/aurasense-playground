from ..services.audit_ingest import ingest_signed_event
import hashlib

async def handle_atlas_inference(request: dict):
    # Compute input_digest from frame_id (placeholder, replace with frame_bytes if available)
    frame_id = request.get("frame_id", "")
    input_digest = hashlib.sha256(frame_id.encode()).hexdigest()
    event = {
        "product": "atlas",
        "kind": "inference",
        "input_digest": input_digest,
        "verdict": request.get("verdict"),
        "device_id": request.get("device_id"),
        "building_id": request.get("building_id"),
        "frame_id": frame_id,
        "detector": request.get("detector"),
        "tenant_id": request.get("tenant_id"),
        "session_id": request.get("session_id"),
        "trace_id": request.get("trace_id"),
        "edge_ts": request.get("edge_ts"),
    }
    result = await ingest_signed_event(event)
    return result
