"""Pluggable inference backend.

Default: NullBackend (random but realistic — useful for wiring tests).
Drop NEPA_BACKEND=onnx + a model file → OnnxBackend takes over.
"""
from __future__ import annotations
import abc, time, random, os
from dataclasses import dataclass, field
from typing import List

@dataclass
class Detection:
    cls: str
    score: float
    bbox: List[int] = field(default_factory=list)  # [x, y, w, h]

@dataclass
class StdpStats:
    spike_rate_hz: float
    sparsity: float
    plasticity_events: int
    energy_w: float

@dataclass
class WorldStats:
    horizon_frames: int
    prediction_error: float
    anomaly_flag: bool
    latent_dim: int

@dataclass
class InferResult:
    detections: List[Detection]
    stdp: StdpStats
    world: WorldStats
    latency_ms: int
    runtime: str

class Backend(abc.ABC):
    name: str = "abstract"
    @abc.abstractmethod
    def infer_frame(self, jpeg: bytes, source: str = "", region: str = "") -> InferResult: ...

class NullBackend(Backend):
    """No model — synthetic but realistic. Replaces the JS mock adapter."""
    name = "null"
    def __init__(self, label: str = "jetson-null"):
        self.runtime = label
    def infer_frame(self, jpeg: bytes, source: str = "", region: str = "") -> InferResult:
        t = time.time()
        # Latency mirrors a real ~10ms on Jetson Nano
        time.sleep(random.uniform(0.005, 0.012))
        dets = [
            Detection("movement", round(random.uniform(0.7, 0.96), 3), [12, 18, 80, 90]),
            Detection("object",   round(random.uniform(0.55, 0.88), 3), [110, 40, 60, 70]),
        ]
        return InferResult(
            detections=dets,
            stdp=StdpStats(
                spike_rate_hz=round(random.uniform(180, 240), 2),
                sparsity=round(random.uniform(0.92, 0.97), 3),
                plasticity_events=random.randint(40, 120),
                energy_w=round(random.uniform(0.25, 0.45), 3),
            ),
            world=WorldStats(
                horizon_frames=16,
                prediction_error=round(random.uniform(0.04, 0.18), 3),
                anomaly_flag=random.random() > 0.82,
                latent_dim=256,
            ),
            latency_ms=int((time.time() - t) * 1000),
            runtime=self.runtime,
        )

def load_backend() -> Backend:
    kind  = os.getenv("NEPA_BACKEND", "null").lower()
    label = os.getenv("NEPA_RUNTIME_LABEL", f"jetson-{os.uname().nodename}-{kind}")
    if kind == "onnx":
        try:
            from .onnx_backend import OnnxBackend
            return OnnxBackend(label)
        except Exception as e:
            print(f"[backend] ONNX init failed → null fallback: {e}")
    elif kind == "tensorrt":
        try:
            from .trt_backend import TrtBackend
            return TrtBackend(label)
        except Exception as e:
            print(f"[backend] TensorRT init failed → null fallback: {e}")
    return NullBackend(label)
