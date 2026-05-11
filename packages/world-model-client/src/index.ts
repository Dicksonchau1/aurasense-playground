// Typed VODA entropy SSE client for HRI popup sparkline
export interface EntropyEvent {
  ts: string;
  value: number;
  reason?: string;
}

export type EntropyCallback = (event: EntropyEvent) => void;

export class WorldModelSSEClient {
  private eventSource: EventSource | null = null;

  connect(url: string, onEvent: EntropyCallback) {
    this.disconnect();
    this.eventSource = new EventSource(url);
    this.eventSource.onmessage = (e) => {
      try {
        const data: EntropyEvent = JSON.parse(e.data);
        onEvent(data);
      } catch {}
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
