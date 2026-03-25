import { Role, TenantContext } from '@/types'

export const ROLE_RANK: Record<Role, number> = {
  owner: 3,
  admin: 2,
  member: 1,
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_RANK[userRole] >= ROLE_RANK[requiredRole]
}

export function withRoleGuard(context: TenantContext, requiredRole: Role) {
  if (!hasRole(context.role, requiredRole)) {
    const error = new Error('Insufficient permissions')
    ;(error as any).status = 403
    throw error
  }
}
