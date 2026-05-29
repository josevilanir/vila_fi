import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/getAuthUser'
import { ok, err } from '@/lib/api-response'
import { getStripe } from '@/lib/stripe'
import { getUserSubscription } from '@/services/subscription.service'

export async function POST(req: NextRequest) {
  const payload = getAuthUser(req)
  if (!payload) return err('UNAUTHORIZED', 'Não autorizado', 401)

  try {
    const subscription = await getUserSubscription(payload.userId)
    if (!subscription) {
      return err('NOT_FOUND', 'Assinatura não encontrada', 404)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const session = await getStripe().billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: appUrl,
    })

    return ok({ portalUrl: session.url })
  } catch (e) {
    console.error('[POST /stripe/portal]', e)
    return err('INTERNAL_ERROR', 'Erro ao abrir portal de assinatura', 500)
  }
}
