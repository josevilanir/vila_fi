import { NextRequest } from 'next/server'
import { getAuthUser } from './getAuthUser'
import { err } from './api-response'
import { AppError } from './errors'
import { JWTPayload } from './auth'

type RouteContext<T extends Record<string, string> = Record<string, string>> = {
  params: Promise<T>
}

export function withAuth<T extends Record<string, string> = Record<string, string>>(
  handler: (req: NextRequest, user: JWTPayload, ctx?: RouteContext<T>) => Promise<Response>,
) {
  return async (req: NextRequest, ctx?: RouteContext<T>): Promise<Response> => {
    const user = getAuthUser(req)
    if (!user) return err('UNAUTHORIZED', 'Não autorizado', 401)

    try {
      return await handler(req, user, ctx)
    } catch (e) {
      if (e instanceof AppError) return err(e.code, e.message, e.status)
      console.error(`[${req.method} ${new URL(req.url).pathname}]`, e)
      return err('INTERNAL_ERROR', 'Erro interno', 500)
    }
  }
}
