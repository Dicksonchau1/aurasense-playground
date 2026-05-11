import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import type { NextFetchEvent } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Generate or propagate a request ID
  const requestId = req.headers.get('x-request-id') || randomUUID();
  // Clone request with new header
  const requestWithId = req.clone();
  requestWithId.headers.set('x-request-id', requestId);
  // Optionally: attach to response for client visibility
  const res = NextResponse.next();
  res.headers.set('x-request-id', requestId);
  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};
