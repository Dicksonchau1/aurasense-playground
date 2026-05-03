import { NextResponse } from 'next/server'

export function proxy() {
  return NextResponse.next()
}

export const config = {
  matcher: [],  // run on nothing — fully disabled
}
