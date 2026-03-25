import { connectDB } from '@/lib/db/mongoose'
import { resolveOrg } from '@/lib/utils/tenant'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import PlanBadge from '@/components/shared/PlanBadge'
import RoleGate from '@/components/shared/RoleGate'
import { redirect } from 'next/navigation'

export default async function BillingPage({ params, searchParams }: { params: { orgSlug: string }, searchParams: { success?: string } }) {
  await connectDB()
  const org = await resolveOrg(params.orgSlug)

  if (!org) redirect('/login')

  const plans = [
    {
      name: 'free',
      price: '$0',
      description: 'Perfect for getting started',
      features: ['Up to 3 members', '1 workspace', '7 days data retention', 'Community support'],
      priceId: process.env.STRIPE_FREE_PRICE_ID
    },
    {
      name: 'pro',
      price: '$29',
      description: 'For growing teams',
      features: ['Up to 25 members', '10 workspaces', '90 days data retention', 'Priority support'],
      priceId: process.env.STRIPE_PRO_PRICE_ID
    },
    {
      name: 'enterprise',
      price: '$99',
      description: 'For large organizations',
      features: ['Unlimited members', 'Unlimited workspaces', '1 year data retention', '24/7 dedicated support'],
      priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID
    }
  ] as const

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground mt-2">Manage your subscription and billing details.</p>
      </div>

      {searchParams.success && (
        <div className="bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400 p-4 rounded-md border border-emerald-200 dark:border-emerald-800">
          Subscription updated successfully! Your account features have been unlocked.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your organization is currently on the <strong className="capitalize">{org.plan}</strong> plan.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium flex items-center gap-2">
              Status: <PlanBadge plan={org.plan} />
            </p>
            {org.stripeCurrentPeriodEnd && (
              <p className="text-sm text-muted-foreground">
                Next billing date: {new Date(org.stripeCurrentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          <RoleGate requiredRole="admin">
            <Button variant="outline">Manage Billing</Button>
            {/* The actual manage billing button would POST to /api/stripe/portal */}
          </RoleGate>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.name} className={org.plan === p.name ? 'border-primary ring-1 ring-primary' : ''}>
            <CardHeader>
              <CardTitle className="capitalize">{p.name}</CardTitle>
              <CardDescription>{p.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-2">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <RoleGate requiredRole="owner">
                {org.plan === p.name ? (
                  <Button className="w-full" disabled variant="outline">Current Plan</Button>
                ) : (
                  <form action={`/api/stripe/checkout`} method="POST" className="w-full">
                    <input type="hidden" name="priceId" value={p.priceId} />
                    <input type="hidden" name="orgId" value={org._id} />
                    <Button type="submit" className="w-full">Upgrade</Button>
                  </form>
                )}
              </RoleGate>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
