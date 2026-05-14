from __future__ import annotations
import os, time, signal, sys
from concurrent import futures
import grpc
from . import nepa_pb2, nepa_pb2_grpc
from .backend import load_backend
from .anomaly_queue import push_if_anomaly, stream as anomaly_stream

START_TIME = time.time()

def _to_pb(r) -> nepa_pb2.InferenceResult:
    return nepa_pb2.InferenceResult(
        detections=[nepa_pb2.Detection(**{"class": d.cls, "score": d.score, "bbox": d.bbox}) for d in r.detections],
        stdp=nepa_pb2.StdpStats(
            spike_rate_hz=r.stdp.spike_rate_hz,
            sparsity=r.stdp.sparsity,
            plasticity_events=r.stdp.plasticity_events,
            energy_w=r.stdp.energy_w,
        ),
        world=nepa_pb2.WorldModelStats(
            horizon_frames=r.world.horizon_frames,
            prediction_error=r.world.prediction_error,
            anomaly_flag=r.world.anomaly_flag,
            latent_dim=r.world.latent_dim,
        ),
        latency_ms=r.latency_ms,
        runtime=r.runtime,
    )

class NepaService(nepa_pb2_grpc.NepaRuntimeServicer):
    def __init__(self):
        self.backend = load_backend()
        print(f"[NEPA] backend ready: {self.backend.runtime}", flush=True)

    def InferFrame(self, req: nepa_pb2.FrameRequest, ctx) -> nepa_pb2.InferenceResult:
        try:
            r = self.backend.infer_frame(req.image_jpeg, req.source, req.region)
        except Exception as e:
            ctx.set_code(grpc.StatusCode.INTERNAL)
            ctx.set_details(f"infer_frame failed: {e}")
            raise
        if req.user_id:
            push_if_anomaly(req.user_id, req.source, req.region, r)
        return _to_pb(r)

    def InferVideo(self, req: nepa_pb2.VideoRequest, ctx) -> nepa_pb2.InferenceResult:
        try:
            import cv2, numpy as np, tempfile
            with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
                f.write(req.video_mp4); path = f.name
            cap = cv2.VideoCapture(path); ok, frame = cap.read(); cap.release()
            if ok and frame is not None:
                _, jpg = cv2.imencode(".jpg", frame)
                r = self.backend.infer_frame(jpg.tobytes(), req.filename, "FULL")
            else:
                r = self.backend.infer_frame(b"", req.filename, "FULL")
        except Exception as e:
            print(f"[InferVideo] decode failed → null infer: {e}", flush=True)
            r = self.backend.infer_frame(b"", req.filename, "FULL")
        if req.user_id:
            push_if_anomaly(req.user_id, req.filename, "FULL", r)
        return _to_pb(r)

    def StreamAnomalies(self, req: nepa_pb2.StreamRequest, ctx):
        user_id = req.user_id or "anon"
        for evt in anomaly_stream(user_id):
            if not ctx.is_active():
                return
            yield nepa_pb2.Anomaly(
                id=evt["id"], kind=evt["kind"], score=evt["score"],
                region=evt["region"], source=evt["source"],
                ts_ms=evt["ts_ms"], pred_err=evt["pred_err"],
            )

    def Health(self, req, ctx) -> nepa_pb2.HealthResponse:
        return nepa_pb2.HealthResponse(
            ok=True,
            runtime=self.backend.runtime,
            version=os.getenv("NEPA_VERSION", "0.4.1"),
            uptime_s=time.time() - START_TIME,
            queue_depth=0,
        )

def serve():
    port    = int(os.getenv("NEPA_GRPC_PORT", "50051"))
    workers = int(os.getenv("NEPA_GRPC_WORKERS", "4"))
    server = grpc.server(
        futures.ThreadPoolExecutor(max_workers=workers),
        options=[
            ("grpc.max_receive_message_length", 50 * 1024 * 1024),
            ("grpc.max_send_message_length",    50 * 1024 * 1024),
            ("grpc.keepalive_time_ms", 30_000),
            ("grpc.keepalive_timeout_ms", 10_000),
        ],
    )
    nepa_pb2_grpc.add_NepaRuntimeServicer_to_server(NepaService(), server)
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f"[NEPA] gRPC listening on :{port} · workers={workers} · pid={os.getpid()}", flush=True)

    def shutdown(signum, _frame):
        print(f"\n[NEPA] signal {signum} → graceful shutdown", flush=True)
        server.stop(grace=2)
        sys.exit(0)
    signal.signal(signal.SIGINT,  shutdown)
    signal.signal(signal.SIGTERM, shutdown)
    server.wait_for_termination()

if __name__ == "__main__":
    serve()

# ── STDP Hybrid Loop HTTP endpoints (appended by build script) ──────────────
from nepa_runtime.stdp_hybrid_loop import get_loop as _get_stdp_loop
from fastapi import Request as _Request
from fastapi.responses import JSONResponse as _JSONResponse

@app.post("/nepa/update")
async def nepa_update(req: _Request):
    body = await req.json()
    loop = _get_stdp_loop()
    result = loop.update(
        step_idx       = int(body.get("step", 0)),
        multi_landmarks = body.get("landmarks", []),
        multi_handedness= body.get("handedness", []),
        confidence     = float(body.get("confidence", 0.0)),
    )
    return _JSONResponse(result)

@app.get("/nepa/weights")
async def nepa_weights():
    return _JSONResponse(_get_stdp_loop().get_weights_snapshot())
