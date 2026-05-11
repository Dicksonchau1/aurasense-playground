import pino from "pino";
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { service: "aurasense-www" },
  redact: {
    paths: ["req.headers.authorization", "*.audit_signature", "*.access_token"],
    censor: "[REDACTED]",
  },
});

// Helper to extract requestId from NextRequest or headers
export function getRequestId(reqOrHeaders: { headers: any }) {
  return reqOrHeaders.headers.get?.("x-request-id") || reqOrHeaders.headers["x-request-id"] || undefined;
}
