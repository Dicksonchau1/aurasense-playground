export interface HriRequest {
  id: string;
  sessionId: string;
  operatorId: string;
  prompt: string;
  ts: string;
}

export interface HriResponse {
  requestId: string;
  operatorId: string;
  answer: string;
  ts: string;
}
