import { Redis } from '@upstash/redis'
import { IOrganisation } from '@/types'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function cacheOrg(slug: string, org: IOrganisation) {
  await redis.set(`org:${slug}`, JSON.stringify(org), { ex: 60 })
}

export async function getOrg(slug: string): Promise<IOrganisation | null> {
  const data = await redis.get<string>(`org:${slug}`)
  if (!data) return null
  try {
    return typeof data === 'string' ? JSON.parse(data) : data
  } catch {
    return null
  }
}
