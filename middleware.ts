import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limiting — works correctly in development and single-instance deploys.
// For Vercel production: configure rate limiting in Vercel Firewall (Dashboard → Security)
// or replace this with Upstash Redis for distributed state.
const attempts = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60_000 // 1 minute
const MAX_ATTEMPTS = 10

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = attempts.get(ip)

  if (!record || record.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  if (record.count >= MAX_ATTEMPTS) return true

  record.count++
  return false
}

export function middleware(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { data: null, error: { code: 'RATE_LIMITED', message: 'Muitas tentativas. Tente novamente em breve.' } },
      { status: 429 },
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/v1/auth/login', '/api/v1/auth/register'],
}
