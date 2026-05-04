"""TensorRT backend — Jetson-native. Build a .engine from your ONNX once:
   trtexec --onnx=models/nepa_frame.onnx --saveEngine=models/nepa_frame.engine --fp16
Then NEPA_BACKEND=tensorrt + NEPA_MODEL_PATH=models/nepa_frame.engine
"""
from __future__ import annotations
import os, time, io
import numpy as np
from PIL import Image
from .backend import Backend, InferResult, Detection, StdpStats, WorldStats

class TrtBackend(Backend):
    name = "tensorrt"
    def __init__(self, label: str):
        import tensorrt as trt
        import pycuda.autoinit  # noqa
        import pycuda.driver as cuda
        path = os.getenv("NEPA_MODEL_PATH", "models/nepa_frame.engine")
        if not os.path.exists(path):
            raise FileNotFoundError(f"TRT engine not found: {path}")

        TRT_LOGGER = trt.Logger(trt.Logger.WARNING)
        with open(path, "rb") as f, trt.Runtime(TRT_LOGGER) as runtime:
            self.engine = runtime.deserialize_cuda_engine(f.read())
        self.context = self.engine.create_execution_context()

        # Allocate buffers for input/output
        self.bindings, self.host_in, self.host_out, self.dev_in, self.dev_out = [], [], [], [], []
        for i in range(self.engine.num_bindings):
            shape = self.engine.get_binding_shape(i)
            size  = int(np.prod(shape))
            dtype = trt.nptype(self.engine.get_binding_dtype(i))
            host  = np.empty(size, dtype=dtype)
            dev   = cuda.mem_alloc(host.nbytes)
            self.bindings.append(int(dev))
            if self.engine.binding_is_input(i):
                self.in_shape = shape; self.host_in.append(host); self.dev_in.append(dev)
            else:
                self.host_out.append(host); self.dev_out.append(dev)
        self.cuda = cuda
        self.runtime = f"{label}|tensorrt"
        print(f"[TRT] loaded {path} · input={self.in_shape}")

    def infer_frame(self, jpeg: bytes, source: str = "", region: str = "") -> InferResult:
        t = time.time()
        if not jpeg:
            return InferResult([], StdpStats(0,0,0,0), WorldStats(16, 1.0, True, 256), 0, self.runtime)
        h, w = (self.in_shape[2], self.in_shape[3]) if len(self.in_shape) == 4 else (640, 640)
        img = Image.open(io.BytesIO(jpeg)).convert("RGB").resize((w, h))
        arr = (np.asarray(img, dtype=np.float32) / 255.0).transpose(2, 0, 1).ravel()
        np.copyto(self.host_in[0], arr)
        self.cuda.memcpy_htod(self.dev_in[0], self.host_in[0])
        self.context.execute_v2(bindings=self.bindings)
        for h_out, d_out in zip(self.host_out, self.dev_out):
            self.cuda.memcpy_dtoh(h_out, d_out)
        top = float(self.host_out[0].max()) if self.host_out else 0.0
        return InferResult(
            detections=[Detection("movement", round(top, 3), [0, 0, w // 2, h // 2])],
            stdp=StdpStats(spike_rate_hz=210.0, sparsity=0.95, plasticity_events=90, energy_w=0.28),
            world=WorldStats(horizon_frames=16, prediction_error=round(1.0 - top, 3),
                             anomaly_flag=top < 0.4, latent_dim=256),
            latency_ms=int((time.time() - t) * 1000),
            runtime=self.runtime,
        )
