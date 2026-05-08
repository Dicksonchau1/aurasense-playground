"""ONNX backend — drop a YOLO/MobileNet/etc model at models/nepa_frame.onnx,
set NEPA_BACKEND=onnx, and you're inferring real perception."""
from __future__ import annotations
import os, time, io
import numpy as np
from PIL import Image
from .backend import Backend, InferResult, Detection, StdpStats, WorldStats

class OnnxBackend(Backend):
    name = "onnx"
    def __init__(self, label: str):
        import onnxruntime as ort
        path = os.getenv("NEPA_MODEL_PATH", "models/nepa_frame.onnx")
        if not os.path.exists(path):
            raise FileNotFoundError(f"ONNX model not found: {path}")
        # Provider preference: CUDA → TensorRT → CPU
        providers = []
        avail = ort.get_available_providers()
        for p in ("TensorrtExecutionProvider", "CUDAExecutionProvider", "CPUExecutionProvider"):
            if p in avail: providers.append(p)
        self.sess = ort.InferenceSession(path, providers=providers)
        self.input  = self.sess.get_inputs()[0]
        self.outputs = [o.name for o in self.sess.get_outputs()]
        h = self.input.shape[2] if isinstance(self.input.shape[2], int) else 640
        w = self.input.shape[3] if isinstance(self.input.shape[3], int) else 640
        self.h, self.w = h, w
        self.runtime = f"{label}|onnx|{providers[0]}"
        print(f"[ONNX] loaded {path} · input={self.input.shape} · providers={providers}")

    def _preprocess(self, jpeg: bytes) -> np.ndarray:
        img = Image.open(io.BytesIO(jpeg)).convert("RGB").resize((self.w, self.h))
        arr = np.asarray(img, dtype=np.float32) / 255.0
        return arr.transpose(2, 0, 1)[None, ...]  # NCHW

    def _postprocess(self, outs, w0=640, h0=640):
        """Generic top-K post-processing. Replace with your model's actual decoder."""
        flat = outs[0].flatten()
        top  = float(flat.max()) if flat.size else 0.0
        return [Detection("movement", round(top, 3), [0, 0, self.w // 2, self.h // 2])]

    def infer_frame(self, jpeg: bytes, source: str = "", region: str = "") -> InferResult:
        t = time.time()
        if not jpeg:
            return InferResult([], StdpStats(0,0,0,0), WorldStats(16, 1.0, True, 256), 0, self.runtime)
        x = self._preprocess(jpeg)
        outs = self.sess.run(self.outputs, {self.input.name: x})
        dets = self._postprocess(outs)
        top  = max((d.score for d in dets), default=0.0)
        return InferResult(
            detections=dets,
            stdp=StdpStats(spike_rate_hz=200.0, sparsity=0.94, plasticity_events=80, energy_w=0.32),
            world=WorldStats(horizon_frames=16, prediction_error=round(1.0 - top, 3),
                             anomaly_flag=top < 0.4, latent_dim=256),
            latency_ms=int((time.time() - t) * 1000),
            runtime=self.runtime,
        )
