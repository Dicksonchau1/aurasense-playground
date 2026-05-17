// ATLAS Dashboard — Global Store (Phase 1 Foundation Refactor)
// Simple pub/sub state management for dashboard

window.Atlas = {
  state: {
    user: null,
    session: null,
    telemetry: {},
    detections: [],
    streamHealth: {},
    overlays: { L1:true, L2:true, L3:true, L4:true, L5:true, L6:true, L7:true, L8:true, L9:true },
    recording: false,
    cinematic: false,
    annotations: [],
    targetLock: null,
    alerts: [],
    cameraMode: { lens:'EO', gimbalPitch:-45, zoom:4.0, ev:0 }
  },
  subscribers: new Map(),
  subscribe(key, fn) {
    if (!this.subscribers.has(key)) this.subscribers.set(key, []);
    this.subscribers.get(key).push(fn);
  },
  set(key, val) {
    this.state[key] = { ...this.state[key], ...val };
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach(fn => fn(this.state[key]));
    }
  },
  emit(event, payload) {
    // For event stream logging or custom events
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(fn => fn(payload));
    }
  }
};
