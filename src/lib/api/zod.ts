import { NextResponse } from 'next/server'
import { ZodError, type ZodSchema } from 'zod'

/**
 * Parse + validate a Request JSON body against a Zod schema.
 * Returns either the parsed data or a NextResponse 400 with machine-readable errors.
 *
 * Usage:
 *   const parsed = await readJson(req, MySchema)
 *   if (parsed instanceof NextResponse) return parsed
 *   // parsed is now typed
 */
export async function readJson<T>(
  req: Request,
  schema: ZodSchema<T>,
): Promise<T | NextResponse> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'invalid_json', message: 'Request body must be valid JSON.' },
      { status: 400 },
    )
  }
  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'validation_failed',
        message: 'Request body failed validation.',
        issues: zodIssues(result.error),
      },
      { status: 400 },
    )
  }
  return result.data
}

export function zodIssues(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    code: issue.code,
    message: issue.message,
  }))
}

export function badRequest(message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: 'bad_request', message, ...extra }, { status: 400 })
}

export function unauthorized(message = 'Sign in required.') {
  return NextResponse.json({ error: 'unauthorized', message }, { status: 401 })
}

export function forbidden(message = 'Not allowed.') {
  return NextResponse.json({ error: 'forbidden', message }, { status: 403 })
}

export function notFound(message = 'Not found.') {
  return NextResponse.json({ error: 'not_found', message }, { status: 404 })
}

export function serverError(message = 'Something went wrong.') {
  return NextResponse.json({ error: 'server_error', message }, { status: 500 })
}
