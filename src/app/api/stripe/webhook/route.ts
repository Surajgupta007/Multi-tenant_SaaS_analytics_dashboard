import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { connectDB } from '@/lib/db/mongoose'
import { Organisation } from '@/lib/db/models/Organisation'
import { PLAN_LIMITS, getPlanFromPriceId } from '@/lib/stripe/plans'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature') as string

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: 'Invalid signature', code: '400' }, { status: 400 })
    }

    await connectDB()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const orgId = session.metadata?.orgId
        const priceId = session.line_items?.data[0]?.price?.id

        if (orgId && session.subscription && priceId) {
          const plan = getPlanFromPriceId(priceId)
          await Organisation.findByIdAndUpdate(orgId, {
            stripeSubscriptionId: session.subscription,
            stripeCustomerId: session.customer as string,
            stripePriceId: priceId,
            plan,
            maxWorkspaces: PLAN_LIMITS[plan].maxWorkspaces,
            maxMembers: PLAN_LIMITS[plan].maxMembers,
            status: 'active',
          })
        }
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        const priceId = subscription.items.data[0].price.id
        const plan = getPlanFromPriceId(priceId)

        await Organisation.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            plan,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            maxWorkspaces: PLAN_LIMITS[plan].maxWorkspaces,
            maxMembers: PLAN_LIMITS[plan].maxMembers,
            status: subscription.status === 'active' || subscription.status === 'trialing' ? 'active' : 'suspended',
          }
        )
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await Organisation.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            plan: 'free',
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            maxWorkspaces: PLAN_LIMITS['free'].maxWorkspaces,
            maxMembers: PLAN_LIMITS['free'].maxMembers,
            status: 'active',
          }
        )
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any
        if (invoice.subscription) {
          await Organisation.findOneAndUpdate(
            { stripeSubscriptionId: invoice.subscription as string },
            { status: 'suspended' }
          )
        }
        break
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error(`Webhook handler error:`, error)
    // Always return 200 so Stripe doesn't endlessly retry unhandled internal errors
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
