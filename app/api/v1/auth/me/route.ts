import { withAuth } from '@/lib/route-handler'
import { getUserById } from '@/services/auth.service'
import { getUserSubscription, toSafeSubscription } from '@/services/subscription.service'
import { ok, err } from '@/lib/api-response'

export const GET = withAuth(async (req, user) => {
  const [safeUser, subscription] = await Promise.all([
    getUserById(user.userId),
    getUserSubscription(user.userId),
  ])
  if (!safeUser) return err('UNAUTHORIZED', 'Usuário não encontrado', 401)

  return ok({ ...safeUser, subscription: subscription ? toSafeSubscription(subscription) : null })
})
