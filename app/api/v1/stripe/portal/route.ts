import { withAuth } from '@/lib/route-handler'
import { ok, err } from '@/lib/api-response'
import { getStripe } from '@/lib/stripe'
import { getUserSubscription } from '@/services/subscription.service'
import { env } from '@/lib/env'

export const POST = withAuth(async (req, user) => {
  const subscription = await getUserSubscription(user.userId)
  if (!subscription) {
    return err('NOT_FOUND', 'Assinatura não encontrada', 404)
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: env.NEXT_PUBLIC_APP_URL,
  })

  return ok({ portalUrl: session.url })
})
