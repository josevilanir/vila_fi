import { describe, it, expect } from 'vitest'
import { isPremium, canSaveMorePresets } from './planFeatures'

function sub(overrides: Partial<{ plan: string; status: string; stripeCurrentPeriodEnd: Date | string | null }> = {}) {
  return {
    plan: 'premium',
    status: 'active',
    stripeCurrentPeriodEnd: new Date(Date.now() + 86_400_000), // tomorrow
    ...overrides,
  }
}

describe('isPremium', () => {
  it('returns false for null', () => {
    expect(isPremium(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isPremium(undefined)).toBe(false)
  })

  it('returns true for an active premium subscription that has not expired', () => {
    expect(isPremium(sub())).toBe(true)
  })

  it('returns false when the plan is not premium', () => {
    expect(isPremium(sub({ plan: 'free' }))).toBe(false)
  })

  it('returns false when the status is not active', () => {
    expect(isPremium(sub({ status: 'canceled' }))).toBe(false)
  })

  it('returns false when the period end date is in the past', () => {
    expect(isPremium(sub({ stripeCurrentPeriodEnd: new Date(Date.now() - 1000) }))).toBe(false)
  })

  it('returns false when stripeCurrentPeriodEnd is null', () => {
    expect(isPremium(sub({ stripeCurrentPeriodEnd: null }))).toBe(false)
  })

  it('accepts an ISO string for the period end', () => {
    const future = new Date(Date.now() + 86_400_000).toISOString()
    expect(isPremium(sub({ stripeCurrentPeriodEnd: future }))).toBe(true)
  })
})

describe('canSaveMorePresets', () => {
  it('always returns true for premium users regardless of count', () => {
    expect(canSaveMorePresets(sub(), 0)).toBe(true)
    expect(canSaveMorePresets(sub(), 10)).toBe(true)
  })

  it('returns true for free users below the limit', () => {
    expect(canSaveMorePresets(null, 0)).toBe(true)
    expect(canSaveMorePresets(null, 1)).toBe(true)
  })

  it('returns false for free users at or above the limit of 2', () => {
    expect(canSaveMorePresets(null, 2)).toBe(false)
    expect(canSaveMorePresets(null, 5)).toBe(false)
  })
})
