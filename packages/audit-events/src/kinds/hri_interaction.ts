import type { HriRequest, HriResponse } from "@aurasense/hri-core";

export interface HriInteractionEvent {
  kind: "hri_interaction";
  request: HriRequest;
  response?: HriResponse;
  resolved: boolean;
  chain_hash?: string;
  ts: string;
}import type { HriRequest, HriResponse } from "@aurasense/hri-core";
export interface HriInteractionEvent {
  kind: "hri_interaction";
  request: HriRequest;
  response?: HriResponse;
  resolved: boolean;
  chain_hash?: string;
  ts: string;
}
