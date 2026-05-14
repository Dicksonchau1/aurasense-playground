import type { AtlasEvent } from "./contracts";

type AtlasEventHandler = (event: AtlasEvent) => void;
type ErrorHandler = (error: Event | Error) => void;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasType(value: unknown): value is { type: string } {
  return isObject(value) && typeof value.type === "string";
}

export function parseAtlasEvent(raw: string): AtlasEvent | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (!hasType(data)) return null;
    return data as AtlasEvent;
  } catch {
    return null;
  }
}

export function connectAtlasSocket(params: {
  path: string;
  onEvent: AtlasEventHandler;
  onError?: ErrorHandler;
  onOpen?: () => void;
  onClose?: () => void;
}): WebSocket {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const url = `${protocol}//${window.location.host}${params.path}`;
  const socket = new WebSocket(url);

  socket.addEventListener("open", () => {
    params.onOpen?.();
  });

  socket.addEventListener("message", (msg) => {
    const event = parseAtlasEvent(msg.data);
    if (event) params.onEvent(event);
  });

  socket.addEventListener("error", (err) => {
    params.onError?.(err);
  });

  socket.addEventListener("close", () => {
    params.onClose?.();
  });

  return socket;
}

export function connectFlightSocket(args: {
  sessionId: string;
  onEvent: AtlasEventHandler;
  onError?: ErrorHandler;
  onOpen?: () => void;
  onClose?: () => void;
}): WebSocket {
  return connectAtlasSocket({
    path: `/ws/atlas/flight/${args.sessionId}`,
    onEvent: args.onEvent,
    onError: args.onError,
    onOpen: args.onOpen,
    onClose: args.onClose
  });
}

export function connectRehearseSocket(args: {
  sessionId: string;
  onEvent: AtlasEventHandler;
  onError?: ErrorHandler;
  onOpen?: () => void;
  onClose?: () => void;
}): WebSocket {
  return connectAtlasSocket({
    path: `/ws/atlas/rehearse/${args.sessionId}`,
    onEvent: args.onEvent,
    onError: args.onError,
    onOpen: args.onOpen,
    onClose: args.onClose
  });
}
