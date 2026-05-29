import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'
import { isPremium } from '@/lib/planFeatures'

export class SubscriptionError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const sub = await prisma.subscription.findUnique({ where: { userId } })
  if (sub) return sub.stripeCustomerId

  const customer = await getStripe().customers.create({ email, metadata: { userId } })

  await prisma.subscription.create({
    data: {
      userId,
      stripeCustomerId: customer.id,
      plan: 'free',
      status: 'inactive',
    },
  })

  return customer.id
}

export async function getUserSubscription(userId: string) {
  return prisma.subscription.findUnique({ where: { userId } })
}

export async function getUserPlan(userId: string): Promise<'free' | 'premium'> {
  const sub = await prisma.subscription.findUnique({ where: { userId } })
  return isPremium(sub) ? 'premium' : 'free'
}

export async function activateSubscription(
  stripeCustomerId: string,
  subscriptionId: string,
  priceId: string,
  periodEnd: Date,
): Promise<void> {
  await prisma.subscription.update({
    where: { stripeCustomerId },
    data: {
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: periodEnd,
      status: 'active',
      plan: 'premium',
    },
  })
}

export async function renewSubscription(
  stripeSubscriptionId: string,
  periodEnd: Date,
): Promise<void> {
  await prisma.subscription.update({
    where: { stripeSubscriptionId },
    data: { stripeCurrentPeriodEnd: periodEnd, status: 'active' },
  })
}

export async function cancelSubscription(stripeSubscriptionId: string): Promise<void> {
  await prisma.subscription.update({
    where: { stripeSubscriptionId },
    data: { status: 'canceled', plan: 'free', stripeCurrentPeriodEnd: null },
  })
}

export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  status: string,
): Promise<void> {
  const plan = status === 'active' ? 'premium' : 'free'
  await prisma.subscription.update({
    where: { stripeSubscriptionId },
    data: { status, plan },
  })
}
