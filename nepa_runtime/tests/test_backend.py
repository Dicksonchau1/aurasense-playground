import pytest
from nepa_runtime.backend import NullBackend

def test_null_backend_returns_valid_shape():
    b = NullBackend("test")
    r = b.infer_frame(b"", "test-src", "C")
    assert len(r.detections) == 2
    assert all(0 <= d.score <= 1 for d in r.detections)
    assert 0 < r.stdp.sparsity < 1
    assert r.world.horizon_frames == 16
    assert r.runtime == "test"

def test_null_backend_anomaly_distribution():
    b = NullBackend("test")
    flags = [b.infer_frame(b"").world.anomaly_flag for _ in range(200)]
    rate = sum(flags) / len(flags)
    assert 0.05 < rate < 0.35, f"anomaly rate out of expected band: {rate}"
