import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'
import { isPremium } from '@/lib/planFeatures'
import { AppError } from '@/lib/errors'
import { SafeSubscription } from '@/lib/types'
import type { Subscription } from '@prisma/client'

export { AppError as SubscriptionError }

// Statuses that retain premium access while payment resolves
const PREMIUM_STATUSES = new Set(['active', 'trialing', 'past_due'])

export function toSafeSubscription(sub: Subscription): SafeSubscription {
  return {
    id: sub.id,
    plan: sub.plan,
    status: sub.status,
    stripeCurrentPeriodEnd: sub.stripeCurrentPeriodEnd,
    createdAt: sub.createdAt,
    updatedAt: sub.updatedAt,
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

export async function renewSubscription(stripeSubscriptionId: string, periodEnd: Date): Promise<void> {
  const result = await prisma.subscription.updateMany({
    where: { stripeSubscriptionId },
    data: { stripeCurrentPeriodEnd: periodEnd, status: 'active' },
  })
  // If checkout.session.completed hasn't fired yet, record won't exist.
  // Throw so Stripe retries after it does.
  if (result.count === 0) {
    throw new AppError('SUBSCRIPTION_NOT_FOUND', 'Subscription not found; will be retried', 404)
  }
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
  // trialing and past_due retain premium while payment resolves;
  // only canceled/unpaid/incomplete_expired revoke access immediately.
  const plan = PREMIUM_STATUSES.has(status) ? 'premium' : 'free'
  await prisma.subscription.update({
    where: { stripeSubscriptionId },
    data: { status, plan },
  })
}
