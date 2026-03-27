import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { resolveOrg, resolveRole } from '@/lib/utils/tenant'
import { Organisation } from '@/lib/db/models/Organisation'
import { Member } from '@/lib/db/models/Member'
import { Workspace } from '@/lib/db/models/Workspace'
import { stripe } from '@/lib/stripe/client'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?.sub
    const orgSlug = req.headers.get('x-org-slug')

    if (!userId || !orgSlug) {
      return NextResponse.json({ error: 'Unauthorized', code: '401' }, { status: 401 })
    }

    await connectDB()
    const org = await resolveOrg(orgSlug)
    if (!org) {
      return NextResponse.json({ error: 'Not Found', code: '404' }, { status: 404 })
    }

    const role = await resolveRole(userId, org._id)
    if (!role) {
      return NextResponse.json({ error: 'Forbidden', code: '403' }, { status: 403 })
    }

    const [memberCount, workspaceCount] = await Promise.all([
      Member.countDocuments({ orgId: org._id }),
      Workspace.countDocuments({ orgId: org._id }),
    ])

    return NextResponse.json({ org, role, memberCount, workspaceCount })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Error', code: '500' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?.sub
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized', code: '401' }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Missing defined fields', code: '400' }, { status: 400 })
    }

    await connectDB()

    const existing = await Organisation.findOne({ slug })
    if (existing) {
      return NextResponse.json({ error: 'Slug in use', code: '409' }, { status: 409 })
    }

    // Create Stripe customer if key exists
    let stripeCustomerId = "dummy_id_" + Date.now()
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const customer = await stripe.customers.create({
          name,
          metadata: { orgSlug: slug },
        })
        stripeCustomerId = customer.id
      } catch (e: any) {
        console.error("Stripe Skipped:", e.message)
      }
    }

    const org = await Organisation.create({
      name,
      slug,
      stripeCustomerId,
    })

    const workspace = await Workspace.create({
      name: 'General Workspace',
      slug: 'general',
      orgId: org._id,
    })

    await Member.create({
      userId,
      orgId: org._id,
      workspaceId: workspace._id,
      role: 'owner',
    })

    return NextResponse.json(org)
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Slug in use', code: '409' }, { status: 409 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Internal Error', code: '500' }, { status: 500 })
  }
}
