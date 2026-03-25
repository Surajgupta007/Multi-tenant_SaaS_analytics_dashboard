import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { resolveOrg, resolveRole } from '@/lib/utils/tenant'
import { AnalyticsEvent } from '@/lib/db/models/AnalyticsEvent'
import { PLAN_LIMITS } from '@/lib/stripe/plans'

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    const orgSlug = req.headers.get('x-org-slug')

    if (!userId || !orgSlug) return NextResponse.json({ error: 'Unauthorized', code: '401' }, { status: 401 })

    await connectDB()
    const org = await resolveOrg(orgSlug)
    if (!org) return NextResponse.json({ error: 'Not Found', code: '404' }, { status: 404 })

    const role = await resolveRole(userId, org._id)
    if (!role) return NextResponse.json({ error: 'Forbidden', code: '403' }, { status: 403 })

    const url = new URL(req.url)
    const workspaceId = url.searchParams.get('workspaceId')
    
    // Retention limits
    const retentionDays = PLAN_LIMITS[org.plan].analyticsRetentionDays
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    const matchStage: any = {
      orgId: org._id,
      createdAt: { $gte: cutoffDate },
    }

    if (workspaceId) {
      matchStage.workspaceId = workspaceId
    }

    // Aggregate by day
    const data = await AnalyticsEvent.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    const labels = data.map(d => d._id)
    const events = data.map(d => d.count)

    return NextResponse.json({ labels, datasets: { events } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Error', code: '500' }, { status: 500 })
  }
}
