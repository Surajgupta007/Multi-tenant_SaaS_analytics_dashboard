import { Plan, PlanLimits } from '@/types'

export const PLAN_LIMITS = {
  free: {
    maxWorkspaces: 1,
    maxMembers: 3,
    analyticsRetentionDays: 7,
  },
  pro: {
    maxWorkspaces: 10,
    maxMembers: 25,
    analyticsRetentionDays: 90,
  },
  enterprise: {
    maxWorkspaces: 999,
    maxMembers: 999,
    analyticsRetentionDays: 365,
  },
} satisfies Record<Plan, PlanLimits>

export function getPlanFromPriceId(priceId: string): Plan {
  const map: Record<string, Plan> = {
    [process.env.STRIPE_FREE_PRICE_ID!]: 'free',
    [process.env.STRIPE_PRO_PRICE_ID!]: 'pro',
    [process.env.STRIPE_ENTERPRISE_PRICE_ID!]: 'enterprise',
  }
  return map[priceId] ?? 'free'
}
