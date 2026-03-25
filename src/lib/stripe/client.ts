import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20' as any,
  appInfo: {
    name: 'SaaSLytics Dashboard',
  },
})

export async function createCheckoutSession(
  orgId: string,
  priceId: string,
  customerId?: string
) {
  return await stripe.checkout.sessions.create({
    customer: customerId || undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/{orgSlug}/billing?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/{orgSlug}/billing`,
    metadata: { orgId },
  })
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}
