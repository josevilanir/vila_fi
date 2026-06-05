import { NextRequest } from 'next/server'
import { verifyToken, JWTPayload } from './auth'

export const SESSION_COOKIE = 'vilafi_session'

export function getAuthUser(req: NextRequest): JWTPayload | null {
  try {
    // Cookie-based session (preferred — httpOnly, not accessible to JS)
    const cookie = req.cookies.get(SESSION_COOKIE)?.value
    if (cookie) return verifyToken(cookie)

    // Authorization header fallback for non-browser API clients
    const header = req.headers.get('authorization')
    if (!header?.startsWith('Bearer ')) return null
    return verifyToken(header.slice(7))
  } catch {
    return null
  }
}
