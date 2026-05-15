import asyncio, base64, json, time
from collections import deque
import numpy as np, cv2, mediapipe as mp
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

try:
    from registry import register_on_startup, current as registry_current
except Exception as _e:
    print("[server] registry import failed:", _e)
    def register_on_startup(): pass
    def registry_current(): return {}

mp_hands = mp.solutions.hands
STEPS = ["palm_to_palm","back_of_hands","fingers_interlaced","back_of_fingers",
         "thumbs","fingertips","wrists"]
BILATERAL = {1,4,5,6}

class Tracker:
    def __init__(self):
        self.hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2,
                                    model_complexity=1,
                                    min_detection_confidence=0.6,
                                    min_tracking_confidence=0.5)
        self.window = deque(maxlen=10)
        self.dwell_by_step = [0.0]*7
        self.last_t = time.time()

    def step(self, frame_bgr):
        rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        res = self.hands.process(rgb)
        lms_l = lms_r = None
        if res.multi_hand_landmarks and res.multi_handedness:
            for lm, hd in zip(res.multi_hand_landmarks, res.multi_handedness):
                if hd.classification[0].label == "Left":
                    lms_l = lm
                else:
                    lms_r = lm
        now = time.time(); dt = now - self.last_t; self.last_t = now
        if lms_l is None and lms_r is None:
            return {"step": None, "conf": 0.0, "laterality": None,
                    "dwellOk": False, "anomalies":["hands_not_detected"]}
        L = np.array([[p.x,p.y,p.z] for p in (lms_l or lms_r).landmark])
        R = np.array([[p.x,p.y,p.z] for p in (lms_r or lms_l).landmark])
        overlap = float(np.exp(-np.linalg.norm(L.mean(0)-R.mean(0))*8))
        scores = [overlap, overlap*0.85, overlap*0.8, overlap*0.7,
                  float(np.linalg.norm(L[4]-R[4]) < 0.12),
                  float(np.linalg.norm(L[8]-R[0]) < 0.15),
                  float(np.linalg.norm(L[0]-R[0]) < 0.18)]
        idx = int(np.argmax(scores))
        conf = float(max(0, min(1, scores[idx])))
        lat = {"left": conf > 0.55, "right": conf > 0.55} if idx in BILATERAL else None
        self.window.append((idx, conf))
        recent = [i for i,c in self.window if c > 0.5]
        stable_idx = max(set(recent), key=recent.count) if recent else idx
        if stable_idx == idx and conf > 0.5:
            self.dwell_by_step[idx] += dt
        return {"step": stable_idx, "step_name": STEPS[stable_idx],
                "conf": conf, "laterality": lat,
                "dwell": self.dwell_by_step[stable_idx],
                "dwellOk": self.dwell_by_step[stable_idx] >= 2.0,
                "anomalies": []}

app = FastAPI(title="NEPA Hand-Hygiene", version="0.5.2")
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
def _nepa_startup():
    try:
        register_on_startup()
    except Exception as e:
        print("[startup] registry error:", e)

@app.get("/health")
def health():
    try:
        st = registry_current() or {}
    except Exception:
        st = {}
    return {"ok": True,
            "service": "nepa-hh",
            "version": "0.5.2",
            "checkpoint_sha": st.get("sha"),
            "release_id":     st.get("release_id"),
            "loaded_at":      st.get("loaded_at"),
            "metrics":        (st.get("meta") or {}).get("eval_metrics")}

@app.websocket("/ws/hh")
async def ws_hh(ws: WebSocket):
    await ws.accept()
    tr = Tracker()
    try:
        while True:
            msg = await ws.receive_text()
            try:
                payload = json.loads(msg)
                b64 = payload.get("frame", "").split(",")[-1]
                buf = base64.b64decode(b64)
                arr = np.frombuffer(buf, dtype=np.uint8)
                img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
                if img is None:
                    await ws.send_text(json.dumps({"error": "decode_failed"}))
                    continue
                out = tr.step(img)
                out["ts"] = time.time()
                _st = registry_current() or {}
                out["model_sha"]  = _st.get("sha")
                out["release_id"] = _st.get("release_id")
                await ws.send_text(json.dumps(out))
            except Exception as e:
                await ws.send_text(json.dumps({"error": str(e)}))
    except WebSocketDisconnect:
        return

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8765, log_level="info")
