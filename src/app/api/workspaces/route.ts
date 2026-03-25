import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { resolveOrg, resolveRole } from '@/lib/utils/tenant'
import { Workspace } from '@/lib/db/models/Workspace'
import { Member } from '@/lib/db/models/Member'
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

    const workspaces = await Workspace.find({ orgId: org._id })
    return NextResponse.json(workspaces)
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

    const workspaceCount = await Workspace.countDocuments({ orgId: org._id })
    if (workspaceCount >= org.maxWorkspaces) {
      return NextResponse.json({ error: 'Workspace limit reached', code: '403' }, { status: 403 })
    }

    const { name, slug } = await req.json()
    if (!name || !slug) return NextResponse.json({ error: 'Missing fields', code: '400' }, { status: 400 })

    const workspace = await Workspace.create({ name, slug, orgId: org._id })
    return NextResponse.json(workspace)
  } catch (error: any) {
    if (error.status) return NextResponse.json({ error: error.message, code: String(error.status) }, { status: error.status })
    if (error.code === 11000) return NextResponse.json({ error: 'Slug in use', code: '409' }, { status: 409 })
    
    console.error(error)
    return NextResponse.json({ error: 'Internal Error', code: '500' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    const orgSlug = req.headers.get('x-org-slug')
    const url = new URL(req.url)
    const workspaceId = url.searchParams.get('id')

    if (!userId || !orgSlug || !workspaceId) return NextResponse.json({ error: 'Missing params', code: '400' }, { status: 400 })

    await connectDB()
    const org = await resolveOrg(orgSlug)
    if (!org) return NextResponse.json({ error: 'Not Found', code: '404' }, { status: 404 })

    const role = await resolveRole(userId, org._id)
    if (!role) return NextResponse.json({ error: 'Forbidden', code: '403' }, { status: 403 })

    const context: TenantContext = { orgId: org._id, orgSlug, plan: org.plan, userId, role }
    withRoleGuard(context, 'admin')

    await Workspace.findOneAndDelete({ _id: workspaceId, orgId: org._id })
    await Member.deleteMany({ workspaceId, orgId: org._id })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.status) return NextResponse.json({ error: error.message, code: String(error.status) }, { status: error.status })
    console.error(error)
    return NextResponse.json({ error: 'Internal Error', code: '500' }, { status: 500 })
  }
}
