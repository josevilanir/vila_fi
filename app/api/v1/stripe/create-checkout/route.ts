import { NextRequest } from 'next/server'
import { z } from 'zod'
import { withAuth } from '@/lib/route-handler'
import { ok, err } from '@/lib/api-response'
import { getStripe } from '@/lib/stripe'
import { getOrCreateStripeCustomer } from '@/services/subscription.service'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env'

const CheckoutSchema = z.object({
  priceId: z.string().min(1),
})

export const POST = withAuth(async (req: NextRequest, user) => {
  const body = await req.json().catch(() => null)
  const parsed = CheckoutSchema.safeParse(body)
  if (!parsed.success) {
    return err('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Dados inválidos', 400)
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.userId } })
  if (!dbUser) return err('NOT_FOUND', 'Usuário não encontrado', 404)

  const stripeCustomerId = await getOrCreateStripeCustomer(user.userId, dbUser.email)

  const session = await getStripe().checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: parsed.data.priceId, quantity: 1 }],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/?checkout=success`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/?checkout=canceled`,
    metadata: { userId: user.userId },
  })

  return ok({ checkoutUrl: session.url })
})
