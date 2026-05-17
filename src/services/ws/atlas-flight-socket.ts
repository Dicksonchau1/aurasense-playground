// Robust WebSocket client for /ws/atlas/flight/{sessionId}
import { AtlasEvent, AtlasEventSchema } from '../../contracts/atlas-event';

export class AtlasFlightSocket {
  private ws: WebSocket | null = null;
  private reconnectTimeout: number = 1000;
  private sessionId: string;
  private onEvent: (event: AtlasEvent) => void;
  private heartbeatInterval: any;

  constructor(sessionId: string, onEvent: (event: AtlasEvent) => void) {
    this.sessionId = sessionId;
    this.onEvent = onEvent;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(`/ws/atlas/flight/${this.sessionId}`);
    this.ws.onopen = () => {
      this.startHeartbeat();
    };
    this.ws.onmessage = (msg) => {
      try {
        const parsed = JSON.parse(msg.data);
        const event = AtlasEventSchema.parse(parsed);
        this.onEvent(event);
      } catch (e) {
        // Handle validation error
      }
    };
    this.ws.onclose = () => {
      this.stopHeartbeat();
      setTimeout(() => this.connect(), this.reconnectTimeout);
    };
    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.ws?.send(JSON.stringify({ type: 'heartbeat' }));
    }, 10000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
  }

  close() {
    this.stopHeartbeat();
    this.ws?.close();
  }
}
