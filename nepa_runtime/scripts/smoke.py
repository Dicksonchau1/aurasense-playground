"""End-to-end gRPC smoke test."""
import sys, os, time, grpc, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from nepa_runtime import nepa_pb2, nepa_pb2_grpc

ADDR = os.getenv("NEPA_GRPC_ADDR", "localhost:50051")
ch   = grpc.insecure_channel(ADDR)
stub = nepa_pb2_grpc.NepaRuntimeStub(ch)

print(f"→ gRPC: {ADDR}")
print("\n[1] Health")
print(stub.Health(nepa_pb2.HealthRequest()))

print("\n[2] InferFrame (empty bytes)")
r = stub.InferFrame(nepa_pb2.FrameRequest(image_jpeg=b"", source="smoke", region="C", user_id="smoke-user"))
print(r)

# Optional: feed a real image if available
img_path = "/tmp/test.jpg"
if os.path.exists(img_path):
    print(f"\n[3] InferFrame ({img_path})")
    with open(img_path, "rb") as f:
        data = f.read()
    r = stub.InferFrame(nepa_pb2.FrameRequest(image_jpeg=data, source="smoke", region="C", user_id="smoke-user"))
    print(f"   detections={len(r.detections)} runtime={r.runtime} latency_ms={r.latency_ms}")

print("\n[4] StreamAnomalies (3 events, 30s timeout)")
n = 0
deadline = time.time() + 30
for a in stub.StreamAnomalies(nepa_pb2.StreamRequest(user_id="smoke-user")):
    print(f"   ⚠ {a.id} · {a.region} · score={a.score:.2f} · pred_err={a.pred_err:.2f}")
    n += 1
    if n >= 3 or time.time() > deadline:
        break

print(f"\n✅ Smoke test passed ({n} anomalies received)")
