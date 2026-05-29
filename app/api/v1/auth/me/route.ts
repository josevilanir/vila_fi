import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/getAuthUser'
import { getUserById } from '@/services/auth.service'
import { getUserSubscription } from '@/services/subscription.service'
import { ok, err } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  const payload = getAuthUser(req)
  if (!payload) return err('UNAUTHORIZED', 'Não autorizado', 401)

  const [user, subscription] = await Promise.all([
    getUserById(payload.userId),
    getUserSubscription(payload.userId),
  ])
  if (!user) return err('UNAUTHORIZED', 'Usuário não encontrado', 401)

  const safeSubscription = subscription
    ? {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        stripeCurrentPeriodEnd: subscription.stripeCurrentPeriodEnd,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
      }
    : null

  return ok({ ...user, subscription: safeSubscription })
}
