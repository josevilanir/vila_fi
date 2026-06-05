import jwt from 'jsonwebtoken'
import { env } from './env'

const SECRET = env.JWT_SECRET
const EXPIRES_IN = env.JWT_EXPIRES_IN

export interface JWTPayload {
  userId: string
  email: string
}

export function signToken(payload: JWTPayload): string {
  // jsonwebtoken v9 types expect StringValue for expiresIn — cast through unknown
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN as unknown as number })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, SECRET) as JWTPayload
}
