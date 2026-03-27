import { Redis } from '@upstash/redis'
import { IOrganisation } from '@/types'

export const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

export async function cacheOrg(slug: string, org: IOrganisation) {
  if (!redis) return;
  await redis.set(`org:${slug}`, JSON.stringify(org), { ex: 60 })
}

export async function getOrg(slug: string): Promise<IOrganisation | null> {
  if (!redis) return null;
  const data = await redis.get<string>(`org:${slug}`)
  if (!data) return null
  try {
    return typeof data === 'string' ? JSON.parse(data) : data
  } catch {
    return null
  }
}
