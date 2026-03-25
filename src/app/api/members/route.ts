import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { resolveOrg, resolveRole } from '@/lib/utils/tenant'
import { Member } from '@/lib/db/models/Member'
import { User } from '@/lib/db/models/User' // Needed for populate
import { TenantContext } from '@/types'
import { withRoleGuard } from '@/lib/utils/rbac'

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

    const members = await Member.find({ orgId: org._id }).populate('userId', 'name email image')
    return NextResponse.json(members)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Error', code: '500' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    const orgSlug = req.headers.get('x-org-slug')

    if (!userId || !orgSlug) return NextResponse.json({ error: 'Unauthorized', code: '401' }, { status: 401 })

    await connectDB()
    const org = await resolveOrg(orgSlug)
    if (!org) return NextResponse.json({ error: 'Not Found', code: '404' }, { status: 404 })

    const role = await resolveRole(userId, org._id)
    if (!role) return NextResponse.json({ error: 'Forbidden', code: '403' }, { status: 403 })

    const context: TenantContext = { orgId: org._id, orgSlug, plan: org.plan, userId, role }
    withRoleGuard(context, 'admin')

    const memberCount = await Member.countDocuments({ orgId: org._id })
    if (memberCount >= org.maxMembers) {
      return NextResponse.json({ error: 'Member limit reached', code: '403' }, { status: 403 })
    }

    const { targetUserId, workspaceId, assignRole } = await req.json()
    if (!targetUserId || !workspaceId) return NextResponse.json({ error: 'Missing fields', code: '400' }, { status: 400 })

    const member = await Member.create({
      userId: targetUserId,
      orgId: org._id,
      workspaceId,
      role: assignRole || 'member',
    })

    return NextResponse.json(member)
  } catch (error: any) {
    if (error.status) return NextResponse.json({ error: error.message, code: String(error.status) }, { status: error.status })
    if (error.code === 11000) return NextResponse.json({ error: 'Already a member', code: '409' }, { status: 409 })
    console.error(error)
    return NextResponse.json({ error: 'Internal Error', code: '500' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    const orgSlug = req.headers.get('x-org-slug')

    if (!userId || !orgSlug) return NextResponse.json({ error: 'Unauthorized', code: '401' }, { status: 401 })

    await connectDB()
    const org = await resolveOrg(orgSlug)
    if (!org) return NextResponse.json({ error: 'Not Found', code: '404' }, { status: 404 })

    const role = await resolveRole(userId, org._id)
    if (!role) return NextResponse.json({ error: 'Forbidden', code: '403' }, { status: 403 })

    const context: TenantContext = { orgId: org._id, orgSlug, plan: org.plan, userId, role }
    withRoleGuard(context, 'admin')

    const { memberId, newRole } = await req.json()
    if (!memberId || !newRole) return NextResponse.json({ error: 'Missing fields', code: '400' }, { status: 400 })

    const targetMember = await Member.findOne({ _id: memberId, orgId: org._id })
    if (!targetMember) return NextResponse.json({ error: 'Member not found', code: '404' }, { status: 404 })

    if (targetMember.role === 'owner') {
      return NextResponse.json({ error: 'Cannot modify owner role', code: '403' }, { status: 403 })
    }

    targetMember.role = newRole
    await targetMember.save()

    return NextResponse.json(targetMember)
  } catch (error: any) {
    if (error.status) return NextResponse.json({ error: error.message, code: String(error.status) }, { status: error.status })
    console.error(error)
    return NextResponse.json({ error: 'Internal Error', code: '500' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    const orgSlug = req.headers.get('x-org-slug')
    const url = new URL(req.url)
    const memberId = url.searchParams.get('id')

    if (!userId || !orgSlug || !memberId) return NextResponse.json({ error: 'Missing params', code: '400' }, { status: 400 })

    await connectDB()
    const org = await resolveOrg(orgSlug)
    if (!org) return NextResponse.json({ error: 'Not Found', code: '404' }, { status: 404 })

    const role = await resolveRole(userId, org._id)
    if (!role) return NextResponse.json({ error: 'Forbidden', code: '403' }, { status: 403 })

    const context: TenantContext = { orgId: org._id, orgSlug, plan: org.plan, userId, role }
    withRoleGuard(context, 'admin')

    const targetMember = await Member.findOne({ _id: memberId, orgId: org._id })
    if (!targetMember) return NextResponse.json({ error: 'Member not found', code: '404' }, { status: 404 })

    if (targetMember.role === 'owner') {
      return NextResponse.json({ error: 'Cannot remove owner', code: '403' }, { status: 403 })
    }

    await Member.deleteOne({ _id: memberId, orgId: org._id })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.status) return NextResponse.json({ error: error.message, code: String(error.status) }, { status: error.status })
    console.error(error)
    return NextResponse.json({ error: 'Internal Error', code: '500' }, { status: 500 })
  }
}
