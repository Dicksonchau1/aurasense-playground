"""Per-user bounded queues. The gRPC StreamAnomalies handler tails these.
The InferFrame handler enqueues whenever world.anomaly_flag is True.
"""
from __future__ import annotations
import queue, threading, time, uuid, random
from typing import Dict
from .backend import InferResult

_queues: Dict[str, queue.Queue] = {}
_lock = threading.Lock()
MAX_QUEUE = 64

def _q(user_id: str) -> queue.Queue:
    with _lock:
        if user_id not in _queues:
            _queues[user_id] = queue.Queue(maxsize=MAX_QUEUE)
        return _queues[user_id]

def push_if_anomaly(user_id: str, source: str, region: str, r: InferResult):
    if not r.world.anomaly_flag:
        return
    evt = {
        "id": "anom_" + uuid.uuid4().hex[:8],
        "kind": "prediction_error_spike",
        "score": max((d.score for d in r.detections), default=0.0),
        "region": region or "FULL",
        "source": source or "unknown",
        "ts_ms": int(time.time() * 1000),
        "pred_err": r.world.prediction_error,
    }
    try:
        _q(user_id).put_nowait(evt)
    except queue.Full:
        # Drop oldest
        try: _q(user_id).get_nowait()
        except queue.Empty: pass
        _q(user_id).put_nowait(evt)

def stream(user_id: str, idle_synthetic_every: float = 6.0):
    """Generator: yields anomaly events for one user. Emits a synthetic
    event every `idle_synthetic_every` seconds if real queue is empty —
    keeps the SSE channel demonstrably alive on a fresh dev box."""
    q = _q(user_id)
    last_synth = time.time()
    while True:
        try:
            evt = q.get(timeout=1.0)
            yield evt
            last_synth = time.time()
        except queue.Empty:
            if time.time() - last_synth > idle_synthetic_every:
                last_synth = time.time()
                yield {
                    "id": "anom_synth_" + uuid.uuid4().hex[:8],
                    "kind": "prediction_error_spike",
                    "score": round(random.uniform(0.6, 0.9), 3),
                    "region": random.choice(["NW","NE","SW","SE","C"]),
                    "source": "idle-synth",
                    "ts_ms": int(time.time() * 1000),
                    "pred_err": round(random.uniform(0.18, 0.42), 3),
                }
