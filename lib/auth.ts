import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d'

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
