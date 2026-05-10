import type { Hand } from "./landmark-math";

export type Sample = {
  t: number;       // timestamp ms
  left: Hand | null;
  right: Hand | null;
};

export class GestureHistory {
  private buf: Sample[] = [];
  private maxAgeMs: number;

  constructor(maxAgeMs = 1500) {
    this.maxAgeMs = maxAgeMs;
  }

  push(sample: Sample) {
    this.buf.push(sample);
    const cutoff = sample.t - this.maxAgeMs;
    while (this.buf.length > 0 && this.buf[0].t < cutoff) this.buf.shift();
  }

  recent(ms: number): Sample[] {
    if (this.buf.length === 0) return [];
    const cutoff = this.buf[this.buf.length - 1].t - ms;
    return this.buf.filter((s) => s.t >= cutoff);
  }

  clear() {
    this.buf = [];
  }

  size() {
    return this.buf.length;
  }
}
