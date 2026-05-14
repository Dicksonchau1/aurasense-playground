"""
AuraSense STDP Hybrid Loop
Multi-lane perception → spike encoding → STDP weight update → modulation output
Runs on Jetson as a sidecar to server.py
"""
import time
import math
import asyncio
import numpy as np
from collections import deque
from dataclasses import dataclass, field
from typing import List, Optional, Dict

# ── Constants ────────────────────────────────────────────────────────────────
NUM_STEPS       = 7        # WHO hand hygiene steps
NUM_LANDMARKS   = 21       # MediaPipe hand landmarks
LANE_COUNT      = 4
SPIKE_DIM       = 42       # 21 landmarks × 2 hands
TAU_PLUS        = 0.020    # STDP potentiation time constant (s)
TAU_MINUS       = 0.025    # STDP depression time constant (s)
A_PLUS          = 0.01     # STDP potentiation amplitude
A_MINUS         = 0.0105   # STDP depression amplitude
TRACE_DECAY     = 0.95     # per-tick eligibility trace decay
ROI_PADDING     = 0.08     # fractional padding around hand bounding box


@dataclass
class SpikeEvent:
    lane: int
    timestamp: float
    neuron_idx: int
    value: float


@dataclass
class LaneState:
    lane_id: int
    active: bool = False
    spike_buffer: deque = field(default_factory=lambda: deque(maxlen=200))
    roi: Optional[Dict] = None           # {x1,y1,x2,y2} normalised 0-1
    confidence: float = 0.0
    last_landmarks: Optional[np.ndarray] = None
    eligibility_trace: np.ndarray = field(default_factory=lambda: np.zeros(SPIKE_DIM))


class STDPHybridLoop:
    """
    Central coordinator. Call update() on every MediaPipe frame.
    Returns a modulation dict the JS side can consume via SSE or polling.
    """

    def __init__(self):
        self.lanes: List[LaneState] = [LaneState(lane_id=i) for i in range(LANE_COUNT)]
        self.weights = np.random.normal(0.5, 0.1, (NUM_STEPS, SPIKE_DIM)).clip(0, 1)
        self.pre_trace  = np.zeros(SPIKE_DIM)   # x_i  pre-synaptic
        self.post_trace = np.zeros(NUM_STEPS)    # y_j  post-synaptic
        self.step_activation = np.zeros(NUM_STEPS)
        self.tick = 0
        self._last_t = time.monotonic()

    # ── Public API ────────────────────────────────────────────────────────────

    def update(
        self,
        step_idx: int,
        multi_landmarks: List[List[dict]],   # [{x,y,z}×21] per hand
        multi_handedness: List[dict],        # [{label,score}] per hand
        confidence: float,
    ) -> dict:
        """
        Called once per MediaPipe frame. Returns modulation payload.
        """
        now = time.monotonic()
        dt  = now - self._last_t
        self._last_t = now
        self.tick += 1

        lm_array = self._pack_landmarks(multi_landmarks, multi_handedness)

        # ── Lane 1: skeleton (raw landmark vector) ─────────────────────────
        self._run_lane1_skeleton(step_idx, lm_array, confidence)

        # ── Lane 2: ROI detection ──────────────────────────────────────────
        roi = self._run_lane2_roi(multi_landmarks)

        # ── Lane 3: temporal spike encoding (landmark delta) ──────────────
        spikes = self._run_lane3_spike_encoder(step_idx, lm_array, dt)

        # ── Lane 4: STDP weight update ─────────────────────────────────────
        modulation = self._run_lane4_stdp(step_idx, spikes, dt)

        return {
            "tick":         self.tick,
            "step":         step_idx,
            "confidence":   round(float(confidence), 3),
            "roi":          roi,
            "spikes_fired": int(np.sum(spikes > 0)),
            "modulation":   round(float(modulation), 4),
            "weight_mean":  round(float(self.weights[step_idx].mean()), 4),
        }

    def get_weights_snapshot(self) -> dict:
        return {"weights": self.weights.tolist()}

    # ── Lane implementations ─────────────────────────────────────────────────

    def _run_lane1_skeleton(self, step_idx, lm_array, confidence):
        lane = self.lanes[0]
        lane.active = lm_array is not None
        lane.confidence = confidence
        lane.last_landmarks = lm_array

    def _run_lane2_roi(self, multi_landmarks) -> Optional[dict]:
        """Compute union bounding box of all detected hands + padding."""
        lane = self.lanes[1]
        if not multi_landmarks:
            lane.active = False
            lane.roi = None
            return None

        xs, ys = [], []
        for hand in multi_landmarks:
            for lm in hand:
                xs.append(lm["x"]); ys.append(lm["y"])

        if not xs:
            lane.roi = None
            return None

        x1 = max(0.0, min(xs) - ROI_PADDING)
        y1 = max(0.0, min(ys) - ROI_PADDING)
        x2 = min(1.0, max(xs) + ROI_PADDING)
        y2 = min(1.0, max(ys) + ROI_PADDING)
        roi = {"x1": round(x1,3), "y1": round(y1,3),
               "x2": round(x2,3), "y2": round(y2,3)}
        lane.active = True
        lane.roi = roi
        return roi

    def _run_lane3_spike_encoder(self, step_idx, lm_array, dt) -> np.ndarray:
        """
        Delta-encode landmark movement into spike probabilities.
        Neurons fire when displacement exceeds an adaptive threshold.
        """
        lane = self.lanes[2]
        if lm_array is None:
            lane.active = False
            return np.zeros(SPIKE_DIM)

        prev = lane.last_landmarks if lane.last_landmarks is not None else lm_array
        delta = np.abs(lm_array - prev)
        # Adaptive threshold: mean + 0.5 std
        threshold = delta.mean() + 0.5 * delta.std() + 1e-6
        spikes = (delta > threshold).astype(float)
        # Scale by confidence-weighted magnitude
        spikes *= (delta / (delta.max() + 1e-6))
        lane.last_landmarks = lm_array
        lane.active = True
        return spikes

    def _run_lane4_stdp(self, step_idx, spikes, dt) -> float:
        """
        Nearest-neighbour STDP rule.
        pre_trace  tracks when pre-synaptic neurons last fired.
        post_trace tracks when post-synaptic (step) neurons last fired.
        Returns scalar modulation signal [0,1].
        """
        lane = self.lanes[3]
        lane.active = True

        # Decay traces
        self.pre_trace  *= math.exp(-dt / TAU_PLUS)
        self.post_trace *= math.exp(-dt / TAU_MINUS)

        # Pre-synaptic firing
        fired_pre = spikes > 0.1
        self.pre_trace[fired_pre] += spikes[fired_pre]

        # Post-synaptic: step activation from weight dot spike
        post_in = float(np.dot(self.weights[step_idx], spikes))
        self.step_activation[step_idx] = \
            self.step_activation[step_idx] * TRACE_DECAY + post_in * (1 - TRACE_DECAY)

        fired_post = self.step_activation[step_idx] > 0.3
        if fired_post:
            self.post_trace[step_idx] += 1.0

        # LTP: post fires AFTER pre → strengthen
        if fired_post:
            dw_ltp = A_PLUS * self.pre_trace * (1.0 - self.weights[step_idx])
            self.weights[step_idx] += dw_ltp

        # LTD: pre fires AFTER post → weaken
        if fired_pre.any():
            dw_ltd = A_MINUS * self.post_trace[step_idx] * self.weights[step_idx]
            self.weights[step_idx][fired_pre] -= dw_ltd

        self.weights[step_idx] = self.weights[step_idx].clip(0, 1)

        # Eligibility trace per lane
        lane.eligibility_trace = (
            lane.eligibility_trace * TRACE_DECAY
            + spikes * (1 - TRACE_DECAY)
        )

        modulation = float(self.step_activation[step_idx])
        return min(1.0, max(0.0, modulation))

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _pack_landmarks(self, multi_landmarks, multi_handedness) -> Optional[np.ndarray]:
        """Pack up to 2 hands × 21 landmarks × (x,y) into flat 42-dim vector."""
        if not multi_landmarks:
            return None
        left  = np.zeros(SPIKE_DIM // 2)
        right = np.zeros(SPIKE_DIM // 2)
        for i, hand in enumerate(multi_landmarks[:2]):
            label = multi_handedness[i]["label"] if i < len(multi_handedness) else "Right"
            flat = np.array([[lm["x"], lm["y"]] for lm in hand]).flatten()
            flat = flat[:21]  # guard
            if label == "Left":
                left[:len(flat)]  = flat
            else:
                right[:len(flat)] = flat
        return np.concatenate([left, right])


# ── Module-level singleton ─────────────────────────────────────────────────
_loop_instance: Optional[STDPHybridLoop] = None

def get_loop() -> STDPHybridLoop:
    global _loop_instance
    if _loop_instance is None:
        _loop_instance = STDPHybridLoop()
    return _loop_instance
