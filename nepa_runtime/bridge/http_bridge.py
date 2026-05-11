async def ready(req):
    t0 = time.time()
    method = "GET"
    endpoint = "/ready"
    request_id = req.get("request_id")
    try:
        with REQUEST_LATENCY.labels(method, endpoint).time():
            stub_instance = await stub()
            h = await stub_instance.Health(nepa_pb2.HealthRequest())
        if not h.ok:
            raise Exception("gRPC health not ok")
        status = 200
        logger.info("ready", route="ready", status=status, node=NODE_ID, request_id=request_id)
        REQUEST_COUNT.labels(method, endpoint, status).inc()
        return web.json_response({"ok": True, "node": NODE_ID})
    except Exception as e:
        status = 503
        logger.error("ready", route="ready", status=status, error=str(e), node=NODE_ID, request_id=request_id)
        REQUEST_COUNT.labels(method, endpoint, status).inc()
        return web.json_response({"ok": False, "error": str(e), "node": NODE_ID}, status=503)
"""HTTP bridge: VPS → this bridge → local gRPC runtime."""
from __future__ import annotations
import os, sys, json, time, asyncio, pathlib
from typing import Optional
from .logger import logger
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
    t0 = time.time()
    method = "GET"
    endpoint = "/health"
    request_id = req.get("request_id")
    try:
        if (d := _check_auth(req)):
            status = 401
            REQUEST_COUNT.labels(method, endpoint, status).inc()
            logger.info("health", route="health", status=status, duration_ms=int((time.time()-t0)*1000), request_id=request_id)
            return d
        with REQUEST_LATENCY.labels(method, endpoint).time():
            h = await (await stub()).Health(nepa_pb2.HealthRequest())
        status = 200
        logger.info("health", route="health", status=status, duration_ms=int((time.time()-t0)*1000), request_id=request_id)
        REQUEST_COUNT.labels(method, endpoint, status).inc()
        return web.json_response({
            "ok": h.ok, "runtime": h.runtime, "version": h.version,
            "uptime_s": h.uptime_s, "queue_depth": h.queue_depth, "node": NODE_ID,
        })
    except Exception as e:
        status = 500
        REQUEST_COUNT.labels(method, endpoint, status).inc()
        logger.error("health", route="health", status=status, error=str(e), duration_ms=int((time.time()-t0)*1000), request_id=request_id)
        return web.json_response({"ok": False, "error": str(e), "node": NODE_ID}, status=500)

async def infer_frame(req):
    t0 = time.time()
    if (d := _check_auth(req)):
        logger.info("infer_frame", route="infer_frame", status=401, duration_ms=int((time.time()-t0)*1000))
        return d
    reader = await req.multipart()
    image_bytes = b""; source = ""; region = ""; user_id = ""
    async for part in reader:
        if   part.name == "image":   image_bytes = await part.read(decode=False)
        elif part.name == "source":  source  = (await part.text()).strip()
        elif part.name == "region":  region  = (await part.text()).strip()
        elif part.name == "user_id": user_id = (await part.text()).strip()
    r = await (await stub()).InferFrame(nepa_pb2.FrameRequest(
        image_jpeg=bytes(image_bytes), source=source, region=region, user_id=user_id))
    logger.info("infer_frame", route="infer_frame", status=200, duration_ms=int((time.time()-t0)*1000), user_id=user_id, region=region, source=source)
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
    from .sentry_middleware import sentry_error_middleware
    from .metrics import metrics
    from .request_id_middleware import request_id_middleware
    app = web.Application(client_max_size=50 * 1024 * 1024, middlewares=[request_id_middleware, sentry_error_middleware])
    app.router.add_get ("/health",           health)
    app.router.add_get ("/ready",            ready)
    app.router.add_get ("/metrics",          metrics)
    app.router.add_post("/infer/frame",      infer_frame)
    app.router.add_post("/infer/video",      infer_video)
    app.router.add_get ("/stream/anomalies", stream_anomalies)
    return app

if __name__ == "__main__":
    port = int(os.getenv("NEPA_BRIDGE_PORT", "8080"))
    print(f"[bridge] node={NODE_ID} listening :{port} → gRPC {GRPC_ADDR}")
    web.run_app(make_app(), host="0.0.0.0", port=port, access_log=None)
