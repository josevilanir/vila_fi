import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getAuthUser } from '@/lib/getAuthUser'
import { ok, err } from '@/lib/api-response'
import { getStripe } from '@/lib/stripe'
import { getOrCreateStripeCustomer } from '@/services/subscription.service'
import { prisma } from '@/lib/prisma'

const CheckoutSchema = z.object({
  priceId: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const payload = getAuthUser(req)
  if (!payload) return err('UNAUTHORIZED', 'Não autorizado', 401)

  const body = await req.json().catch(() => null)
  const parsed = CheckoutSchema.safeParse(body)
  if (!parsed.success) {
    return err('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Dados inválidos', 400)
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return err('NOT_FOUND', 'Usuário não encontrado', 404)

    const stripeCustomerId = await getOrCreateStripeCustomer(payload.userId, user.email)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await getStripe().checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: parsed.data.priceId, quantity: 1 }],
      success_url: `${appUrl}/?checkout=success`,
      cancel_url: `${appUrl}/?checkout=canceled`,
      metadata: { userId: payload.userId },
    })

    return ok({ checkoutUrl: session.url })
  } catch (e) {
    console.error('[POST /stripe/create-checkout]', e)
    return err('INTERNAL_ERROR', 'Erro ao criar sessão de checkout', 500)
  }
}
