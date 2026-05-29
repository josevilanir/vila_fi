interface SubscriptionLike {
  plan: string
  status: string
  stripeCurrentPeriodEnd: Date | string | null
}

export function isPremium(subscription: SubscriptionLike | null | undefined): boolean {
  if (!subscription) return false
  if (subscription.plan !== 'premium') return false
  if (subscription.status !== 'active') return false
  if (!subscription.stripeCurrentPeriodEnd) return false
  return new Date(subscription.stripeCurrentPeriodEnd) > new Date()
}

export function canSaveMorePresets(
  subscription: SubscriptionLike | null | undefined,
  currentCount: number,
): boolean {
  if (isPremium(subscription)) return true
  return currentCount < 2
}
