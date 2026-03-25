export type Plan = 'free' | 'pro' | 'enterprise'
export type Role = 'owner' | 'admin' | 'member'
export type OrgStatus = 'active' | 'suspended' | 'cancelled'

export interface IUser {
  _id: string
  name: string
  email: string
  password?: string
  image?: string
  stripeCustomerId?: string
  createdAt: Date
}

export interface IOrganisation {
  _id: string
  name: string
  slug: string
  plan: Plan
  status: OrgStatus
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  stripePriceId?: string
  stripeCurrentPeriodEnd?: Date
  maxWorkspaces: number
  maxMembers: number
  createdAt: Date
}

export interface IWorkspace {
  _id: string
  name: string
  slug: string
  orgId: string
  createdAt: Date
}

export interface IMember {
  _id: string
  userId: string
  orgId: string
  workspaceId: string
  role: Role
  createdAt: Date
}

export interface IAnalyticsEvent {
  _id: string
  orgId: string
  workspaceId: string
  event: string
  userId?: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

export interface TenantContext {
  orgId: string
  orgSlug: string
  plan: Plan
  userId: string
  role: Role
}

export interface PlanLimits {
  maxWorkspaces: number
  maxMembers: number
  analyticsRetentionDays: number
}
