"""HTTP bridge: VPS → this bridge → local gRPC runtime."""
from __future__ import annotations
import os, sys, json, time, asyncio, pathlib
from typing import Optional
import grpc
from aiohttp import web

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from nepa_runtime import nepa_pb2, nepa_pb2_grpc

GRPC_ADDR = os.getenv("NEPA_GRPC_ADDR", "localhost:50051")
TOKEN     = os.getenv("NEPA_RUNTIME_TOKEN", "")
NODE_ID   = os.getenv("NEPA_NODE_ID", os.uname().nodename)

_channel: Optional[grpc.aio.Channel] = None
_stub: Optional[nepa_pb2_grpc.NepaRuntimeStub] = None

async def stub():
    global _channel, _stub
    if _stub is None:
        _channel = grpc.aio.insecure_channel(GRPC_ADDR)
        _stub = nepa_pb2_grpc.NepaRuntimeStub(_channel)
    return _stub

def _check_auth(req):
    if not TOKEN: return None
    if req.headers.get("authorization", "") != f"Bearer {TOKEN}":
        return web.json_response({"ok": False, "error": "unauthorized"}, status=401)

def _result_dict(r):
    """Convert gRPC InferenceResult → dict for JSON response. Defensive against field naming."""
    detections = []
    for d in r.detections:
        # Protobuf reserves 'class' as a Python keyword — access via property name varies
        try:
            cls = getattr(d, "class")
        except Exception:
            try:
                cls = d.cls
            except Exception:
                cls = "unknown"
        score = float(getattr(d, "score", 0.0))
        bbox = list(getattr(d, "bbox", []))
        detections.append({"class": cls, "score": score, "bbox": bbox})

    stdp = getattr(r, "stdp", None)
    world = getattr(r, "world", None)

    return {
        "detections":  detections,
        "stdp": {
            "spike_rate_hz":     getattr(stdp, "spike_rate_hz", 0.0)     if stdp else 0.0,
            "sparsity":          getattr(stdp, "sparsity", 0.0)          if stdp else 0.0,
            "plasticity_events": getattr(stdp, "plasticity_events", 0)   if stdp else 0,
            "energy_w":          getattr(stdp, "energy_w", 0.0)          if stdp else 0.0,
        },
        "world_model": {
            "horizon_frames":    getattr(world, "horizon_frames", 16)    if world else 16,
            "prediction_error":  getattr(world, "prediction_error", 0.0) if world else 0.0,
            "anomaly_flag":      bool(getattr(world, "anomaly_flag", False)) if world else False,
            "latent_dim":        getattr(world, "latent_dim", 256)       if world else 256,
        },
        "latency_ms": int(getattr(r, "latency_ms", 0)),
        "runtime":    f"{getattr(r, 'runtime', 'unknown')}@{NODE_ID}",
    }


async def health(req):
    if (d := _check_auth(req)): return d
    h = await (await stub()).Health(nepa_pb2.HealthRequest())
    return web.json_response({
        "ok": h.ok, "runtime": h.runtime, "version": h.version,
        "uptime_s": h.uptime_s, "queue_depth": h.queue_depth, "node": NODE_ID,
    })

async def infer_frame(req):
    if (d := _check_auth(req)): return d
    reader = await req.multipart()
    image_bytes = b""; source = ""; region = ""; user_id = ""
    async for part in reader:
        if   part.name == "image":   image_bytes = await part.read(decode=False)
        elif part.name == "source":  source  = (await part.text()).strip()
        elif part.name == "region":  region  = (await part.text()).strip()
        elif part.name == "user_id": user_id = (await part.text()).strip()
    r = await (await stub()).InferFrame(nepa_pb2.FrameRequest(
        image_jpeg=bytes(image_bytes), source=source, region=region, user_id=user_id))
    return web.json_response(_result_dict(r))

async def infer_video(req):
    if (d := _check_auth(req)): return d
    reader = await req.multipart()
    video_bytes = b""; filename = ""; user_id = ""
    async for part in reader:
        if   part.name == "video":    video_bytes = await part.read(decode=False)
        elif part.name == "filename": filename    = (await part.text()).strip()
        elif part.name == "user_id":  user_id     = (await part.text()).strip()
    r = await (await stub()).InferVideo(nepa_pb2.VideoRequest(
        video_mp4=bytes(video_bytes), filename=filename, user_id=user_id))
    return web.json_response(_result_dict(r))

async def stream_anomalies(req):
    if (d := _check_auth(req)): return d
    user_id = req.query.get("user_id", "anon")
    response = web.StreamResponse(status=200, headers={
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-transform",
        "connection": "keep-alive",
        "x-accel-buffering": "no",
    })
    await response.prepare(req)
    await response.write(f"event: hello\ndata: {json.dumps({'ts': int(time.time()*1000), 'user_id': user_id, 'node': NODE_ID})}\n\n".encode())
    try:
        async for a in (await stub()).StreamAnomalies(nepa_pb2.StreamRequest(user_id=user_id)):
            payload = {"id": a.id, "kind": a.kind, "score": a.score, "region": a.region,
                       "source": a.source, "ts_ms": a.ts_ms, "pred_err": a.pred_err, "node": NODE_ID}
            await response.write(f"event: anomaly\ndata: {json.dumps(payload)}\n\n".encode())
    except (asyncio.CancelledError, ConnectionResetError):
        pass
    return response

def make_app():
    app = web.Application(client_max_size=50 * 1024 * 1024)
    app.router.add_get ("/health",           health)
    app.router.add_post("/infer/frame",      infer_frame)
    app.router.add_post("/infer/video",      infer_video)
    app.router.add_get ("/stream/anomalies", stream_anomalies)
    return app

if __name__ == "__main__":
    port = int(os.getenv("NEPA_BRIDGE_PORT", "8080"))
    print(f"[bridge] node={NODE_ID} listening :{port} → gRPC {GRPC_ADDR}")
    web.run_app(make_app(), host="0.0.0.0", port=port, access_log=None)
