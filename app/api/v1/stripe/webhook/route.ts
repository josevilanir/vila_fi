import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import {
  activateSubscription,
  renewSubscription,
  cancelSubscription,
  updateSubscriptionStatus,
} from '@/services/subscription.service'

function getPeriodEnd(subscription: Stripe.Subscription): Date {
  const item = subscription.items.data[0]
  return new Date(item.current_period_end * 1000)
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (e) {
    console.error('[webhook] signature verification failed', e)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== 'subscription' || !session.subscription) break

        const subscription = await getStripe().subscriptions.retrieve(session.subscription as string, {
          expand: ['items'],
        })
        const item = subscription.items.data[0]
        await activateSubscription(
          session.customer as string,
          subscription.id,
          item.price.id,
          getPeriodEnd(subscription),
        )
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subId =
          invoice.parent?.subscription_details?.subscription != null
            ? typeof invoice.parent.subscription_details.subscription === 'string'
              ? invoice.parent.subscription_details.subscription
              : invoice.parent.subscription_details.subscription.id
            : null
        if (!subId) break

        const subscription = await getStripe().subscriptions.retrieve(subId, { expand: ['items'] })
        await renewSubscription(subscription.id, getPeriodEnd(subscription))
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await cancelSubscription(subscription.id)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await updateSubscriptionStatus(subscription.id, subscription.status)
        break
      }

      default:
        break
    }
  } catch (e) {
    console.error(`[webhook] error processing ${event.type}`, e)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
