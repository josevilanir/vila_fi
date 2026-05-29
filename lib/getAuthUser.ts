import { NextRequest } from 'next/server'
import { verifyToken, JWTPayload } from './auth'

export function getAuthUser(req: NextRequest): JWTPayload | null {
  try {
    const header = req.headers.get('authorization')
    if (!header?.startsWith('Bearer ')) return null
    const token = header.slice(7)
    return verifyToken(token)
  } catch {
    return null
  }
}
