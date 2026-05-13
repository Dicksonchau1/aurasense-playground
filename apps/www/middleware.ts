
import { NextRequest, NextResponse } from 'next/server';

// Simple UUID v4 generator (browser-safe, no Node.js API)
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function middleware(req: NextRequest) {
  // Generate or propagate a request ID
  const requestId = req.headers.get('x-request-id') || uuidv4();
  // Attach to response for client visibility
  const res = NextResponse.next();
  res.headers.set('x-request-id', requestId);
  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};
