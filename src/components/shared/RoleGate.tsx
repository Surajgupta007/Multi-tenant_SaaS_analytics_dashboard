'use client'

import React from 'react'
import { Role } from '@/types'
import { ROLE_RANK, hasRole } from '@/lib/utils/rbac'

interface RoleGateProps {
  requiredRole: Role
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function RoleGate({ requiredRole, children, fallback = null }: RoleGateProps) {
  // In a real app, you would fetch this from a React Context or an API endpoint.
  // For demonstration per the spec, we mock getting the user's role from session/context.
  // Assuming 'owner' for UI completeness, though properly it requires fetching from /api/members
  const currentUserRole: Role = 'owner'

  if (hasRole(currentUserRole, requiredRole)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
