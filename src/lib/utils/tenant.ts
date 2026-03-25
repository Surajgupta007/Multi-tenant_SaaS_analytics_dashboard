import { getOrg, cacheOrg } from '@/lib/redis/client'
import { Organisation } from '@/lib/db/models/Organisation'
import { Member } from '@/lib/db/models/Member'
import { IOrganisation, Role } from '@/types'

export async function resolveOrg(slug: string): Promise<IOrganisation | null> {
  // 1. Check Redis cache
  const cachedOrg = await getOrg(slug)
  if (cachedOrg) return cachedOrg

  // 2. Query MongoDB if not in cache
  const org = await Organisation.findOne({ slug }).lean() as IOrganisation | null
  
  if (!org) return null

  // 3. Cache the result
  await cacheOrg(slug, org)
  
  return org
}

export async function resolveRole(userId: string, orgId: string): Promise<Role | null> {
  const member = await Member.findOne({ userId, orgId }).lean() as { role?: string } | null
  return member ? (member.role as Role) : null
}
